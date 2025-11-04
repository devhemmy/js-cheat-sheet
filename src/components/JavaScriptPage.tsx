import React from 'react';
import { useParams } from 'react-router-dom';
import TableOfContents from './TableOfContents';
import Content from './Content';
import './JavaScriptPage.css';

const JavaScriptPage = () => {
  const { topic } = useParams();

  return (
    <div className="javascript-page">
      <TableOfContents />
      <Content topic={topic} />
    </div>
  );
};

export default JavaScriptPage;
