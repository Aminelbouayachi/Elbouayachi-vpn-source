import React from 'react';
import {
  Zap,
  Gamepad2,
  Wifi,
  Activity,
  Lock,
  Download,
  Flame,
  ArrowRightLeft,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { CarrierType } from '../types';

interface QuickShortcutsBarProps {
  onQuickStar6ToStar3: (carrier: CarrierType) => void;
  onActivateGamingMode: () => void;
  onOpenShareNet: () => void;
  onOpenTools: () => void;
  onOpenAdmin: () => void;
  onInstallApp: () => void;
  activeCarrier: CarrierType;
}

export const QuickShortcutsBar: React.FC<QuickShortcutsBarProps> = ({
  onQuickStar6ToStar3,
  onActivateGamingMode,
  onOpenShareNet,
  onOpenTools,
  onOpenAdmin,
  onInstallApp,
  activeCarrier,
}) => {
  return (
    <div className="w-full my-3">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>خانة الاختصارات السريعة (Shortcuts)</span>
        </h3>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
          تحويل *6 ➔ *3 بنقرة واحدة
        </span>
      </div>

      {/* Moroccan Operator *6 to *3 Instant Selectors */}
      <div className="p-2.5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0e1626] to-slate-900 border border-amber-500/30 mb-2.5 shadow-lg">
        <div className="text-[11px] font-bold text-white mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>تحويل رصيد مواقع التواصل (*6) إلى أنترنيت كاملة (*3):</span>
          </span>
          <span className="text-[10px] text-slate-400">اختر شبكتك</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {/* Inwi *6 -> *3 */}
          <button
            onClick={() => onQuickStar6ToStar3('inwi')}
            className={`p-2 rounded-xl text-center border transition-all active:scale-95 flex flex-col items-center gap-1 ${
              activeCarrier === 'inwi'
                ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-purple-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-bold">إنوي Inwi</span>
            <span className="text-[9px] font-mono text-purple-400">*6 ➔ *3</span>
          </button>

          {/* Orange *6 -> *3 */}
          <button
            onClick={() => onQuickStar6ToStar3('orange')}
            className={`p-2 rounded-xl text-center border transition-all active:scale-95 flex flex-col items-center gap-1 ${
              activeCarrier === 'orange'
                ? 'bg-orange-950/80 border-orange-500 text-orange-200 shadow-md shadow-orange-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-orange-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs font-bold">أورنج Orange</span>
            <span className="text-[9px] font-mono text-orange-400">*6 ➔ *3</span>
          </button>

          {/* IAM *6 -> *3 */}
          <button
            onClick={() => onQuickStar6ToStar3('iam')}
            className={`p-2 rounded-xl text-center border transition-all active:scale-95 flex flex-col items-center gap-1 ${
              activeCarrier === 'iam'
                ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-md shadow-blue-950/50'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-bold">اتصالات IAM</span>
            <span className="text-[9px] font-mono text-blue-400">*6 ➔ *3</span>
          </button>
        </div>
      </div>

      {/* Quick Action Pills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Gaming Low-Ping Shortcut */}
        <button
          onClick={onActivateGamingMode}
          className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-white transition-all flex items-center gap-2 group text-right"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-bold truncate">مود الألعاب</span>
            <span className="block text-[9px] text-emerald-400 font-mono">Ping &lt; 20ms</span>
          </div>
        </button>

        {/* Hotspot Sharing Shortcut */}
        <button
          onClick={onOpenShareNet}
          className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all flex items-center gap-2 group text-right"
        >
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Wifi className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-bold truncate">بارطاجي النت</span>
            <span className="block text-[9px] text-cyan-400 font-mono">Proxy 8080</span>
          </div>
        </button>

        {/* Diagnostic Tools Shortcut */}
        <button
          onClick={onOpenTools}
          className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-white transition-all flex items-center gap-2 group text-right"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Activity className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-bold truncate">فحص السرعة</span>
            <span className="block text-[9px] text-amber-400 font-mono">Speed & Ping</span>
          </div>
        </button>

        {/* Admin Panel Password Protected Shortcut */}
        <button
          onClick={onOpenAdmin}
          className="p-2.5 rounded-xl bg-slate-900/70 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-500 text-slate-200 hover:text-amber-300 transition-all flex items-center gap-2 group text-right"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Lock className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <span className="block text-xs font-bold truncate text-amber-300">خانة المطور</span>
            <span className="block text-[9px] text-amber-400/80 font-mono">بكلمة المرور 🔐</span>
          </div>
        </button>
      </div>
    </div>
  );
};
