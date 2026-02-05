import type { CategoryIndex } from '../types';

interface ValidationError {
  type: 'duplicate_key' | 'empty_content' | 'missing_title' | 'invalid_prerequisite';
  message: string;
  topic?: string;
}

/**
 * Validate all topics in a category index
 * Returns an array of validation errors found
 */
export function validateTopics(index: CategoryIndex): ValidationError[] {
  const errors: ValidationError[] = [];
  const seenKeys = new Set<string>();

  for (const category of index.categories) {
    for (const topic of category.topics) {
      // Check for duplicate keys
      if (seenKeys.has(topic.key)) {
        errors.push({
          type: 'duplicate_key',
          message: `Duplicate topic key: "${topic.key}"`,
          topic: topic.key,
        });
      }
      seenKeys.add(topic.key);

      // Check for missing title
      if (!topic.title || topic.title.trim().length === 0) {
        errors.push({
          type: 'missing_title',
          message: `Topic with key "${topic.key}" has no title`,
          topic: topic.key,
        });
      }

      // Check for empty or very short content
      if (!topic.content || topic.content.trim().length < 50) {
        errors.push({
          type: 'empty_content',
          message: `Topic "${topic.title}" has very short or empty content`,
          topic: topic.key,
        });
      }

      // Validate prerequisites exist in index
      for (const prereq of topic.metadata.prerequisites ?? []) {
        if (!index.topicIndex.has(prereq)) {
          errors.push({
            type: 'invalid_prerequisite',
            message: `Topic "${topic.title}" has invalid prerequisite: "${prereq}"`,
            topic: topic.key,
          });
        }
      }
    }
  }

  return errors;
}

/**
 * Run validation and throw in development mode if errors found
 * Silent in production
 */
export function assertValidTopics(index: CategoryIndex): void {
  if (import.meta.env.DEV) {
    const errors = validateTopics(index);
    if (errors.length > 0) {
      console.error('Topic validation errors:', errors);
      // Don't throw to avoid breaking the app, just warn loudly
      console.warn(`Found ${errors.length} topic validation error(s). Check console for details.`);
    }
  }
}
