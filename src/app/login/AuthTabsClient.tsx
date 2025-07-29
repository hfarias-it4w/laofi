"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import LoginFormClient from "./LoginFormClient";

const RegisterForm = dynamic(() => import("./RegisterForm"), { ssr: false });

export default function AuthTabsClient() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  return (
    <div className="w-full max-w-md">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 rounded-t-lg font-bold text-sm transition-colors ${tab === 'login' ? 'bg-white text-blue-700 shadow' : 'bg-blue-100 text-blue-400'}`}
          onClick={() => setTab('login')}
          type="button"
        >
          Iniciar sesión
        </button>
        <button
          className={`flex-1 py-2 rounded-t-lg font-bold text-sm transition-colors ${tab === 'register' ? 'bg-white text-blue-700 shadow' : 'bg-blue-100 text-blue-400'}`}
          onClick={() => setTab('register')}
          type="button"
        >
          Registrarse
        </button>
      </div>
      <div className="bg-white/90 rounded-b-2xl shadow-lg p-6">
        {tab === 'login' ? <LoginFormClient /> : <RegisterForm />}
      </div>
    </div>
  );
}
