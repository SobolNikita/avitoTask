export const BASE_URL = '/api/v1'

export const getApiUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`
}

