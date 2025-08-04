import React, { useContext } from 'react';
import CookieButton from '../components/CookieButton';
import { CookieContext } from '../context/CookieContext';
import { formatNumber } from '../utils/formatNumber';

export default function Home() {
  const { cookies, autoClickRate, productionMultiplier } = useContext(CookieContext);

  return (
    <div className="flex flex-col items-center justify-center mt-12 mb-0 space-y-6">
      <div>
        <p className="text-3xl font-bold text-black">{formatNumber(cookies)} Cookies</p>
        <p className="text-lg text-black text-center font-bold mt-1">+{formatNumber(autoClickRate * productionMultiplier)} per second</p>
      </div>

      <CookieButton />
    </div>
  );
}
