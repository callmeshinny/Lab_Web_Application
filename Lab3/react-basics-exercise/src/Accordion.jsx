import { useState } from 'react';
import Panel from './Panel';

const panels = [
  {
    title: 'About React',
    body: 'React is a JavaScript library for building UIs.',
  },
  {
    title: 'About Vite',
    body: 'Vite is a lightning fast build tool for modern web apps.',
  },
];

function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="accordion">
      {panels.map((panel, index) => (
        <Panel
          key={panel.title}
          title={panel.title}
          isActive={activeIndex === index}
          onShow={() => setActiveIndex(index)}
        >
          {panel.body}
        </Panel>
      ))}
    </div>
  );
}

export default Accordion;
