import { createCategoryIndex } from '../../utils/topicIndex';
import { assertValidTopics } from '../../utils/validation';
import { coreFundamentals } from './coreFundamentals';
import { scopeAndFunctions } from './scopeAndFunctions';
import { asyncJavaScript } from './asyncJavaScript';
import { oopJavaScript } from './oopJavaScript';
import { modernJavaScript } from './modernJavaScript';

// Combine all JavaScript categories
export const javascriptData = createCategoryIndex([
  coreFundamentals,
  scopeAndFunctions,
  asyncJavaScript,
  oopJavaScript,
  modernJavaScript,
]);

// Validate topics in development mode
assertValidTopics(javascriptData);

// Export for convenience
export const javascriptCategories = javascriptData.categories;
export const javascriptTopicIndex = javascriptData.topicIndex;
