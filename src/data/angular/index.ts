import { createCategoryIndex } from '../../utils/topicIndex';
import { assertValidTopics } from '../../utils/validation';
import { essentialsReactivity } from './essentialsReactivity';
import { componentsArchitecture } from './componentsArchitecture';
import { templatesRendering } from './templatesRendering';
import { stylingTheming } from './stylingTheming';
import { serviceArchitectureState } from './serviceArchitectureState';
import { asyncDataResources } from './asyncDataResources';
import { rxjsSignalWorld } from './rxjsSignalWorld';
import { routingNavigation } from './routingNavigation';
import { forms } from './forms';
import { dependencyInjection } from './dependencyInjection';
import { ssrPerformance } from './ssrPerformance';
import { testing } from './testing';
import { legacyInterop } from './legacyInterop';
import { extendedEcosystem } from './extendedEcosystem';

// Combine all Angular categories
export const angularData = createCategoryIndex([
  essentialsReactivity,
  componentsArchitecture,
  templatesRendering,
  stylingTheming,
  serviceArchitectureState,
  asyncDataResources,
  rxjsSignalWorld,
  routingNavigation,
  forms,
  dependencyInjection,
  ssrPerformance,
  testing,
  legacyInterop,
  extendedEcosystem,
]);

// Validate topics in development mode
assertValidTopics(angularData);

// Export for convenience
export const angularCategories = angularData.categories;
export const angularTopicIndex = angularData.topicIndex;
