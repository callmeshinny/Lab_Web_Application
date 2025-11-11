// Exercise 7 – Accordion component (parent)

import { useState } from 'react';
import Panel from './Panel';

// Parent component controls which panel is active
function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0); // keep track of open panel

  return (
    <>
      <h2>Accordion Example</h2>

      <Panel
        title="Panel 1"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        This is content of Panel 1.
      </Panel>

      <Panel
        title="Panel 2"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        This is content of Panel 2.
      </Panel>
    </>
  );
}

export default Accordion;
