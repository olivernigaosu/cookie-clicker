import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (type) => {
    const fn = type === 'signup' ? supabase.auth.signUp : supabase.auth.signInWithPassword;

    const { error } = await fn({ email, password });
    if (error) alert(error.message);
    else alert(`${type} successful! Check console.`);
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={() => handleLogin('signup')}>Sign Up</button>
      <button onClick={() => handleLogin('signin')}>Log In</button>
    </div>
  );
}
