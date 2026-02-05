// Topic metadata for filtering, search, and categorization
export interface TopicMetadata {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  prerequisites?: string[];
}

// Core topic interface with metadata support
export interface Topic {
  key: string;
  title: string;
  content: string;
  metadata: TopicMetadata;
}

// Category containing an array of topics
export interface TopicCategory {
  title: string;
  topics: Topic[];
}

// Topic type union
export type TopicType = 'javascript' | 'typescript' | 'react';

// O(1) lookup index
export type TopicIndex = Map<string, Topic>;

// Combined category data with index for fast lookups
export interface CategoryIndex {
  categories: TopicCategory[];
  topicIndex: TopicIndex;
}

// Legacy types for backwards compatibility during migration
export type TopicKey = string;

export interface ContentProps {
  topic?: string;
}

export interface TableOfContentsProps {
  topics: TopicCategory[];
  currentTopic?: string;
  basePath: string;
}
