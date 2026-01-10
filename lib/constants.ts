/**
 * Application Constants
 *
 * Centralized constants to avoid magic numbers and improve maintainability
 */

// Animation & Timing Constants
export const ANIMATION_DURATIONS = {
    SHAKE: 500, // milliseconds
    ANALYSIS_ESTIMATED: 15000, // 15 seconds
    ANALYSIS_MIN_WAIT_PERCENT: 0.6, // 60% of estimated duration
    ANALYSIS_COMPLETE_DELAY: 500, // milliseconds
    TYPEWRITER_PAUSE: 2000, // milliseconds
    NUMBER_ANIMATION: 2000, // milliseconds
} as const;

// UI Constants
export const TRANSITION_DURATIONS = {
    DEFAULT: 500, // milliseconds
    LONG: 1000, // milliseconds
} as const;

// Chart Constants
export const CHART_COLORS = [
    "#8b5cf6", // purple
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
] as const;

// Confidence Level Styles
export const CONFIDENCE_STYLES = {
    HIGH: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    LOW: "bg-slate-500/10 text-slate-500 border-slate-500/20",
} as const;
