/**
 * TypeScript types for DigitalOcean API responses and resources
 */

export interface DigitalOceanDroplet {
    id: number | string;
    name: string;
    memory: number;
    vcpus: number;
    disk: number | number[];
    locked: boolean;
    status: string;
    kernel?: {
        id: number;
        name: string;
        version: string;
    };
    created_at: string;
    features: string[];
    backup_ids: number[];
    snapshot_ids: number[];
    image: {
        id: number;
        name: string;
        distribution: string;
        slug: string;
        public: boolean;
        regions: string[];
        created_at: string;
        min_disk_size: number;
        type: string;
        size_gigabytes: number;
    };
    volume_ids: number[];
    size_slug: string;
    size?: {
        slug: string;
        memory: number;
        vcpus: number;
        disk: number;
        transfer: number;
        price_monthly: number;
        price_hourly: number;
        regions: string[];
        available: boolean;
    };
    networks?: {
        v4: Array<{
            ip_address: string;
            netmask: string;
            gateway: string;
            type: string;
        }>;
        v6: Array<{
            ip_address: string;
            netmask: number;
            gateway: string;
            type: string;
        }>;
    };
    region: {
        name: string;
        slug: string;
        sizes: string[];
        features: string[];
        available: boolean;
    };
    tags: string[];
    volume_ids?: number[];
}

export interface DigitalOceanVolume {
    id: string;
    region: {
        name: string;
        slug: string;
    };
    droplet_ids: number[];
    name: string;
    description: string;
    size_gigabytes: number;
    created_at: string;
    filesystem_type: string;
    filesystem_label: string;
    tags: string[];
}

export interface DigitalOceanSnapshot {
    id: string;
    name: string;
    created_at: string;
    regions: string[];
    resource_id: string | number;
    resource_type: string;
    min_disk_size: number | null;
    min_disk_size_gb?: number;
    size_gigabytes?: number;
    size_bytes?: number;
    tags: string[];
}

export interface DigitalOceanDatabase {
    id: string;
    name: string;
    engine: string;
    version: string;
    connection: {
        uri: string;
        database: string;
        host: string;
        port: number;
        user: string;
        password: string;
        ssl: boolean;
    };
    private_connection?: {
        uri: string;
        database: string;
        host: string;
        port: number;
        user: string;
        password: string;
        ssl: boolean;
    };
    users: Array<{
        name: string;
        role: string;
        password: string;
    }>;
    db_names: string[];
    num_nodes: number;
    region: string;
    status: string;
    created_at: string;
    maintenance_window: {
        day: string;
        hour: string;
    };
    size: string;
    tags: string[];
}

export interface DigitalOceanReservedIP {
    ip: string;
    droplet: {
        id: number;
        name: string;
    } | null;
    region: {
        name: string;
        slug: string;
    };
    locked: boolean;
}

export interface DigitalOceanLoadBalancer {
    id: string;
    name: string;
    ip: string;
    algorithm: string;
    status: string;
    created_at: string;
    forwarding_rules: Array<{
        entry_protocol: string;
        entry_port: number;
        target_protocol: string;
        target_port: number;
        certificate_id: string;
        tls_passthrough: boolean;
    }>;
    health_check: {
        protocol: string;
        port: number;
        path: string;
        check_interval_seconds: number;
        response_timeout_seconds: number;
        healthy_threshold: number;
        unhealthy_threshold: number;
    };
    sticky_sessions: {
        type: string;
        cookie_name: string;
        cookie_ttl_seconds: number;
    };
    region: {
        name: string;
        slug: string;
    };
    tag: string;
    droplet_ids: number[];
    redirect_http_to_https: boolean;
    enable_proxy_protocol: boolean;
    enable_backend_keepalive: boolean;
    vpc_uuid: string | null;
    disable_lets_encrypt_dns_records: boolean;
    type?: string;
}

export interface DigitalOceanSize {
    slug: string;
    memory: number;
    vcpus: number;
    disk: number;
    transfer: number;
    price_monthly: number;
    price_hourly: number;
    regions: string[];
    available: boolean;
    description: string;
}

export interface DigitalOceanMetricsData {
    data: {
        result: Array<{
            metric: Record<string, string>;
            values: Array<[number, string]>;
        }>;
    };
}

export interface DigitalOceanApiResponse<T = unknown> {
    [key: string]: T | unknown;
    links?: {
        pages?: {
            first?: string;
            prev?: string;
            next?: string;
            last?: string;
        };
    };
    meta?: {
        total?: number;
    };
}

export interface AllResources {
    droplets: DigitalOceanDroplet[];
    volumes: DigitalOceanVolume[];
    snapshots: DigitalOceanSnapshot[];
    databases: DigitalOceanDatabase[];
    reserved_ips: DigitalOceanReservedIP[];
    load_balancers: DigitalOceanLoadBalancer[];
}
