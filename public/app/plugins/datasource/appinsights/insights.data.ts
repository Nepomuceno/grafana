export class Metric {
    public displayName: string;
    public supportedGroupBy: any;
    public supportedAggregations: string[];
    public defaultAggregation: string;
    public units: string;
}

export class Dimension {
    public displayName: string;
}

export class MetricsMetadata {
    public metrics: {[id: string]: Metric};
    public dimensions: {[id: string]: Dimension};
}

export class QueryMetricsResponse {
    public start: Date;
    public end: Date;
    public interval: string;
    public segments: QuerySegments[];
}

export class QuerySegments {
    public start: Date;
    public end: Date;
    [id: string]: any;
    public segments: QuerySegments[];
}
