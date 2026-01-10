/**
 * Demo Token and Mock Data
 *
 * Provides example data for demonstration purposes when users
 * want to see what the audit looks like without a real token.
 */

import { Recommendation } from './recommendations/types';

// Demo token that users can use to see example results
export const DEMO_TOKEN = 'demo';

// Alternative demo tokens that also work
export const DEMO_TOKENS = ['demo', 'DEMO', 'example', 'test'];

/**
 * Check if a token is a demo token
 */
export function isDemoToken(token: string): boolean {
	return DEMO_TOKENS.includes(token.trim().toLowerCase()) ||
		token.trim().toLowerCase() === 'demo';
}

/**
 * Mock data that showcases various recommendation types
 */
export const DEMO_DATA = {
	monthlyCost: 312.00,
	potentialSavings: 94.00,
	savingsPercentage: 30,
	resourcesFound: 14,
	recommendations: [
		{
			type: 'droplet' as const,
			subtype: 'droplet_downgrade',
			title: 'Reduce "api-production" to save $30/mo',
			description: 'This droplet is using only 8.2% CPU and 22.5% RAM on average over 7 days. You can safely downgrade.',
			savings: 30,
			confidence: 'High' as const,
			impact: 'Medium' as const,
			resourceId: 'demo-droplet-1',
			resourceName: 'api-production',
			currentPlan: 's-4vcpu-8gb',
			suggestedPlan: 's-2vcpu-2gb',
			warnings: [
				'📸 Create a snapshot before resizing',
				'⏱️ Monitor performance for 24-48h after downgrade',
			],
			remediationCommand: 'doctl compute droplet-action resize 123456 --size s-2vcpu-2gb --wait',
			data: {
				avgCpu: 8.2,
				avgRam: 22.5,
				periodDays: 7,
			},
		},
		{
			type: 'droplet' as const,
			subtype: 'zombie_droplet',
			title: 'Powered Off Droplet',
			description: 'Droplet "staging-old" is powered off but you are still being charged for it.',
			savings: 24,
			confidence: 'High' as const,
			impact: 'Low' as const,
			resourceId: 'demo-droplet-2',
			resourceName: 'staging-old',
		},
		{
			type: 'volume' as const,
			subtype: 'zombie_volume',
			title: 'Unattached Volume',
			description: 'Volume "backup-vol-legacy" has been detached for 45 days.',
			savings: 10,
			confidence: 'Medium' as const,
			impact: 'Low' as const,
			resourceId: 'demo-volume-1',
			resourceName: 'backup-vol-legacy',
			warnings: [
				'💾 Verify no applications need this volume before deleting',
			],
		},
		{
			type: 'snapshot' as const,
			subtype: 'old_snapshot',
			title: 'Delete 5 old snapshots',
			description: 'You have snapshots older than 90 days. Keep only recent ones.',
			savings: 8,
			confidence: 'Medium' as const,
			impact: 'Low' as const,
			data: {
				snapshotCount: 5,
				totalSizeGB: 160,
				oldestDays: 180,
			},
			warnings: [
				'⚠️ Review snapshots before deleting',
			],
		},
		{
			type: 'database' as const,
			subtype: 'database_downgrade',
			title: 'Downgrade database "analytics-db" to save $15/mo',
			description: 'Low usage detected: 5.3% CPU, 18.2% disk, 2 avg connections. Safe to downgrade.',
			savings: 15,
			confidence: 'High' as const,
			impact: 'Low' as const,
			resourceId: 'demo-db-1',
			resourceName: 'analytics-db',
			currentPlan: 'db-s-1vcpu-2gb',
			suggestedPlan: 'db-s-1vcpu-1gb',
			warnings: [
				'💾 Create a backup before resizing',
				'⏱️ Resizing may cause brief downtime',
			],
			remediationCommand: 'doctl databases resize demo-db-1 --size db-s-1vcpu-1gb',
			data: {
				avgCpu: 5.3,
				diskUsagePercent: 18.2,
				avgConnections: 2,
			},
		},
		{
			type: 'droplet' as const,
			subtype: 'redundant_backups',
			title: 'Disable auto-backups for "web-frontend"',
			description: 'You are creating manual snapshots regularly. Auto-backups are redundant.',
			savings: 7,
			confidence: 'Medium' as const,
			impact: 'Low' as const,
			resourceId: 'demo-droplet-3',
			resourceName: 'web-frontend',
			warnings: [
				'⚠️ Ensure you have alternative backup strategy',
				'📅 Continue creating manual snapshots',
			],
		},
	] as Recommendation[],
};
