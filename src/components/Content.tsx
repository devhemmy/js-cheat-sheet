import React from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { javascriptTopics } from '../javascriptData';
import { typescriptTopics } from '../typescriptData';
import './Markdown.css';

interface ContentProps {
  topic?: string;
}

const Content: React.FC<ContentProps> = ({ topic }) => {
  const { pathname } = useLocation();
  const isTypeScript = pathname.startsWith('/typescript');

  let selectedTopic = null;

  if (topic) {
    const topics = isTypeScript ? typescriptTopics : javascriptTopics;
    for (const category of topics) {
      if (category.topics[topic]) {
        selectedTopic = category.topics[topic];
        break;
      }
    }
  }

  if (!selectedTopic) {
    return (
      <article className="content flex-1 p-10 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl animate-[fadeIn_0.5s_ease]">
        <div className="text-center py-20 px-5">
          <div className="text-6xl mb-6 animate-bounce">📚</div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-violet-500 to-pink-400 bg-clip-text text-transparent">
            Welcome to {isTypeScript ? 'TypeScript' : 'JavaScript'} Cheat Sheet
          </h2>
          <p className="text-lg text-white/60 max-w-md mx-auto leading-relaxed">
            Select a topic from the table of contents to get started with your
            interview preparation.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="content flex-1 min-w-0 p-10 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl animate-[fadeIn_0.5s_ease] overflow-x-auto">
      <h2 className="text-5xl font-extrabold mt-0 mb-8 bg-gradient-to-r from-purple-400 via-violet-500 to-pink-400 bg-clip-text text-transparent">{selectedTopic.title}</h2>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
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
        }}
      >
        {selectedTopic.content}
      </ReactMarkdown>
    </article>
  );
};

export default Content;
