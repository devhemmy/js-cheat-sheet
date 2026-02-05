import { createCategoryIndex } from '../../utils/topicIndex';
import { assertValidTopics } from '../../utils/validation';
import { fundamentals } from './fundamentals';
import { advancedTypes } from './advancedTypes';
import { oopTypescript } from './oopTypescript';
import { configuration } from './configuration';

// Combine all TypeScript categories
export const typescriptData = createCategoryIndex([
  fundamentals,
  advancedTypes,
  oopTypescript,
  configuration,
]);

// Validate topics in development mode
assertValidTopics(typescriptData);

// Export for convenience
export const typescriptCategories = typescriptData.categories;
export const typescriptTopicIndex = typescriptData.topicIndex;
