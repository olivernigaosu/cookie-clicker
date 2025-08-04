import React, { useState, useContext } from 'react';
import { CookieContext } from '../context/CookieContext';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '../utils/supabaseClient';

export default function Options() {
  const {
    clearSave,
    cookies,
    allTimeCookies,
    clickPower,
    autoClickRate,
    shopItems,
    productionMultiplier,
    setCookies,
    setAllTimeCookies,
    setClickPower,
    setAutoClickRate,
    setShopItems,
    setProductionMultiplier,
    saveToSupabase,
    loadFromSupabase,
  } = useContext(CookieContext);

  const user = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatusMessage(error ? 'Invalid Credentials.' : 'Signed In!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.includes('User already registered')) {
        setStatusMessage('Account Already Exists.');
      } else {
        setStatusMessage('Invalid Credentials.');
      }
    } else {
      setStatusMessage('Signed Up! ✅');
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) clearSave();
    setStatusMessage(error ? 'Failed to Sign Out.' : 'Signed Out. ✅');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleExport = () => {
    const saveData = { cookies, allTimeCookies, clickPower, autoClickRate, productionMultiplier, shopItems };
    const json = JSON.stringify(saveData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'cookie_save.json';
    link.href = URL.createObjectURL(blob);
    link.click();
    setStatusMessage('Export Successful!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (typeof data === 'object') {
          setCookies(data.cookies || 0);
          setAllTimeCookies(data.allTimeCookies || 0);
          setClickPower(data.clickPower || 1);
          setAutoClickRate(data.autoClickRate || 0);
          setProductionMultiplier(data.productionMultiplier || 1);
          setShopItems(data.shopItems || {});
          setStatusMessage('Import Successful!');
        } else {
          setStatusMessage('Invalid file format.');
        }
      } catch (err) {
        console.error('Failed to load save:', err);
        setStatusMessage('Failed to load save file.');
      }
    };
    reader.readAsText(file);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleSave = async () => {
    const result = await saveToSupabase();
    setStatusMessage(result?.success ? 'Game saved successfully! ✅' : 'Failed to save.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleLoad = async () => {
    const result = await loadFromSupabase();
    setStatusMessage(result?.success ? 'Game loaded successfully! ✅' : 'Failed to load.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleClearSave = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000); // reset if no second click after 3 seconds
    } else {
      clearSave();
      setStatusMessage('Save Cleared. ✅');
      setConfirmClear(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const buttonStyle = 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full';
  const clearBtn = 'bg-white hover:bg-gray-100 text-red-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full';

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Options</h1>

      <div className="min-h-[28px] mt-4 text-center text-lg font-medium">
        {statusMessage && (
          <span className="text-green-600 transition-opacity duration-300 ease-in-out">
            {statusMessage}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-x-auto rounded border border-gray-300 shadow-sm bg-white p-6">
        {/* Auth Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Account</h2>
          {!user ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <button onClick={handleSignIn} className={buttonStyle}>
                Sign In
              </button>
              <button onClick={handleSignUp} className={buttonStyle}>
                Sign Up
              </button>
            </>
          ) : (
            <button onClick={handleSignOut} className={buttonStyle}>
              Sign Out ({user.email})
            </button>
          )}
        </div>

        {/* Save/Load Column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Progress</h2>
          <button onClick={handleSave} className={buttonStyle}>
            💾 Save to Supabase
          </button>
          <button onClick={handleLoad} className={buttonStyle}>
            💾 Load from Supabase
          </button>
          <button onClick={handleExport} className={buttonStyle}>
            📤 Export Save to File
          </button>
          <label className="block">
            <span className={buttonStyle + ' text-center block cursor-pointer'}>
              📥 Import Save from File
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </span>
          </label>
          <button onClick={handleClearSave} className={clearBtn}>
            {confirmClear ? 'Confirm Clear?' : '🗑️ Clear Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
