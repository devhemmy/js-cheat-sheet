import type { Topic, TopicMetadata, TopicCategory } from '../types';
import { generateTopicKey } from './topicIndex';

// Default metadata for topics
const DEFAULT_METADATA: TopicMetadata = {
  difficulty: 'intermediate',
  tags: [],
  prerequisites: [],
};

/**
 * Create a topic with full control over all properties
 * Key is auto-generated from title
 */
export function createTopic(
  title: string,
  content: string,
  metadata: Partial<TopicMetadata> = {}
): Topic {
  return {
    key: generateTopicKey(title),
    title,
    content,
    metadata: { ...DEFAULT_METADATA, ...metadata },
  };
}

/**
 * Create a category containing topics
 */
export function createCategory(title: string, topics: Topic[]): TopicCategory {
  return { title, topics };
}

/**
 * Shorthand helper for quick topic creation
 *
 * Usage:
 * topic('var vs. let vs. const', `### var vs. let vs. const...`, ['variables', 'scope'], 'beginner')
 */
export function topic(
  title: string,
  content: string,
  tags: string[] = [],
  difficulty: TopicMetadata['difficulty'] = 'intermediate',
  prerequisites: string[] = []
): Topic {
  return createTopic(title, content, { tags, difficulty, prerequisites });
}

/**
 * Shorthand helper for category creation
 *
 * Usage:
 * category('Core Fundamentals', [
 *   topic('var vs. let vs. const', `...`),
 *   topic('this keyword', `...`),
 * ])
 */
export function category(title: string, topics: Topic[]): TopicCategory {
  return createCategory(title, topics);
}
