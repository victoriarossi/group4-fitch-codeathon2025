export interface CompanyFilters {
  regionCode?: string;
  countryCode?: string;
  minRevenue?: number;
  maxRevenue?: number;
  minEnvironmentalScore?: number;
  maxEnvironmentalScore?: number;
  isTrainingSet?: boolean;
  limit?: number;
  offset?: number;
}

export interface CompanySummary {
  entityId: string;
  regionName: string | null;
  countryName: string | null;
  revenue: number | null;
  overallScore: number | null;
  environmentalScore: number | null;
  socialScore: number | null;
  governanceScore: number | null;
  targetScope1: number | null;
  targetScope2: number | null;
  predictedScope1?: number | null;
  predictedScope2?: number | null;
}

export interface SectorExposure {
  naceLevel1Code: string;
  naceLevel1Name: string;
  naceLevel2Code: string;
  naceLevel2Name: string;
  revenuePct: number;
}

export interface EnvironmentalActivity {
  activityType: string;
  activityCode: string;
  envScoreAdjustment: number;
}

export interface SDGCommitment {
  sdgId: number;
  sdgName: string;
}

export interface ModelPrediction {
  modelId: string;
  modelName: string;
  predictedScope1: number;
  predictedScope2: number;
  confidence?: number;
}

export interface CompanyDetail {
  company: CompanySummary;
  sectorExposures: SectorExposure[];
  environmentalActivities: EnvironmentalActivity[];
  sdgCommitments: SDGCommitment[];
  predictions?: ModelPrediction[];
}

export interface AggregationRequest {
  groupBy: 'sector' | 'region' | 'country' | 'sdg';
  metrics: Array<'avg_scope1' | 'avg_scope2' | 'sum_scope1' | 'sum_scope2' | 'count' | 'avg_env_score'>;
  filters?: {
    regionCode?: string;
    countryCode?: string;
    naceLevel1Code?: string;
    minRevenue?: number;
    isTrainingSet?: boolean;
  };
  limit?: number;
}

export interface AggregationResult {
  groupKey: string;
  groupName: string;
  metrics: {
    avgScope1?: number;
    avgScope2?: number;
    sumScope1?: number;
    sumScope2?: number;
    count?: number;
    avgEnvScore?: number;
  };
}

export interface AggregationResponse {
  results: AggregationResult[];
  metadata: {
    totalGroups: number;
    filters?: AggregationRequest['filters'];
  };
}
