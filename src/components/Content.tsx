import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { javascriptTopics } from '../data';
import './Markdown.css';

const Content = ({ topic }) => {
  let selectedTopic = null;

  if (topic) {
    for (const category of javascriptTopics) {
      if (category.topics[topic]) {
        selectedTopic = category.topics[topic];
        break;
      }
    }
  }

  if (!selectedTopic) {
    return (
      <div className="content">
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '20px'
          }}>📚</div>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '15px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>Welcome to JavaScript Cheat Sheet</h2>
          <p style={{
            fontSize: '1.1rem',
            maxWidth: '500px',
            margin: '0 auto'
          }}>Select a topic from the table of contents to get started with your interview preparation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <h2>{selectedTopic.title}</h2>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {selectedTopic.content}
      </ReactMarkdown>
    </div>
  );
};

export default Content;
