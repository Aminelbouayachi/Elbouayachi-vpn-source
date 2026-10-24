import React from 'react';
import { Shield, Menu, Lock } from 'lucide-react';
import { ConnectionStatus, AppSettings } from '../types';
import { getTranslation } from '../utils/translations';

interface HeaderProps {
  status: ConnectionStatus;
  settings: AppSettings;
  onOpenMenu: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  settings,
  onOpenMenu,
  onOpenAdmin,
}) => {
  const t = getTranslation(settings.language);

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return t.connected;
      case 'connecting':
        return t.connecting;
      case 'disconnecting':
        return t.disconnecting;
      default:
        return t.disconnected;
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md px-4 py-3">
      <div className="w-full flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0b101b] rounded-[9px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            {status === 'connected' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#090d16] animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1">
                <span>{settings.appName || 'Elbouayachi VPN'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  PRO
                </span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>🇲🇦 {t.tagline}</span>
              <span>·</span>
              <span
                className={`font-mono ${
                  status === 'connected'
                    ? 'text-emerald-400 font-bold'
                    : status === 'connecting'
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {getStatusText()}
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Developer / Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
            title="خانة المطور 🔐"
            aria-label="خانة المطور"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* 3-Line Hamburger Menu Button (☰) */}
          <button
            onClick={onOpenMenu}
            className="flex items-center justify-center p-2 rounded-xl text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all active:scale-95 shadow-sm"
            title="القائمة (٣ شرطات)"
            aria-label="فتح القائمة الجانبية"
          >
            <Menu className="w-5 h-5 text-emerald-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
