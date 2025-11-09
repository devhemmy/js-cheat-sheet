import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import { javascriptTopics } from '../javascriptData';
import { typescriptTopics } from '../typescriptData';
import { reactTopics } from '../reactData';
import { getTopicTypeFromPath } from '../config/routes';
import type { Topic, TopicCategory } from '../types';
import './Markdown.css';

// Register only the languages we need to reduce bundle size
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('js', javascript); // Alias
SyntaxHighlighter.registerLanguage('ts', typescript); // Alias

interface ContentProps {
  topic?: string;
}

const Content: React.FC<ContentProps> = ({ topic }) => {
  const { pathname } = useLocation();
  const topicType = getTopicTypeFromPath(pathname);

  // Map topic type to data
  const topicDataMap: Record<string, TopicCategory[]> = {
    javascript: javascriptTopics,
    typescript: typescriptTopics,
    react: reactTopics,
  };

  let selectedTopic: Topic | null = null;

  if (topic && topicType) {
    const topics = topicDataMap[topicType];
    for (const category of topics) {
      if (category.topics[topic]) {
        selectedTopic = category.topics[topic];
        break;
      }
    }
  }

  // Get display name for the topic type
  const topicDisplayName = topicType
    ? topicType.charAt(0).toUpperCase() + topicType.slice(1)
    : 'JavaScript';

  if (!selectedTopic) {
    return (
      <article className="content flex-1 p-10 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl animate-[fadeIn_0.5s_ease]">
        <div className="text-center py-20 px-5">
          <div className="text-6xl mb-6 animate-bounce">📚</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-violet-500 to-pink-400 bg-clip-text text-transparent">
            Welcome to {topicDisplayName} Cheat Sheet
          </h2>
          <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
            Select a topic from the table of contents to get started with your
            interview preparation.
          </p>
        </div>
      </article>
    );
  }

  // Define properly typed markdown components
  const markdownComponents: Components = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag='div'
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <article className="content flex-1 min-w-0 p-10 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl animate-[fadeIn_0.5s_ease] overflow-x-auto">
      <h2 className="text-5xl font-extrabold mt-0 mb-8 bg-gradient-to-r from-purple-400 via-violet-500 to-pink-400 bg-clip-text text-transparent">{selectedTopic.title}</h2>
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
