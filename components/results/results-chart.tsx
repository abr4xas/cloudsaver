"use client";

import { memo } from "react";
import { Card } from "@/components/ui/card";
import { LockedContent } from "@/components/ui/locked-content";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CHART_COLORS } from "@/lib/constants";

interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface ResultsChartProps {
    chartData: ChartData[];
    topRecommendationType: string;
    isPro: boolean;
}

function ResultsChartComponent({
    chartData,
    topRecommendationType,
    isPro,
}: ResultsChartProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold">Cost Distribution</h3>
            <LockedContent
                isLocked={!isPro}
                blurIntensity="lg"
                ctaText="Upgrade to Pro"
            >
                <Card className="p-6 bg-white/5 border-white/5 h-90 flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            CHART_COLORS[
                                                index % CHART_COLORS.length
                                            ]
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: "#09090b",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: "8px",
                                }}
                                itemStyle={{ color: "#fff" }}
                                formatter={(value: number | undefined) => [
                                    value && value > 0
                                        ? `$${value.toFixed(2)}/mo`
                                        : "Optimized",
                                    "Savings",
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="text-center mt-4">
                        <div className="text-sm text-muted-foreground">
                            Top Optimization Category
                        </div>
                        <div className="font-semibold text-lg">
                            {topRecommendationType || "General"}
                        </div>
                    </div>
                </Card>
            </LockedContent>
        </div>
    );
}

// Memoize ResultsChart to prevent unnecessary re-renders
export const ResultsChart = memo(ResultsChartComponent);
