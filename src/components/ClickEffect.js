import React, { useEffect, useState } from 'react';
import { formatNumber } from '../utils/formatNumber';

export default function ClickEffect({ x, y, amount, onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone(); // notify parent to remove this animation
    }, 800); // animation duration

    return () => clearTimeout(timer);
  }, [onDone]);

  if (!visible) return null;

  return (
    <span
      className="fixed text-3xl font-bold text-white pointer-events-none animate-pop custom-outline"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      +{formatNumber(amount)}
    </span>
  );
}
