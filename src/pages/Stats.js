import React, { useContext, useEffect, useState, useRef } from 'react';
import { CookieContext } from '../context/CookieContext';
import { formatNumber } from '../utils/formatNumber';

export default function Stats() {
  const {
    cookies,
    allTimeCookies,
    autoClickRate,
    clickPower,
    productionMultiplier
  } = useContext(CookieContext);

  const [avgCPS, setAvgCPS] = useState(0);
  const allTimeRef = useRef(allTimeCookies);
  const lastAllTimeRef = useRef(allTimeCookies);

  // Keep the ref in sync with live value
  useEffect(() => {
    allTimeRef.current = allTimeCookies;
  }, [allTimeCookies]);

  // Update CPS every second
  useEffect(() => {
    const interval = setInterval(() => {
      const earned = allTimeRef.current - lastAllTimeRef.current;
      setAvgCPS(earned);
      lastAllTimeRef.current = allTimeRef.current;
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Cookies in Bank', value: formatNumber(cookies) },
    { label: 'All-Time Cookies', value: formatNumber(allTimeCookies) },
    { label: 'Average Cookies / Sec', value: formatNumber(avgCPS) },
    { label: 'Cookies Produced / Sec', value: `${formatNumber(autoClickRate)}` },
    { label: 'Production Multiplier', value: `${Math.round(productionMultiplier * 100)}%` },
    { label: 'Cookies Per Click', value: formatNumber(clickPower * productionMultiplier) }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Game Statistics</h1>

      <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white">
          <thead>
            <tr className="*:font-bold *:text-black text-left">
              <th className="px-4 py-3">Statistic</th>
              <th className="px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stats.map((stat) => (
              <tr key={stat.label} className="text-black font-medium text-left">
                <td className="px-4 py-2 whitespace-nowrap" >{stat.label}</td>
                <td className="px-4 py-2 whitespace-nowrap min-w-[150px]">{stat.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
