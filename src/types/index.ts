export interface Topic {
  title: string;
  content: string;
}

export interface TopicCategory {
  title: string;
  topics: {
    [key: string]: Topic;
  };
}

export type TopicKey = string;

export interface ContentProps {
  topic?: string;
}

export interface TableOfContentsProps {
  topics: TopicCategory[];
  currentTopic?: string;
  basePath: string;
}
