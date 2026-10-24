import React from 'react';
import {
  X,
  Lock,
  Wifi,
  Activity,
  Terminal,
  Settings,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Server,
  Layers,
  ChevronRight,
  Flame,
  Radio,
} from 'lucide-react';
import { ConnectionStatus, Language, AppSettings } from '../types';
import { getTranslation } from '../utils/translations';

interface SideDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  status: ConnectionStatus;
  settings: AppSettings;
  onOpenAdmin: () => void;
  onOpenShareNet: () => void;
  onOpenTools: () => void;
  onOpenLogs: () => void;
  onOpenSettings: () => void;
  onOpenServers: () => void;
  onOpenPayloads: () => void;
  onInstallApp: () => void;
  onLanguageChange: (lang: Language) => void;
}

export const SideDrawerMenu: React.FC<SideDrawerMenuProps> = ({
  isOpen,
  onClose,
  status,
  settings,
  onOpenAdmin,
  onOpenShareNet,
  onOpenTools,
  onOpenLogs,
  onOpenSettings,
  onOpenServers,
  onOpenPayloads,
  onInstallApp,
  onLanguageChange,
}) => {
  if (!isOpen) return null;

  const t = getTranslation(settings.language);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel (Mobile-optimized width) */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] h-full bg-[#0b101c] border-l border-slate-800 shadow-2xl flex flex-col z-10 text-white animate-in slide-in-from-right duration-200 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800/80 bg-[#070b13] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b101b] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{settings.appName || 'Elbouayachi VPN'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  PRO
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === 'connected'
                      ? 'bg-emerald-400'
                      : status === 'connecting'
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-slate-500'
                  }`}
                />
                <span className="font-mono text-emerald-400 text-[10px]">
                  {status === 'connected' ? 'نفق نشط 🇲🇦' : 'غير متصل'}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* SPECIAL SECTION: DEVELOPER PANEL (خانة المطور) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>الوصول الخاص</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                محمي 🔐
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="w-full text-right p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 hover:border-amber-400 transition-all group flex items-center justify-between shadow-lg shadow-amber-950/40 active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                    <span>خانة المطور</span>
                    <span className="text-[10px] text-amber-400 font-normal">(Developer)</span>
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    التحكم بالسيرفرات والبايلودات بكلمة المرور
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Tunnel Management */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-400 px-1 tracking-wider uppercase">
              إدارة النفق والسيرفرات
            </span>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenServers();
                }}
                className="w-full text-right p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">قائمة السيرفرات</span>
                    <span className="text-[10px] text-slate-400">سيرفرات المغرب وأوروبا فائقة السرعة</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 rtl:rotate-180" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenPayloads();
                }}
                className="w-full text-right p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">بايلودات المشغلين (*6 ➔ *3)</span>
                    <span className="text-[10px] text-slate-400">إنوي · أورنج · اتصالات المغرب</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Network & Sharing Tools */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-400 px-1 tracking-wider uppercase">
              الأدوات والمشاركة
            </span>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenShareNet();
                }}
                className="w-full text-right p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">مشاركة النت (Share Net)</span>
                    <span className="text-[10px] text-slate-400">مشاركة نفق الـ VPN عبر الـ Hotspot</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 rtl:rotate-180" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTools();
                }}
                className="w-full text-right p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">فحص السرعة والـ DNS</span>
                    <span className="text-[10px] text-slate-400">قياس البينغ، السرعة والـ IP الحقيقي</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 rtl:rotate-180" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenLogs();
                }}
                className="w-full text-right p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">سجلات النفق (Live Logs)</span>
                    <span className="text-[10px] text-slate-400">سجل مصافحة TLS وتدفق الحزم</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Settings & Language */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-slate-400 px-1 tracking-wider uppercase">
              التفضيلات والنظام
            </span>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full text-right p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">إعدادات التطبيق</span>
                    <span className="text-[10px] text-slate-400">Kill Switch و DNS over HTTPS</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 rtl:rotate-180" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onInstallApp();
                }}
                className="w-full text-right p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">تثبيت التطبيق على الهاتف</span>
                    <span className="text-[10px] text-emerald-300">إضافة للشاشة الرئيسية بنقرة واحدة</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 rtl:rotate-180" />
              </button>
            </div>

            {/* Language Selector in Drawer */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/90 mt-2">
              <label className="block text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>لغة الواجهة (Language):</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'darija', label: '🇲🇦 الدارجة' },
                  { id: 'ar', label: 'العربية' },
                  { id: 'fr', label: 'Français' },
                  { id: 'en', label: 'English' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onLanguageChange(l.id as Language)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      settings.language === l.id
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#070b13] text-center text-[10px] text-slate-500">
          <span>{settings.appName} · خصوصية وتشفير كامل 100%</span>
        </div>
      </div>
    </div>
  );
};
