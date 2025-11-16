import { get } from './client';

export interface StatsSummary {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

export interface ActivityData {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface DecisionsData {
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface CategoriesData {
  [category: string]: number;
}

export interface StatsParams {
  period?: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
}

function buildQueryParams(params: StatsParams): string {
  const queryParams = new URLSearchParams();
  
  if (params.period) {
    queryParams.append('period', params.period);
  }
  
  if (params.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  
  if (params.endDate) {
    queryParams.append('endDate', params.endDate);
  }
  
  return queryParams.toString();
}

export function getSummaryStats(params: StatsParams = {}): Promise<StatsSummary> {
  const query = buildQueryParams(params);
  const url = query ? `/stats/summary?${query}` : '/stats/summary';
  return get<StatsSummary>(url);
}

export function getActivityChart(params: StatsParams = {}): Promise<ActivityData[]> {
  const query = buildQueryParams(params);
  const url = query ? `/stats/chart/activity?${query}` : '/stats/chart/activity';
  return get<ActivityData[]>(url);
}

export function getDecisionsChart(params: StatsParams = {}): Promise<DecisionsData> {
  const query = buildQueryParams(params);
  const url = query ? `/stats/chart/decisions?${query}` : '/stats/chart/decisions';
  return get<DecisionsData>(url);
}

export function getCategoriesChart(params: StatsParams = {}): Promise<CategoriesData> {
  const query = buildQueryParams(params);
  const url = query ? `/stats/chart/categories?${query}` : '/stats/chart/categories';
  return get<CategoriesData>(url);
}

