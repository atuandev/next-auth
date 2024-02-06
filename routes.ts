/**
 * An array of public routes that are accessible to everyone.
 * These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes = ['/']

/**
 * An array of routes that require authentication.
 * These routes will direct logged in users to /settings.
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register']

/**
 * The prefix for API authentication routes.
 * Routes that start with this prefix are used for authentication purposes.
 * @type {string}
 */
export const apiRoutesPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT = '/settings'