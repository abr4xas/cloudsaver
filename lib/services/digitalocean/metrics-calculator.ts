/**
 * Metrics Calculator for DigitalOcean Droplets
 *
 * Calculates various metrics from raw DigitalOcean monitoring data,
 * including averages, percentiles, and usage percentages.
 */

export interface MetricDataPoint {
    metric: Record<string, string>;
    values: Array<[number, string]>; // [timestamp, value]
}

export class MetricsCalculator {
    /**
     * Calculate average CPU usage from metrics
     *
     * @param metrics - Array of metric data points from DigitalOcean API
     * @returns Average CPU usage percentage (0-100)
     */
    calculateAverageCPU(metrics: MetricDataPoint[]): number {
        if (!metrics || metrics.length === 0) {
            return 0;
        }

        const allValues: number[] = [];

        for (const metric of metrics) {
            if (metric.values && Array.isArray(metric.values)) {
                for (const [, valueStr] of metric.values) {
                    const value = parseFloat(valueStr);
                    if (!isNaN(value) && value >= 0) {
                        allValues.push(value);
                    }
                }
            }
        }

        if (allValues.length === 0) {
            return 0;
        }

        const sum = allValues.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / allValues.length) * 100) / 100;
    }

    /**
     * Calculate average memory usage percentage from free memory metrics
     *
     * @param freeMemoryMetrics - Array of free memory metric data points
     * @param totalMemoryMB - Total memory in MB
     * @returns Average memory usage percentage (0-100)
     */
    calculateAverageMemoryUsage(
        freeMemoryMetrics: MetricDataPoint[],
        totalMemoryMB: number
    ): number {
        if (!freeMemoryMetrics || freeMemoryMetrics.length === 0) {
            return 0;
        }

        if (totalMemoryMB <= 0) {
            return 0;
        }

        const usagePercentages: number[] = [];

        for (const metric of freeMemoryMetrics) {
            if (metric.values && Array.isArray(metric.values)) {
                for (const [, valueStr] of metric.values) {
                    const freeMemoryMB = parseFloat(valueStr);
                    if (!isNaN(freeMemoryMB) && freeMemoryMB >= 0) {
                        const usedMemoryMB = totalMemoryMB - freeMemoryMB;
                        const usagePercent = (usedMemoryMB / totalMemoryMB) * 100;
                        if (usagePercent >= 0 && usagePercent <= 100) {
                            usagePercentages.push(usagePercent);
                        }
                    }
                }
            }
        }

        if (usagePercentages.length === 0) {
            return 0;
        }

        const sum = usagePercentages.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / usagePercentages.length) * 100) / 100;
    }

    /**
     * Calculate percentile CPU usage from metrics
     *
     * @param metrics - Array of metric data points
     * @param percentile - Percentile to calculate (default: 95)
     * @returns Percentile CPU usage percentage (0-100)
     */
    calculatePercentileCPU(
        metrics: MetricDataPoint[],
        percentile = 95
    ): number {
        if (!metrics || metrics.length === 0) {
            return 0;
        }

        const allValues: number[] = [];

        for (const metric of metrics) {
            if (metric.values && Array.isArray(metric.values)) {
                for (const [, valueStr] of metric.values) {
                    const value = parseFloat(valueStr);
                    if (!isNaN(value) && value >= 0) {
                        allValues.push(value);
                    }
                }
            }
        }

        if (allValues.length === 0) {
            return 0;
        }

        // Sort values in ascending order
        allValues.sort((a, b) => a - b);

        // Calculate percentile index
        const index = Math.ceil((percentile / 100) * allValues.length) - 1;
        const clampedIndex = Math.max(0, Math.min(index, allValues.length - 1));

        return Math.round(allValues[clampedIndex] * 100) / 100;
    }

    /**
     * Calculate percentile memory usage from free memory metrics
     *
     * @param freeMemoryMetrics - Array of free memory metric data points
     * @param totalMemoryMB - Total memory in MB
     * @param percentile - Percentile to calculate (default: 95)
     * @returns Percentile memory usage percentage (0-100)
     */
    calculatePercentileMemory(
        freeMemoryMetrics: MetricDataPoint[],
        totalMemoryMB: number,
        percentile = 95
    ): number {
        if (!freeMemoryMetrics || freeMemoryMetrics.length === 0) {
            return 0;
        }

        if (totalMemoryMB <= 0) {
            return 0;
        }

        const usagePercentages: number[] = [];

        for (const metric of freeMemoryMetrics) {
            if (metric.values && Array.isArray(metric.values)) {
                for (const [, valueStr] of metric.values) {
                    const freeMemoryMB = parseFloat(valueStr);
                    if (!isNaN(freeMemoryMB) && freeMemoryMB >= 0) {
                        const usedMemoryMB = totalMemoryMB - freeMemoryMB;
                        const usagePercent = (usedMemoryMB / totalMemoryMB) * 100;
                        if (usagePercent >= 0 && usagePercent <= 100) {
                            usagePercentages.push(usagePercent);
                        }
                    }
                }
            }
        }

        if (usagePercentages.length === 0) {
            return 0;
        }

        // Sort values in ascending order
        usagePercentages.sort((a, b) => a - b);

        // Calculate percentile index
        const index =
            Math.ceil((percentile / 100) * usagePercentages.length) - 1;
        const clampedIndex = Math.max(
            0,
            Math.min(index, usagePercentages.length - 1)
        );

        return Math.round(usagePercentages[clampedIndex] * 100) / 100;
    }

    /**
     * Calculate average load average from metrics
     *
     * @param metrics - Array of load average metric data points
     * @returns Average load average value
     */
    calculateAverageLoadAverage(metrics: MetricDataPoint[]): number {
        if (!metrics || metrics.length === 0) {
            return 0;
        }

        const allValues: number[] = [];

        for (const metric of metrics) {
            if (metric.values && Array.isArray(metric.values)) {
                for (const [, valueStr] of metric.values) {
                    const value = parseFloat(valueStr);
                    if (!isNaN(value) && value >= 0) {
                        allValues.push(value);
                    }
                }
            }
        }

        if (allValues.length === 0) {
            return 0;
        }

        const sum = allValues.reduce((acc, val) => acc + val, 0);
        return Math.round((sum / allValues.length) * 100) / 100;
    }
}
