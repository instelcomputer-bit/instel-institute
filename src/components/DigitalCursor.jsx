import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const springConfigs = [
  { stiffness: 520, damping: 36, mass: 0.18 },
  { stiffness: 300, damping: 32, mass: 0.28 },
  { stiffness: 190, damping: 28, mass: 0.38 },
];

export default function DigitalCursor() {
  const pointerX = useMotionValue(-40);
  const pointerY = useMotionValue(-40);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const trail1X = useSpring(pointerX, springConfigs[0]);
  const trail1Y = useSpring(pointerY, springConfigs[0]);
  const trail2X = useSpring(pointerX, springConfigs[1]);
  const trail2Y = useSpring(pointerY, springConfigs[1]);
  const trail3X = useSpring(pointerX, springConfigs[2]);
  const trail3Y = useSpring(pointerY, springConfigs[2]);

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const syncPointerType = () => setEnabled(finePointer.matches);
    const handleMove = (event) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);

    syncPointerType();
    finePointer.addEventListener('change', syncPointerType);
    window.addEventListener('pointermove', handleMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      finePointer.removeEventListener('change', syncPointerType);
      window.removeEventListener('pointermove', handleMove);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [pointerX, pointerY]);

  if (!enabled) return null;

  const sharedClass = 'fixed left-0 top-0 z-[9999] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2';

  return (
    <div aria-hidden="true" className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <motion.span style={{ x: trail3X, y: trail3Y }} className={`${sharedClass} w-5 h-5 bg-blue-500/8 blur-[3px]`} />
      <motion.span style={{ x: trail2X, y: trail2Y }} className={`${sharedClass} w-3 h-3 bg-blue-400/15 blur-[2px]`} />
      <motion.span style={{ x: trail1X, y: trail1Y }} className={`${sharedClass} w-2 h-2 bg-sky-400/35 blur-[1px]`} />
      <motion.span
        style={{ x: pointerX, y: pointerY }}
        className={`${sharedClass} w-2.5 h-2.5 bg-cyan-300 border border-white/80 shadow-[0_0_8px_#38bdf8,0_0_18px_rgba(59,130,246,0.65)]`}
      />
    </div>
  );
}
