import React, { useContext } from 'react';
import { CookieContext } from '../context/CookieContext';
import { formatNumber } from '../utils/formatNumber';

export default function Shop() {
  const { cookies, purchaseUpgrade, shopItems } = useContext(CookieContext);

  const leftKeys = ['click', 'multiplier'];
  const rightKeys = [
    'auto1', 'auto10', 'auto100', 'auto1000', 'auto10000',
    'auto100000', 'auto1e6', 'auto1e7', 'auto1e8', 'auto1e9'
  ];

  const renderCard = (key) => {
  const item = shopItems[key];
  const affordable = cookies >= item.cost;

  return (
    <div
      key={key}
      onClick={() => affordable && purchaseUpgrade(key)}
      className={`flex items-center justify-between gap-4 border rounded-lg p-4 cursor-pointer transform transition duration-200
        ${affordable
          ? 'bg-white hover:scale-105 active:scale-95 hover:bg-gray-50 shadow-md'
          : 'bg-gray-200 hover:scale-105 text-gray-500 opacity-70'
        }`}
    >
      {/* Emoji */}
      <div className="text-5xl w-12 text-center">{item.emoji}</div>

      {/* Name, Cost, CPS */}
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <span className="text-black-600 font-bold underline-offset-1">
            {key === 'click'
              ? 'x2 / click'
              : key === 'multiplier'
              ? '+2% boost'
              : `+${formatNumber(item.baseCost / 10)} cps`
            }
          </span>
        </div>
        <p className="text-m font-bold text-black">🍪{formatNumber(item.cost)}</p>
      </div>

      {/* Count owned */}
      <div className="text-3xl font-bold w-12 text-right">
        {item.count}
      </div>
    </div>
  );
};


  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-3xl font-bold text-black text-center mt-12 mb-8">
        {formatNumber(cookies)} Cookies
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">{leftKeys.map(renderCard)}</div>
        <div className="space-y-4">{rightKeys.map(renderCard)}</div>
      </div>
    </div>
  );
}
