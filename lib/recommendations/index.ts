import { Analyzer, Recommendation, ResourceData } from "./types";
import { ZombieDropletsAnalyzer } from "./strategies/zombie-droplets";
import { ZombieVolumesAnalyzer } from "./strategies/zombie-volumes";
import { OldSnapshotsAnalyzer } from "./strategies/old-snapshots";
import { RedundantBackupsAnalyzer } from "./strategies/redundant-backups";
import { DropletDowngradeAnalyzer } from "./strategies/droplet-downgrade";
import { DatabaseOptimizationAnalyzer } from "./strategies/database-optimization";
import { ConsolidateDropletsAnalyzer } from "./strategies/consolidate-droplets";
import { ChangeRegionAnalyzer } from "./strategies/change-region";

export class RecommendationEngine {
	private analyzers: Analyzer[];

	constructor() {
		this.analyzers = [
			// Cost savings recommendations
			new ZombieDropletsAnalyzer(),
			new ZombieVolumesAnalyzer(),
			new OldSnapshotsAnalyzer(),
			new RedundantBackupsAnalyzer(),
			new DropletDowngradeAnalyzer(),
			new DatabaseOptimizationAnalyzer(),
			new ConsolidateDropletsAnalyzer(),
			// Performance recommendations
			new ChangeRegionAnalyzer(),
		];
	}

	async analyze(data: ResourceData): Promise<Recommendation[]> {
		const results = await Promise.all(
			this.analyzers.map(analyzer => analyzer.analyze(data))
		);

		return results.flat();
	}
}
