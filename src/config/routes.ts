/**
 * Centralized route configuration
 * Provides type-safe route definitions and helper functions
 */

export type TopicType = 'javascript' | 'typescript' | 'react' | 'angular';

/**
 * Application route paths
 */
export const ROUTES = {
  HOME: '/',
  JAVASCRIPT: '/javascript',
  TYPESCRIPT: '/typescript',
  REACT: '/react',
  ANGULAR: '/angular',
} as const;

/**
 * Generate a route path for a specific topic
 * @param type - The topic type (javascript, typescript, or react)
 * @param topic - Optional specific topic slug
 * @returns The complete route path
 */
export const getTopicRoute = (type: TopicType, topic?: string): string => {
  const basePath = ROUTES[type.toUpperCase() as keyof typeof ROUTES];
  return topic ? `${basePath}/${topic}` : basePath;
};

/**
 * Extract the topic type from a pathname
 * @param pathname - The current pathname
 * @returns The topic type or null if not found
 */
export const getTopicTypeFromPath = (pathname: string): TopicType | null => {
  if (pathname.startsWith(ROUTES.TYPESCRIPT)) return 'typescript';
  if (pathname.startsWith(ROUTES.REACT)) return 'react';
  if (pathname.startsWith(ROUTES.ANGULAR)) return 'angular';
  if (pathname.startsWith(ROUTES.JAVASCRIPT)) return 'javascript';
  return null;
};

/**
 * Navigation items for header/menu
 */
export const NAV_ITEMS = [
  { label: 'JavaScript', path: ROUTES.JAVASCRIPT, type: 'javascript' as TopicType },
  { label: 'TypeScript', path: ROUTES.TYPESCRIPT, type: 'typescript' as TopicType },
  { label: 'React', path: ROUTES.REACT, type: 'react' as TopicType },
  { label: 'Angular', path: ROUTES.ANGULAR, type: 'angular' as TopicType },
] as const;
