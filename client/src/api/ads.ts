import { get, post } from './client';
import type { Advertisement, ModerationHistory } from '../types/ads';

export function getAdById(id: number): Promise<Advertisement> {
  return get<Advertisement>(`/ads/${id}`);
}

export function getModerationHistory(adId: number): Promise<ModerationHistory[]> {
  return get<Advertisement>(`/ads/${adId}`).then(ad => ad.moderationHistory);
}

interface ApproveResponse {
  message: string;
  ad: Advertisement;
}

interface RejectResponse {
  message: string;
  ad: Advertisement;
}

interface RejectRequest {
  reason: string;
  comment?: string;
}

interface RequestChangesRequest {
  reason: string;
  comment?: string;
}

interface RequestChangesResponse {
  message: string;
  ad: Advertisement;
}

export function approveAd(id: number): Promise<ApproveResponse> {
  return post<ApproveResponse>(`/ads/${id}/approve`);
}

export function rejectAd(id: number, data: RejectRequest): Promise<RejectResponse> {
  return post<RejectResponse>(`/ads/${id}/reject`, data);
}

export function requestChanges(id: number, data: RequestChangesRequest): Promise<RequestChangesResponse> {
  return post<RequestChangesResponse>(`/ads/${id}/request-changes`, data);
}