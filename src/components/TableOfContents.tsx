import { Link, useParams, useLocation } from 'react-router-dom';
import { useMemo, memo } from 'react';
import { javascriptTopics } from '../javascriptData';
import { typescriptTopics } from '../typescriptData';
import { reactTopics } from '../reactData';
import { getTopicRoute, ROUTES, type TopicType } from '../config/routes';
import { getTopicLinkClass, scrollbar } from '../styles/shared';
import type { TopicCategory } from '../types';

interface TopicSectionProps {
  title: string;
  topics: TopicCategory[];
  topicType: TopicType;
  currentTopic?: string;
}

// Memoized component for rendering topic sections
const TopicSection = memo(({ title, topics, topicType, currentTopic }: TopicSectionProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">{title}</h2>
      {topics.map((category, categoryIndex) => (
        <div key={`${topicType}-category-${categoryIndex}-${category.title}`} className="mb-6">
          <h3 className="mt-6 mb-4 text-xs font-bold uppercase tracking-wider text-white/90 first:mt-0">{category.title}</h3>
          <ul className="space-y-1">
            {Object.keys(category.topics).map((topicKey) => (
              <li key={`${topicType}-${category.title}-${topicKey}`}>
                <Link
                  to={getTopicRoute(topicType, topicKey)}
                  className={getTopicLinkClass(currentTopic === topicKey)}
                >
                  {category.topics[topicKey].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
});

TopicSection.displayName = 'TopicSection';

const TableOfContents = () => {
  const { topic } = useParams();
  const { pathname } = useLocation();

  // Memoize the current section to render based on pathname
  const currentSection = useMemo(() => {
    if (pathname.startsWith(ROUTES.JAVASCRIPT)) {
      return <TopicSection title="JavaScript Topics" topics={javascriptTopics} topicType="javascript" currentTopic={topic} />;
    }
    if (pathname.startsWith(ROUTES.TYPESCRIPT)) {
      return <TopicSection title="TypeScript Topics" topics={typescriptTopics} topicType="typescript" currentTopic={topic} />;
    }
    if (pathname.startsWith(ROUTES.REACT)) {
      return <TopicSection title="React Topics" topics={reactTopics} topicType="react" currentTopic={topic} />;
    }
    return null;
  }, [pathname, topic]);

  return (
    <aside
      className={`w-full lg:w-72 lg:min-w-[280px] flex-shrink-0 p-6 lg:p-8 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 lg:sticky lg:top-28 h-fit max-h-96 lg:max-h-[calc(100vh-150px)] overflow-y-auto shadow-xl ${scrollbar}`}
      role="complementary"
      aria-label="Table of contents"
    >
      {currentSection}
    </aside>
  );
};

export default TableOfContents;
