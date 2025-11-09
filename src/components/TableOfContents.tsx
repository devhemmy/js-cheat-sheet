import { Link, useParams, useLocation } from 'react-router-dom';
import { javascriptTopics } from '../javascriptData';
import { typescriptTopics } from '../typescriptData';
import { reactTopics } from '../reactData';

const TableOfContents = () => {
  const { topic } = useParams();
  const { pathname } = useLocation();

  return (
    <aside className="w-full lg:w-72 lg:min-w-[280px] flex-shrink-0 p-6 lg:p-8 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 lg:sticky lg:top-28 h-fit max-h-96 lg:max-h-[calc(100vh-150px)] overflow-y-auto shadow-xl scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-white/5" role="complementary" aria-label="Table of contents">
      {pathname.startsWith('/javascript') && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">JavaScript Topics</h2>
          {javascriptTopics.map((category, categoryIndex) => (
            <div key={`js-category-${categoryIndex}-${category.title}`} className="mb-6">
              <h3 className="mt-6 mb-4 text-xs font-bold uppercase tracking-wider text-white/90 first:mt-0">{category.title}</h3>
              <ul className="space-y-1">
                {Object.keys(category.topics).map((topicKey) => (
                  <li key={`js-${category.title}-${topicKey}`}>
                    <Link
                      to={`/javascript/${topicKey}`}
                      className={`block px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        topic === topicKey
                          ? 'text-white bg-gradient-to-r from-purple-500/30 to-violet-600/30 border-l-4 border-purple-500'
                          : 'text-white/70 hover:text-white hover:bg-purple-500/15 hover:translate-x-1'
                      }`}
                    >
                      {category.topics[topicKey].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {pathname.startsWith('/typescript') && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">TypeScript Topics</h2>
          {typescriptTopics.map((category, categoryIndex) => (
            <div key={`ts-category-${categoryIndex}-${category.title}`} className="mb-6">
              <h3 className="mt-6 mb-4 text-xs font-bold uppercase tracking-wider text-white/90 first:mt-0">{category.title}</h3>
              <ul className="space-y-1">
                {Object.keys(category.topics).map((topicKey) => (
                  <li key={`ts-${category.title}-${topicKey}`}>
                    <Link
                      to={`/typescript/${topicKey}`}
                      className={`block px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        topic === topicKey
                          ? 'text-white bg-gradient-to-r from-purple-500/30 to-violet-600/30 border-l-4 border-purple-500'
                          : 'text-white/70 hover:text-white hover:bg-purple-500/15 hover:translate-x-1'
                      }`}
                    >
                      {category.topics[topicKey].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {pathname.startsWith('/react') && (
        <>
          <h2 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-white/10">React Topics</h2>
          {reactTopics.map((category, categoryIndex) => (
            <div key={`react-category-${categoryIndex}-${category.title}`} className="mb-6">
              <h3 className="mt-6 mb-4 text-xs font-bold uppercase tracking-wider text-white/90 first:mt-0">{category.title}</h3>
              <ul className="space-y-1">
                {Object.keys(category.topics).map((topicKey) => (
                  <li key={`react-${category.title}-${topicKey}`}>
                    <Link
                      to={`/react/${topicKey}`}
                      className={`block px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                        topic === topicKey
                          ? 'text-white bg-gradient-to-r from-purple-500/30 to-violet-600/30 border-l-4 border-purple-500'
                          : 'text-white/70 hover:text-white hover:bg-purple-500/15 hover:translate-x-1'
                      }`}
                    >
                      {category.topics[topicKey].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </aside>
  );
};

export default TableOfContents;
