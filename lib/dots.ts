// Simple wrapper for DigitalOcean API calls
// This is a minimal implementation for the CloudSaver landing page

interface DOTSClient {
	droplet: {
		listDroplets: (params: { per_page: number }) => Promise<{ data: unknown }>;
	};
	volume: {
		listVolumes: (params: { per_page: number }) => Promise<{ data: unknown }>;
	};
	snapshot: {
		listSnapshots: (params: { per_page: number }) => Promise<{ data: unknown }>;
	};
	account: {
		getAccount: () => Promise<{ data: unknown }>;
	};
}

export function getDOTS(token: string): DOTSClient {
	const baseURL = "https://api.digitalocean.com/v2";

	const fetchAPI = async (endpoint: string) => {
		const response = await fetch(`${baseURL}${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.statusText}`);
		}

		return response.json();
	};

	return {
		droplet: {
			listDroplets: async (params) => {
				const data = await fetchAPI(
					`/droplets?per_page=${params.per_page}`
				);
				return { data };
			},
		},
		volume: {
			listVolumes: async (params) => {
				const data = await fetchAPI(
					`/volumes?per_page=${params.per_page}`
				);
				return { data };
			},
		},
		snapshot: {
			listSnapshots: async (params) => {
				const data = await fetchAPI(
					`/snapshots?per_page=${params.per_page}`
				);
				return { data };
			},
		},
		account: {
			getAccount: async () => {
				const data = await fetchAPI("/account");
				return { data };
			},
		},
	};
}
