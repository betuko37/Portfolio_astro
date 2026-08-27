import { useEffect, useState } from 'react';
import GradientWaves from './GradientWaves.jsx';

export default function WavesBg() {
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
    <GradientWaves
      horizonColor={dark ? '#2e1065' : '#7c3aed'}
      waveColor={dark ? '#7c3aed' : '#a78bfa'}
      crestColor={dark ? '#c4b5fd' : '#ffffff'}
      speed={0.4}
      amplitude={2.5}
      waveScale={0.6}
      waveRatio={0.9}
      swell={35}
      turbulence={20}
      tilt={1.11}
      zoom={1}
      height={5.5}
      fogDepth={15}
      detail={dark ? 'low' : 'medium'}
      brightness={1}
      opacity={1}
      mouseInteraction
      parallaxStrength={0.5}
      grain
      grainIntensity={dark ? 0.12 : 0.25}
    />
  );
}
