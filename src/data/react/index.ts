import { createCategoryIndex } from '../../utils/topicIndex';
import { assertValidTopics } from '../../utils/validation';
import { coreFundamentals } from './coreFundamentals';
import { lifecycleAndRendering } from './lifecycleAndRendering';
import { hooks } from './hooks';
import { stateManagement } from './stateManagement';
import { routingAndForms } from './routingAndForms';
import { advancedConcepts } from './advancedConcepts';

// Combine all React categories
export const reactData = createCategoryIndex([
  coreFundamentals,
  lifecycleAndRendering,
  hooks,
  stateManagement,
  routingAndForms,
  advancedConcepts,
]);

// Validate topics in development mode
assertValidTopics(reactData);

// Export for convenience
export const reactCategories = reactData.categories;
export const reactTopicIndex = reactData.topicIndex;
