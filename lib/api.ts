const isServer = typeof window === 'undefined'

const SERVER_API_BASE_URL =
  process.env.API_BASE_URL || process.env.PUBLIC_API_BASE_URL || ''

const CLIENT_API_BASE_URL = ''

export function apiURL(path: string) {
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  return (isServer ? SERVER_API_BASE_URL : CLIENT_API_BASE_URL) + path
}
