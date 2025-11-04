import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { javascriptTopics } from '../data';

const TableOfContents = () => {
  const { topic } = useParams();

  return (
    <div className='table-of-contents'>
      {javascriptTopics.map((category, categoryIndex) => (
        <div key={`category-${categoryIndex}-${category.title}`}>
          <h3>{category.title}</h3>
          <ul>
            {Object.keys(category.topics).map((topicKey) => (
              <li key={`${category.title}-${topicKey}`}>
                <Link
                  to={`/javascript/${topicKey}`}
                  className={topic === topicKey ? 'active' : ''}
                >
                  {category.topics[topicKey].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TableOfContents;
