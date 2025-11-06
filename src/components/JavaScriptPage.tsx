import { useParams } from 'react-router-dom';
import TableOfContents from './TableOfContents';
import Content from './Content';

const JavaScriptPage = () => {
  const { topic } = useParams();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 py-6 lg:py-8 min-h-[calc(100vh-200px)]">
        <TableOfContents />
        <Content topic={topic} />
      </div>
    </main>
  );
};

export default JavaScriptPage;
