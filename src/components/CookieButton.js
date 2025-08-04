import React, { useContext, useState } from 'react';
import { CookieContext } from '../context/CookieContext';
import cookieImg from '../assets/cookie.png';
import ClickEffect from '../components/ClickEffect';

export default function CookieButton() {
  const { increment, clickPower, productionMultiplier } = useContext(CookieContext); //grab increment and clickpower from context
  const [clicks, setClicks] = useState([]);

  const handleClick = (e) => { //capture event object
    increment(1);

    const newClick = {
      id: Date.now() + Math.random(), //unique id
      x: e.clientX - 100 + Math.random() * 200,
      y: e.clientY - Math.random() * 100,
      amount: clickPower * productionMultiplier,
    };

    //append a new click to the clicks array
    setClicks((prev) => [...prev, newClick]); // more reliable for fast clicks
  };

  const removeClick = (id) => {
    setClicks((prev) => prev.filter((click) => click.id !== id)); //exlclude click object with matching id
  }

  return (
    <>
      <button
        onClick={handleClick}
        aria-label="Click the cookie"
        className="focus:outline-none active:scale-95 transition-transform duration-100" //tailwind click animation
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <img
          src={cookieImg}
          alt="Cookie"
          className="w-[350px] h-[350px] rounded-full object-cover select-none"
        />
      </button>

      {clicks.map((click) =>(
        <ClickEffect
          key={click.id}
          x={click.x}
          y={click.y}
          amount={click.amount}
          onDone={() => removeClick(click.id)}
        />
      ))}
    </>
  );
}
