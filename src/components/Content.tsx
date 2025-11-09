import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { javascriptTopics } from '../javascriptData';
import { typescriptTopics } from '../typescriptData';
import { reactTopics } from '../reactData';
import { getTopicTypeFromPath } from '../config/routes';
import { card, text } from '../styles/shared';
import type { Topic, TopicCategory } from '../types';
import './Markdown.css';

interface ContentProps {
  topic?: string;
}

// Memoize topic data map outside component to avoid recreating on every render
const topicDataMap: Record<string, TopicCategory[]> = {
  javascript: javascriptTopics,
  typescript: typescriptTopics,
  react: reactTopics,
};

const Content: React.FC<ContentProps> = ({ topic }) => {
  const { pathname } = useLocation();
  const topicType = getTopicTypeFromPath(pathname);

  // Memoize selected topic lookup
  const selectedTopic = useMemo((): Topic | null => {
    if (!topic || !topicType) return null;

    const topics = topicDataMap[topicType];
    if (!topics) {
      // This shouldn't happen with proper routing, but handle it defensively
      console.error(`Invalid topic type: ${topicType}`);
      return null;
    }

    for (const category of topics) {
      if (category.topics[topic]) {
        return category.topics[topic];
      }
    }
    return null;
  }, [topic, topicType]);

  // Memoize display name for the topic type
  const topicDisplayName = useMemo(() => {
    return topicType
      ? topicType.charAt(0).toUpperCase() + topicType.slice(1)
      : 'JavaScript';
  }, [topicType]);

  // Memoize markdown components to avoid recreating on every render
  const markdownComponents: Components = useMemo(() => ({
    code(props) {
      const { node, inline, className, children, ...rest } = props as any;
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag='div'
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
  }), []);

  // Handle different states: no topic vs invalid topic vs invalid section
  if (!selectedTopic) {
    // Invalid section path (shouldn't happen with routing, but handle defensively)
    if (!topicType && topic) {
      return (
        <article className={`content ${card.base} ${card.content}`}>
          <div className="text-center py-20 px-5">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className={`text-4xl font-bold mb-4 ${text.gradientError}`}>
              Invalid Section
            </h2>
            <p className={`text-lg ${text.muted} max-w-md mx-auto leading-relaxed mb-6`}>
              The section you're trying to access doesn't exist.
            </p>
            <p className={`text-sm ${text.subtle}`}>
              Please navigate to JavaScript, TypeScript, or React sections.
            </p>
          </div>
        </article>
      );
    }

    // User provided a topic in URL but it doesn't exist
    if (topic) {
      return (
        <article className={`content ${card.base} ${card.content}`}>
          <div className="text-center py-20 px-5">
            <div className="text-6xl mb-6">❌</div>
            <h2 className={`text-4xl font-bold mb-4 ${text.gradientError}`}>
              Topic Not Found
            </h2>
            <p className={`text-lg ${text.muted} max-w-md mx-auto leading-relaxed mb-6`}>
              The topic <span className="text-purple-400 font-semibold">"{topic}"</span> doesn't exist in the {topicDisplayName} section.
            </p>
            <p className={`text-sm ${text.subtle}`}>
              Please select a valid topic from the table of contents.
            </p>
          </div>
        </article>
      );
    }

    // No topic selected - show welcome message
    return (
      <article className={`content ${card.base} ${card.content}`}>
        <div className="text-center py-20 px-5">
          <div className="text-6xl mb-6 animate-bounce">📚</div>
          <h2 className={`text-4xl font-bold mb-4 ${text.gradientHeading}`}>
            Welcome to {topicDisplayName} Cheat Sheet
          </h2>
          <p className={`text-lg ${text.muted} max-w-md mx-auto leading-relaxed`}>
            Select a topic from the table of contents to get started with your
            interview preparation.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className={`content ${card.base} ${card.content} min-w-0 overflow-x-auto`}>
      <h2 className={`text-5xl font-extrabold mt-0 mb-8 ${text.gradientHeading}`}>{selectedTopic.title}</h2>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {selectedTopic.content}
      </ReactMarkdown>
    </article>
  );
};

export default Content;
