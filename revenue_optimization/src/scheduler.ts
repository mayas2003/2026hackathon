import { Ad, Area, Schedule, ScheduledAd, PlacementEngine } from './placementEngine';
import { RevenueEngine } from './revenueEngine';

export class Scheduler {
    placementEngine: PlacementEngine;
    revenueEngine: RevenueEngine;

    constructor(placementEngine: PlacementEngine, revenueEngine: RevenueEngine) {
        this.placementEngine = placementEngine;
        this.revenueEngine = revenueEngine;
    }

    getNextAvailableStartTime(areaSchedule: ScheduledAd[]): number {
        if (areaSchedule.length === 0) {
            return 0;
        }

        const sorted = [...areaSchedule].sort(
            (a, b) => a.startTime - b.startTime
        );

        let currentTime = 0;

        for (const scheduled of sorted) {
            if (scheduled.startTime > currentTime) {
                // We found the first hole in this area's timeline.
                return currentTime;
            }
            if (scheduled.endTime > currentTime) {
                currentTime = scheduled.endTime;
            }
        }

        // If we never saw a gap, we can only continue after the last ad.
        return currentTime;
    }

    isValidSchedule(
        schedule: Schedule,
        areas: Area[],
        ads: Ad[]
    ): boolean {
        const areaMap: Record<string, Area> = {};
        for (const area of areas) {
            areaMap[area.areaId] = area;
        }

        const adMap: Record<string, Ad> = {};
        for (const ad of ads) {
            adMap[ad.adId] = ad;
        }

        const seenAdIds = new Set<string>();

        // First pass: make sure area ids are known and no ad is double‑booked globally.
        for (const [areaIdKey, areaSchedule] of Object.entries(schedule)) {
            const area = areaMap[areaIdKey];
            if (!area) {
                // Someone scheduled ads for a non‑existent area.
                return false;
            }

            for (const scheduled of areaSchedule) {
                // Every scheduled ad must point at a real ad definition.
                if (!adMap[scheduled.adId]) {
                    return false;
                }

                // The scheduled entry should honestly report which area bucket it's in.
                if (scheduled.areaId !== areaIdKey) {
                    return false;
                }

                // An ad can only appear once across the entire venue.
                if (seenAdIds.has(scheduled.adId)) {
                    return false;
                }
                seenAdIds.add(scheduled.adId);
            }
        }

        // Second pass: delegate per‑area sanity checks to the placement engine.
        for (const area of areas) {
            const areaSchedule = schedule[area.areaId] ?? [];
            if (!this.placementEngine.isAreaScheduleValid(area, areaSchedule, ads)) {
                return false;
            }
        }

        return true;
    }

    compareSchedules(
        ads: Ad[],
        areas: Area[],
        scheduleA: Schedule,
        scheduleB: Schedule,
        decayRate: number
    ): number {
        const computeMetrics = (schedule: Schedule) => {
            let totalRevenue = 0;
            let totalUnusedTime = 0;

            for (const area of areas) {
                totalRevenue += this.revenueEngine.getAreaRevenue(
                    area,
                    areas,
                    schedule,
                    ads,
                    decayRate
                );

                const areaSchedule = schedule[area.areaId] ?? [];
                const usedTime = this.placementEngine.getTotalScheduledTimeForArea(
                    areaSchedule
                );
                const unused = area.timeWindow - usedTime;
                totalUnusedTime += unused;
            }

            const diversity = this.revenueEngine.getAdvertiserDiversity(
                ads,
                schedule
            );

            return {
                totalRevenue,
                totalUnusedTime,
                diversity,
            };
        };

        const metricsA = computeMetrics(scheduleA);
        const metricsB = computeMetrics(scheduleB);

        if (metricsA.totalRevenue !== metricsB.totalRevenue) {
            return metricsA.totalRevenue - metricsB.totalRevenue;
        }

        if (metricsA.totalUnusedTime !== metricsB.totalUnusedTime) {
            // If money is the same, prefer schedules that waste less screen time.
            return metricsB.totalUnusedTime - metricsA.totalUnusedTime;
        }

        if (metricsA.diversity !== metricsB.diversity) {
            return metricsA.diversity - metricsB.diversity;
        }

        return 0;
    }

    buildSchedule(
        ads: Ad[],
        areas: Area[],
        decayRate: number
        ): Schedule {
        // No ads means nothing to do, return an empty plan.
        if (ads.length === 0) {
            return {};
        }

        const schedule: Schedule = {};
        const scheduledAdIds = new Set<string>();

        while (true) {
            let placedSomething = false;

            for (const area of areas) {
                const areaSchedule = schedule[area.areaId] ?? [];
                const startTime = this.getNextAvailableStartTime(areaSchedule);

                for (const ad of ads) {
                    if (scheduledAdIds.has(ad.adId)) {
                        continue;
                    }

                    if (
                        this.placementEngine.canScheduleAd(
                            ad,
                            area,
                            schedule,
                            startTime
                        )
                    ) {
                        const endTime = startTime + ad.duration;
                        if (!schedule[area.areaId]) {
                            schedule[area.areaId] = [];
                        }
                        schedule[area.areaId].push({
                            adId: ad.adId,
                            areaId: area.areaId,
                            startTime,
                            endTime,
                        });

                        scheduledAdIds.add(ad.adId);
                        placedSomething = true;
                        break;
                    }
                }
            }

            if (!placedSomething) {
                break;
            }
        }

        return schedule;
    }
}
