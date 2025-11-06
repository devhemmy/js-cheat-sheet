const CheatSheet = () => {
  // Dummy data for the cheat sheet items
  const cheatSheetItems = [
    { title: 'Variables', content: 'var, let, const' },
    {
      title: 'Data Types',
      content: 'String, Number, Boolean, Null, Undefined, Symbol, BigInt',
    },
    {
      title: 'Operators',
      content: 'Arithmetic, Assignment, Comparison, Logical, Bitwise',
    },
    {
      title: 'Functions',
      content: 'Function declarations, expressions, arrow functions',
    },
    {
      title: 'Arrays',
      content: 'Creating arrays, accessing elements, methods',
    },
    { title: 'Objects', content: 'Creating objects, properties, methods' },
    { title: 'Loops', content: 'for, while, do...while, for...in, for...of' },
    { title: 'Conditional Statements', content: 'if, else, else if, switch' },
  ];

  return (
    <section id='cheatsheet' className='cheatsheet container'>
      <input
        type='text'
        className='search-bar'
        placeholder='Search the cheat sheet...'
      />
      <div className='cheatsheet-grid'>
        {cheatSheetItems.map((item, index) => (
          <div key={index} className='cheatsheet-item'>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CheatSheet;
