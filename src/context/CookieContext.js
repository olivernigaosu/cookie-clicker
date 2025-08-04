import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { supabase } from '../utils/supabaseClient';
import { useSession, useUser } from '@supabase/auth-helpers-react';


export const CookieContext = createContext();

export function CookieProvider({ children }) {
  const [cookies, setCookies] = useState(0);
  const [allTimeCookies, setAllTimeCookies] = useState(0);
  const [autoClickRate, setAutoClickRate] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [productionMultiplier, setProductionMultiplier] = useState(1);
  
  const [shopItems, setShopItems] = useState({
    auto1:      { emoji: '👵', name: 'Lazy Grandma',        count: 0, baseCost: 10,          cost: 10, },
    auto10:     { emoji: '🧑‍🏭', name: 'Factory Intern',      count: 0, baseCost: 100,         cost: 100 },
    auto100:    { emoji: '🚁', name: 'Cookie Drone',        count: 0, baseCost: 1000,        cost: 1000 },
    auto1000:   { emoji: '🏭', name: 'Cookie Factory',      count: 0, baseCost: 10000,       cost: 10000 },
    auto10000:  { emoji: '🔬', name: 'Cookie Lab',          count: 0, baseCost: 100000,      cost: 100000 },
    auto100000: { emoji: '⏳', name: 'Time Baker',          count: 0, baseCost: 1000000,     cost: 1000000 },
    auto1e6:    { emoji: '👽', name: 'Alien Chef',          count: 0, baseCost: 10000000,    cost: 10000000 },
    auto1e7:    { emoji: '⚛️', name: 'Quantum Bakery',     count: 0, baseCost: 100000000,   cost: 100000000 },
    auto1e8:    { emoji: '🌌', name: 'Cookieverse',         count: 0, baseCost: 1000000000,  cost: 1000000000 },
    auto1e9:    { emoji: '🌐', name: 'Cookie Singularity',  count: 0, baseCost: 10000000000, cost: 10000000000 },
    click:      { emoji: '👆', name: "Click Multiplier",    count: 0, baseCost: 50,          cost: 50 },
    multiplier: { emoji: '📈', name: "Production Multiplier", count: 0, baseCost: 100,       cost: 100 },
  });

  // Load cookies from browser cookie on app start
useEffect(() => {
  const savedCookies = parseInt(Cookies.get('cookies'));
  const savedAllTime = parseInt(Cookies.get('allTimeCookies'));
  const savedClickPower = parseInt(Cookies.get('clickPower'));
  const savedAutoClickRate = parseInt(Cookies.get('autoClickRate'));
  const savedShopItems = Cookies.get('shopItems');
  const savedProductionMultiplier = parseFloat(Cookies.get('productionMultiplier'));

  if (!isNaN(savedCookies)) setCookies(savedCookies);
  if (!isNaN(savedAllTime)) setAllTimeCookies(savedAllTime);
  if (!isNaN(savedClickPower)) setClickPower(savedClickPower);
  if (!isNaN(savedAutoClickRate)) setAutoClickRate(savedAutoClickRate);
  if (!isNaN(savedProductionMultiplier)) setProductionMultiplier(savedProductionMultiplier);
  if (savedShopItems) {
    try {
      setShopItems(JSON.parse(savedShopItems));
    } catch (err) {
      console.error("Invalid shopItems JSON:", err);
    }
  }
}, []);

  // Save cookies to browser cookie on change
  useEffect(() => {
    Cookies.set('cookies', cookies.toString());
    Cookies.set('allTimeCookies', allTimeCookies.toString());
    Cookies.set('clickPower', clickPower.toString());
    Cookies.set('autoClickRate', autoClickRate.toString());
    Cookies.set('shopItems', JSON.stringify(shopItems));
    Cookies.set('productionMultiplier', productionMultiplier.toString());
  }, [cookies, allTimeCookies, clickPower, autoClickRate, shopItems, productionMultiplier]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickRate > 0) {            // if you have any auto clickers,
        setCookies(prev => prev + autoClickRate * productionMultiplier);  // add cookies based on cookie rate
        setAllTimeCookies(prev => prev + autoClickRate * productionMultiplier);
      }
    }, 1000); // loop every 1 second

    return () => clearInterval(interval); // stop old interval before beginning new one
  }, [autoClickRate, productionMultiplier]);

  //supabase authentication + save/load functions
  const user = useUser();

  const saveToSupabase = async () => {
    if (!user) {
      console.error('No user logged in — cannot save.');
      return {success: false };
    }

    const { error } = await supabase
      .from('saves')
      .upsert(
        [
          {
            user_id: user.id,
            save_data: {
              cookies,
              allTimeCookies,
              autoClickRate,
              clickPower,
              productionMultiplier,
              shopItems,
            },
          },
        ],
        { onConflict: 'user_id' }
      );

    if (error) {
      console.error('Error saving:', error);
      return { success: false };
    }
    else {
      console.log('Game saved!');
      return { success: true };
    }
  }

  const loadFromSupabase = async () => {
    if (!user) {
      console.error('No user logged in — cannot load save.');
      return { success: false };
    }

    const { data, error } = await supabase
      .from('saves')
      .select('save_data')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading:', error);
      return { success: false };
    } else if (data) {
      const save = data.save_data;
      setCookies(save.cookies);
      setAllTimeCookies(save.allTimeCookies);
      setAutoClickRate(save.autoClickRate);
      setClickPower(save.clickPower);
      setProductionMultiplier(save.productionMultiplier);
      setShopItems(save.shopItems);
      console.log('Save loaded!');
      return { success: true };
    }
  };

  const increment = (amount = 1) => {
    const realAmount = amount * clickPower * productionMultiplier; //accounts for multipliers
    setCookies(prev => prev + realAmount);
    setAllTimeCookies(prev => prev + realAmount);
  };

  const purchaseUpgrade = (type) => {
    const item = shopItems[type];
    if (!item || cookies < item.cost) return;
    
    setCookies(prev => prev - item.cost);

    const autoUpgradeValues ={
      auto1: 1,
      auto10: 10,
      auto100: 100,
      auto1000: 1000,
      auto10000: 10000,
      auto100000: 100000,
      auto1e6: 1e6,
      auto1e7: 1e7,
      auto1e8: 1e8,
      auto1e9: 1e9,
    }

    // apply upgrade
    if (type in autoUpgradeValues) {
      setAutoClickRate(prev => prev + autoUpgradeValues[type]);
    } else if (type === 'click') {
      setClickPower(prev => prev * 2);
    } else if (type === 'multiplier') {
      setProductionMultiplier(prev => prev * 1.02);
    }

    // update cost and count
    setShopItems(prev => {
      const nextCount = prev[type].count + 1;

      const newCost =
        type === 'click'
          ? Math.floor(prev[type].baseCost * Math.pow(10, nextCount)) // 10x cost growth for click
          : Math.floor(prev[type].baseCost * Math.pow(1.15, nextCount)); // default 1.15 growth

      return {
        ...prev,
        [type]: {
          ...prev[type],
          count: nextCount,
          cost: newCost,
        },
      };
    });
  };

  const clearSave = () => {
    Cookies.remove('cookies');
    Cookies.remove('allTimeCookies');
    Cookies.remove('clickPower');
    Cookies.remove('autoClickRate');
    Cookies.remove('shopItems');
    Cookies.remove('productionMultiplier');

    setCookies(0);
    setAllTimeCookies(0);
    setClickPower(1);
    setAutoClickRate(0);
    setProductionMultiplier(1);
    setShopItems({
      auto1:      { emoji: '👵', name: 'Lazy Grandma',        count: 0, baseCost: 10,          cost: 10 },
      auto10:     { emoji: '🧑‍🏭', name: 'Factory Intern',      count: 0, baseCost: 100,         cost: 100 },
      auto100:    { emoji: '🚁', name: 'Cookie Drone',        count: 0, baseCost: 1000,        cost: 1000 },
      auto1000:   { emoji: '🏭', name: 'Cookie Factory',      count: 0, baseCost: 10000,       cost: 10000 },
      auto10000:  { emoji: '🔬', name: 'Cookie Lab',          count: 0, baseCost: 100000,      cost: 100000 },
      auto100000: { emoji: '⏳', name: 'Time Baker',          count: 0, baseCost: 1000000,     cost: 1000000 },
      auto1e6:    { emoji: '👽', name: 'Alien Chef',          count: 0, baseCost: 10000000,    cost: 10000000 },
      auto1e7:    { emoji: '⚛️', name: 'Quantum Bakery',     count: 0, baseCost: 100000000,   cost: 100000000 },
      auto1e8:    { emoji: '🌌', name: 'Cookieverse',         count: 0, baseCost: 1000000000,  cost: 1000000000 },
      auto1e9:    { emoji: '🌐', name: 'Cookie Singularity',  count: 0, baseCost: 10000000000, cost: 10000000000 },
      click:      { emoji: '👆', name: "Click Multiplier",    count: 0, baseCost: 50,          cost: 50 },
      multiplier: { emoji: '📈', name: "Production Multiplier", count: 0, baseCost: 100,       cost: 100 },
    });
  }

  return (
    <CookieContext.Provider
      value={{
        cookies,
        allTimeCookies,
        increment,
        purchaseUpgrade,
        autoClickRate,
        clickPower,
        shopItems,
        productionMultiplier,
        clearSave,
        setCookies,
        setAllTimeCookies,
        setClickPower,
        setAutoClickRate,
        setShopItems,
        setProductionMultiplier,
        saveToSupabase,
        loadFromSupabase,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
}
