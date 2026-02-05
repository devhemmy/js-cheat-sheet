import type { Topic, TopicCategory, TopicIndex, CategoryIndex } from '../types';

/**
 * Generate a URL-safe key from a topic title
 * "var vs. let vs. const" -> "var-vs-let-vs-const"
 */
export function generateTopicKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Spaces to hyphens
    .replace(/-+/g, '-')           // Collapse multiple hyphens
    .replace(/^-|-$/g, '')         // Trim leading/trailing hyphens
    .trim();
}

/**
 * Build a flat index from category array for O(1) lookups
 */
export function buildTopicIndex(categories: TopicCategory[]): TopicIndex {
  const index = new Map<string, Topic>();

  for (const category of categories) {
    for (const topic of category.topics) {
      if (index.has(topic.key)) {
        console.warn(`Duplicate topic key detected: "${topic.key}"`);
      }
      index.set(topic.key, topic);
    }
  }

  return index;
}

/**
 * Create a complete CategoryIndex with both category structure and flat index
 */
export function createCategoryIndex(categories: TopicCategory[]): CategoryIndex {
  return {
    categories,
    topicIndex: buildTopicIndex(categories),
  };
}

/**
 * O(1) topic lookup by key
 */
export function getTopic(index: TopicIndex, key: string): Topic | undefined {
  return index.get(key);
}

/**
 * Get all topic keys from an index
 */
export function getAllTopicKeys(index: TopicIndex): string[] {
  return Array.from(index.keys());
}

/**
 * Get topics by tag
 */
export function getTopicsByTag(index: TopicIndex, tag: string): Topic[] {
  const topics: Topic[] = [];
  for (const topic of index.values()) {
    if (topic.metadata.tags.includes(tag)) {
      topics.push(topic);
    }
  }
  return topics;
}

/**
 * Get topics by difficulty level
 */
export function getTopicsByDifficulty(
  index: TopicIndex,
  difficulty: Topic['metadata']['difficulty']
): Topic[] {
  const topics: Topic[] = [];
  for (const topic of index.values()) {
    if (topic.metadata.difficulty === difficulty) {
      topics.push(topic);
    }
  }
  return topics;
}
