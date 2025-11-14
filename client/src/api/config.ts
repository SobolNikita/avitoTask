export const BASE_URL = 'http://localhost:3001/api/v1'

export const getApiUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`
}

