import { useEffect, useState } from 'react';
import ClickSpark from './ClickSpark.jsx';

export default function ClickSparkLayer() {
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark',
  );

  useEffect(() => {
    const read = () => document.documentElement.dataset.theme === 'dark';
    setDark(read());
    const obs = new MutationObserver(() => setDark(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  return (
    <ClickSpark
      global
      sparkColor={dark ? '#fff' : '#7c3aed'}
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    />
  );
}
