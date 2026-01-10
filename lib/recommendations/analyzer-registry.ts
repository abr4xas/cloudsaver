/**
 * Analyzer Registry
 *
 * Centralized registry for all recommendation analyzers.
 * This eliminates the need to manually import and register each analyzer.
 */

import type { Analyzer } from './types';
import { ZombieDropletsAnalyzer } from './strategies/zombie-droplets';
import { ZombieVolumesAnalyzer } from './strategies/zombie-volumes';
import { OldSnapshotsAnalyzer } from './strategies/old-snapshots';
import { RedundantBackupsAnalyzer } from './strategies/redundant-backups';
import { DropletDowngradeAnalyzer } from './strategies/droplet-downgrade';
import { DatabaseOptimizationAnalyzer } from './strategies/database-optimization';
import { ConsolidateDropletsAnalyzer } from './strategies/consolidate-droplets';
import { ChangeRegionAnalyzer } from './strategies/change-region';
import { IdleLoadBalancersAnalyzer } from './strategies/idle-load-balancers';
import { DuplicateSnapshotsAnalyzer } from './strategies/duplicate-snapshots';
import { LargeUnusedVolumesAnalyzer } from './strategies/large-unused-volumes';

/**
 * Registry of all available analyzers
 * Add new analyzers here to automatically include them
 */
const ANALYZERS: (new () => Analyzer)[] = [
	ZombieDropletsAnalyzer,
	ZombieVolumesAnalyzer,
	OldSnapshotsAnalyzer,
	RedundantBackupsAnalyzer,
	DropletDowngradeAnalyzer,
	DatabaseOptimizationAnalyzer,
	ConsolidateDropletsAnalyzer,
	ChangeRegionAnalyzer,
	IdleLoadBalancersAnalyzer,
	DuplicateSnapshotsAnalyzer,
	LargeUnusedVolumesAnalyzer,
];

/**
 * Get all analyzer instances
 *
 * @returns Array of analyzer instances
 */
export function getAllAnalyzers(): Analyzer[] {
	return ANALYZERS.map((AnalyzerClass) => new AnalyzerClass());
}

/**
 * Get analyzer count
 *
 * @returns Number of registered analyzers
 */
export function getAnalyzerCount(): number {
	return ANALYZERS.length;
}

/**
 * Get analyzer class names (for debugging/logging)
 *
 * @returns Array of analyzer class names
 */
export function getAnalyzerNames(): string[] {
	return ANALYZERS.map((AnalyzerClass) => AnalyzerClass.name);
}
