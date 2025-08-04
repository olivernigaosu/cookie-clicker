import React from 'react';
import cookieImg from '../assets/cookie.png';

export default function CookieRain() {
  const cookies = Array.from({ length: 20 });

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-10] overflow-hidden">
      {cookies.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const size = 60 + Math.random() * 30

        return (
          <img
            key={i}
            src={cookieImg}
            alt="cookie"
            className="absolute animate-[fall_10s_linear_infinite]"
            style={{
              left: `${left}%`,
              top: `-100px`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
