/**
 * Shared Tailwind CSS class utilities
 * Centralized styling patterns for consistency and maintainability
 */

import clsx from 'clsx';

/**
 * Card/Container Styles
 */
export const card = {
  base: 'bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl',
  content: 'flex-1 p-10 animate-[fadeIn_0.5s_ease]',
  sidebar: 'w-full lg:w-72 lg:min-w-[280px] flex-shrink-0 p-6 lg:p-8',
} as const;

/**
 * Text/Heading Styles
 */
export const text = {
  gradientHeading: 'bg-gradient-to-r from-purple-400 via-violet-500 to-pink-400 bg-clip-text text-transparent',
  gradientError: 'bg-gradient-to-r from-red-400 via-orange-500 to-red-400 bg-clip-text text-transparent',
  muted: 'text-white/60',
  subtle: 'text-white/50',
  primary: 'text-white',
} as const;

/**
 * Button Styles
 */
export const button = {
  primary: 'px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
  ghost: 'px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300',
} as const;

/**
 * Navigation Link Styles
 */
export const navLink = {
  desktop: 'relative text-white/80 hover:text-white font-medium py-2 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-purple-400 after:to-violet-600 hover:after:w-full after:transition-all after:duration-300',
  mobile: 'px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300',
  sidebar: 'block px-4 py-2.5 rounded-xl text-sm transition-all duration-300',
} as const;

/**
 * Topic Link States (for TableOfContents)
 */
export const topicLink = {
  active: 'text-white bg-gradient-to-r from-purple-500/30 to-violet-600/30 border-l-4 border-purple-500',
  inactive: 'text-white/70 hover:text-white hover:bg-purple-500/15 hover:translate-x-1',
} as const;

/**
 * Layout Styles
 */
export const layout = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex justify-between items-center',
} as const;

/**
 * Scrollbar Styles
 */
export const scrollbar = 'scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-white/5';

/**
 * Helper function to create topic link className
 */
export const getTopicLinkClass = (isActive: boolean) =>
  clsx(
    navLink.sidebar,
    isActive ? topicLink.active : topicLink.inactive
  );

/**
 * Helper function to create card className
 */
export const getCardClass = (variant: 'content' | 'sidebar' = 'content') =>
  clsx(
    card.base,
    variant === 'content' ? card.content : card.sidebar
  );
