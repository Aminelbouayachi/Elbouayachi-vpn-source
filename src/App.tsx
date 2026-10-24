import React, { useState, useEffect, useRef } from 'react';
import { SERVERS_LIST, CARRIER_TWEAKS, DNS_SERVERS } from './data/servers';
import {
  Server,
  CarrierTweak,
  CarrierType,
  ConnectionStatus,
  ConnectionStats,
  LogEntry,
  ProxyConfig,
  AppSettings,
  Language,
} from './types';
import { Header } from './components/Header';
import { TunnelDashboard } from './components/TunnelDashboard';
import { ServerListModal } from './components/ServerListModal';
import { PayloadEditorModal } from './components/PayloadEditorModal';
import { ShareNetModal } from './components/ShareNetModal';
import { NetworkToolsModal } from './components/NetworkToolsModal';
import { LiveLogsConsole } from './components/LiveLogsConsole';
import { SettingsModal } from './components/SettingsModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { QuickShortcutsBar } from './components/QuickShortcutsBar';
import { SideDrawerMenu } from './components/SideDrawerMenu';
import {
  ShieldCheck,
  Zap,
  Lock,
  Terminal,
  Radio,
  Smartphone,
  Download,
  CheckCircle,
  Info,
  X,
  ChevronRight,
  ExternalLink,
  Flame,
  LayoutGrid,
  Bell,
  Server as ServerIcon,
  Home,
  Wifi,
  Activity,
} from 'lucide-react';

export default function App() {
  // App Settings with user's desired name: "Elbouayachi VPN"
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('elbouayachi_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      appName: 'Elbouayachi VPN',
      appSubtitle: 'Moroccan High-Speed Tunnel & Proxy',
      accentColor: 'emerald',
      killSwitch: true,
      bypassLan: true,
      dnsOverHttps: true,
      autoReconnect: true,
      selectedDns: 'Cloudflare Fast DNS',
      language: 'darija',
    };
  });

  // Servers List (allows custom servers)
  const [servers, setServers] = useState<Server[]>(() => {
    const saved = localStorage.getItem('elbouayachi_servers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return SERVERS_LIST;
  });

  // Carrier Tweaks List (allows adding/editing tweaks via admin panel)
  const [tweaks, setTweaks] = useState<CarrierTweak[]>(() => {
    const saved = localStorage.getItem('elbouayachi_tweaks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return CARRIER_TWEAKS;
  });

  const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
  const [selectedTweak, setSelectedTweak] = useState<CarrierTweak>(tweaks[0]);
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');

  // Live Stats
  const [stats, setStats] = useState<ConnectionStats>(() => {
    const initialHistory = Array.from({ length: 30 }, (_, i) => ({
      time: `-${30 - i}s`,
      speedMB: 0,
    }));
    return {
      durationSeconds: 0,
      downloadSpeedBytes: 0,
      uploadSpeedBytes: 0,
      totalDownloadBytes: 42 * 1024 * 1024,
      totalUploadBytes: 12 * 1024 * 1024,
      currentPing: 16,
      virtualIp: '51.83.104.218',
      speedHistory: initialHistory,
    };
  });

  // Proxy Share Net
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>({
    isEnabled: true,
    socksPort: 10808,
    httpPort: 8080,
    localIp: '192.168.43.1',
    activeClientsCount: 2,
  });

  // Diagnostic Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '09:54:12',
      level: 'info',
      message: 'نواة Elbouayachi VPN جاهزة للعمل على شبكات 4G و 5G (Inwi / Orange / IAM)',
    },
    {
      id: 'log-2',
      timestamp: '09:54:14',
      level: 'info',
      message: 'محرك V2Ray-Core v5.14.1 و SSH Engine مهيأ وجاهز للتشفير',
    },
  ]);

  // Modal Visibility States
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [isShareNetOpen, setIsShareNetOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMobileFrameView, setIsMobileFrameView] = useState(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setIsInstallModalOpen(true);
    }
  };

  // Sync document direction and title with settings
  useEffect(() => {
    const isRtl = settings.language === 'darija' || settings.language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = isRtl ? 'ar' : settings.language;
    document.title = `${settings.appName} - Moroccan High-Speed Tunnel & Proxy`;
  }, [settings.language, settings.appName]);

  // Save settings in local storage
  useEffect(() => {
    localStorage.setItem('elbouayachi_settings', JSON.stringify(settings));
  }, [settings]);

  // Save servers in local storage
  useEffect(() => {
    localStorage.setItem('elbouayachi_servers', JSON.stringify(servers));
  }, [servers]);

  // Save tweaks in local storage
  useEffect(() => {
    localStorage.setItem('elbouayachi_tweaks', JSON.stringify(tweaks));
  }, [tweaks]);

  // Instant Moroccan *6 to *3 converter handler
  const handleQuickStar6ToStar3 = (carrier: CarrierType) => {
    const matchingTweak =
      tweaks.find((t) => t.carrier === carrier && t.id.includes('star6')) ||
      tweaks.find((t) => t.carrier === carrier) ||
      tweaks[0];
    setSelectedTweak(matchingTweak);

    const matchingServer = servers.find((s) => s.carrier === carrier) || servers[0];
    setSelectedServer(matchingServer);

    if (status === 'disconnected') {
      setStatus('connecting');
      addLog('info', `⚡ جاري تحويل رصيد *6 إلى *3 عبر سيرفر ${matchingServer.name}...`);
      addLog('debug', `حقن بروتوكول ${matchingTweak.protocol.toUpperCase()} مع الـ Bug Host: ${matchingTweak.sniHost}`);
      setTimeout(() => {
        setStatus('connected');
        addLog('success', `🎉 تم بنجاح تحويل *6 إلى *3 على شبكة ${matchingTweak.carrierLabel}! تصفح ويوتيوب متاح بالكامل.`);
      }, 1200);
    } else {
      addLog('info', `تم تبديل بايلود تحويل *6 إلى: ${matchingTweak.name}`);
    }
  };

  // Instant Gaming Mode Handler
  const handleActivateGamingMode = () => {
    const gameServer = servers.find((s) => s.id.includes('madrid') || s.pingMs <= 22) || servers[0];
    setSelectedServer(gameServer);
    addLog('success', `🎮 تم تفعيل مود الألعاب: الخادم ${gameServer.name} بنغ فائق السرعة (${gameServer.pingMs}ms) جاهز لـ Free Fire و PUBG!`);
    if (status === 'disconnected') {
      handleToggleConnection();
    }
  };

  const addLog = (level: LogEntry['level'], message: string) => {
    const time = new Date().toLocaleTimeString('fr-FR', { hour12: false });
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: time,
        level,
        message,
      },
      ...prev.slice(0, 150),
    ]);
  };

  // Connection Handler
  const handleToggleConnection = () => {
    if (status === 'disconnected') {
      setStatus('connecting');
      addLog('info', `بدء الاتصال بالسيرفر: ${selectedServer.name} (${selectedServer.ip})...`);
      addLog('debug', `إعداد المسار وحقن الـ SNI: ${selectedTweak.sniHost}`);

      setTimeout(() => {
        addLog('info', `مصافحة TLS 1.3 مع المنفذ ${selectedTweak.port} عبر بروتوكول ${selectedServer.protocol.toUpperCase()}`);
      }, 500);

      setTimeout(() => {
        setStatus('connected');
        addLog('success', `تم الاتصال بنجاح بالنفق! الـ IP الافتراضي الجديد: ${selectedServer.ip}`);
        addLog('success', 'حماية الخصوصية نشطة، تم توجيه كافة حزم البيانات (0.0.0.0/0 -> tun0)');
      }, 1100);
    } else if (status === 'connected') {
      setStatus('disconnecting');
      addLog('warn', 'جاري إغلاق نفق التشفير وفصل الاتصال...');
      setTimeout(() => {
        setStatus('disconnected');
        setStats((prev) => ({
          ...prev,
          downloadSpeedBytes: 0,
          uploadSpeedBytes: 0,
          speedHistory: (prev.speedHistory || []).map((pt) => ({ ...pt, speedMB: 0 })),
        }));
        addLog('info', 'تم قطع الاتصال بالنفق بأمان.');
      }, 600);
    }
  };

  // Background Telemetry Interval when Connected (Tracks last 30 seconds)
  useEffect(() => {
    let interval: any = null;
    if (status === 'connected') {
      interval = setInterval(() => {
        setStats((prev) => {
          // Dynamic simulated speed between 1.5 MB/s and 5.2 MB/s
          const dlSpeed = Math.floor(Math.random() * (4500000 - 1500000) + 1500000);
          const ulSpeed = Math.floor(Math.random() * (1200000 - 300000) + 300000);
          const dlSpeedMB = parseFloat((dlSpeed / (1024 * 1024)).toFixed(2));

          const existingHistory =
            prev.speedHistory && prev.speedHistory.length > 0
              ? prev.speedHistory
              : Array.from({ length: 30 }, (_, i) => ({ time: `-${30 - i}s`, speedMB: 0 }));

          const nextHistory = [
            ...existingHistory.slice(existingHistory.length >= 30 ? 1 : 0),
            {
              time: `${(prev.durationSeconds + 1) % 60}s`,
              speedMB: dlSpeedMB,
            },
          ];

          return {
            ...prev,
            durationSeconds: prev.durationSeconds + 1,
            downloadSpeedBytes: dlSpeed,
            uploadSpeedBytes: ulSpeed,
            totalDownloadBytes: prev.totalDownloadBytes + dlSpeed,
            totalUploadBytes: prev.totalUploadBytes + ulSpeed,
            currentPing: Math.max(12, selectedServer.pingMs + Math.floor(Math.random() * 5 - 2)),
            virtualIp: selectedServer.ip,
            speedHistory: nextHistory,
          };
        });
      }, 1000);
    } else {
      setStats((prev) => ({
        ...prev,
        downloadSpeedBytes: 0,
        uploadSpeedBytes: 0,
      }));
    }
    return () => clearInterval(interval);
  }, [status, selectedServer]);

  const handleAddCustomServer = (newServer: Server) => {
    setServers((prev) => [newServer, ...prev]);
    addLog('success', `تمت إضافة الخادم المخصص بنجاح: ${newServer.name}`);
  };

  const handleToggleProxy = () => {
    setProxyConfig((prev) => {
      const next = !prev.isEnabled;
      if (next) {
        addLog('success', `تم تفعيل مخدم الهوتسبوت SOCKS5 على المنفذ ${prev.socksPort} و HTTP ${prev.httpPort}`);
      } else {
        addLog('warn', 'تم تعطيل مخدم الهوتسبوت');
      }
      return {
        ...prev,
        isEnabled: next,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col items-center justify-start sm:py-3 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Mobile Phone Screen Frame Container (Strict Phone Viewport) */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[92vh] sm:rounded-[42px] sm:border-[8px] sm:border-slate-800/90 sm:shadow-2xl sm:shadow-black flex flex-col bg-[#090d16] overflow-hidden relative">
        {/* Simulated Mobile Phone Status Bar */}
        <div className="w-full bg-[#070b13] px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-900/60 select-none shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {status === 'connected' && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                VPN 🔑
              </span>
            )}
          </div>
          {/* Dynamic camera notch */}
          <div className="w-20 h-4 bg-slate-950 rounded-full border border-slate-800/80 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[10px] text-emerald-400 font-bold">5G+</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px]">100% 🔋</span>
          </div>
        </div>

        {/* Top Header inside phone frame */}
        <Header
          status={status}
          settings={settings}
          onOpenMenu={() => setIsSideMenuOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
        />

        <main className="flex-1 w-full px-3.5 sm:px-4 py-3.5 flex flex-col items-center overflow-y-auto">
          {/* Admin Broadcast Announcement Banner (If Enabled by Admin) */}
          {settings.announcement?.enabled && settings.announcement.text && (
            <div
              className={`w-full mb-3 p-3 rounded-2xl border text-xs flex items-center justify-between gap-2 shadow-lg ${
                settings.announcement.type === 'success'
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
                  : settings.announcement.type === 'warning'
                  ? 'bg-amber-950/70 border-amber-500/40 text-amber-200'
                  : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 shrink-0 animate-bounce" />
                <span className="font-medium">{settings.announcement.text}</span>
              </div>
              <button
                onClick={() => setSettings({ ...settings, announcement: { ...settings.announcement!, enabled: false } })}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Shortcuts Bar (Dedicated Moroccan *6 to *3 Converter, Gaming Mode, Admin Gate) */}
          <QuickShortcutsBar
            onQuickStar6ToStar3={handleQuickStar6ToStar3}
            onActivateGamingMode={handleActivateGamingMode}
            onOpenShareNet={() => setIsShareNetOpen(true)}
            onOpenTools={() => setIsToolsOpen(true)}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onInstallApp={handleInstallClick}
            activeCarrier={selectedTweak.carrier}
          />

          {/* PWA Phone Install Notification Banner */}
          <div className="w-full mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-[#0c1626] to-slate-900 border border-emerald-500/40 shadow-xl shadow-emerald-950/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <Smartphone className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>ثبّت التطبيق على شاشة هاتفك 📱</span>
                </h2>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  تثبيت مباشر بنقرة واحدة بلا تيرموكس
                </p>
              </div>
            </div>

            <button
              onClick={handleInstallClick}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'مثبت ✓' : 'تثبيت'}</span>
            </button>
          </div>

          {/* Main Dashboard Widget */}
          <TunnelDashboard
            status={status}
            server={selectedServer}
            tweak={selectedTweak}
            stats={stats}
            settings={settings}
            onToggleConnection={handleToggleConnection}
            onOpenServerList={() => setIsServerModalOpen(true)}
            onOpenPayloadEditor={() => setIsPayloadModalOpen(true)}
            onOpenShareNet={() => setIsShareNetOpen(true)}
            onOpenTools={() => setIsToolsOpen(true)}
          />

          {/* Moroccan Operators Compatibility Badges */}
          <div className="w-full mt-4 p-3 rounded-2xl bg-[#0c121e] border border-slate-800/80">
            <div className="flex items-center justify-between text-xs font-bold text-white mb-2">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>الشبكات المغربية المدعومة 🇲🇦</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">100% Anti-Throttle</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
                <span className="block font-bold">إنوي Inwi</span>
                <span className="text-slate-400 text-[9px]">*6 ➔ *3 تيك توك</span>
              </div>
              <div className="p-2 rounded-xl bg-orange-950/30 border border-orange-500/30 text-orange-200">
                <span className="block font-bold">أورنج Orange</span>
                <span className="text-slate-400 text-[9px]">*6 ➔ *3 Max-It</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200">
                <span className="block font-bold">اتصالات IAM</span>
                <span className="text-slate-400 text-[9px]">*6 ➔ *3 بينغ منخفض</span>
              </div>
            </div>
          </div>
        </main>

        {/* Mobile App Bottom Navigation Bar */}
        <div className="sticky bottom-0 z-20 w-full bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex items-center justify-around text-[10px]">
          <button
            onClick={() => {}}
            className="flex flex-col items-center gap-1 text-emerald-400 font-bold"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </button>
          <button
            onClick={() => setIsServerModalOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
          >
            <ServerIcon className="w-4 h-4" />
            <span>السيرفرات ({servers.length})</span>
          </button>
          <button
            onClick={() => setIsPayloadModalOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>بايلودات *6</span>
          </button>
          <button
            onClick={() => setIsToolsOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>فحص السرعة</span>
          </button>
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="flex flex-col items-center gap-1 text-amber-400 font-bold hover:text-amber-300"
          >
            <Lock className="w-4 h-4" />
            <span>خانة المطور 🔐</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-[#060910] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">{settings.appName}</span>
            <span>·</span>
            <span>الإصدار 2.5-PRO (مستوحى من ma.izone.max)</span>
          </div>
          <div>
            تشفير عالي الأمان بنواة V2Ray و SSH مع حماية الهوية والخصوصية
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ServerListModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        servers={servers}
        selectedServerId={selectedServer.id}
        onSelectServer={(srv) => {
          setSelectedServer(srv);
          addLog('info', `تم اختيار الخادم: ${srv.name}`);
        }}
        onAddCustomServer={handleAddCustomServer}
        language={settings.language}
      />

      <PayloadEditorModal
        isOpen={isPayloadModalOpen}
        onClose={() => setIsPayloadModalOpen(false)}
        currentTweak={selectedTweak}
        onSelectTweak={(twk) => {
          setSelectedTweak(twk);
          addLog('info', `تم تطبيق بايلود: ${twk.name} (SNI: ${twk.sniHost})`);
        }}
        language={settings.language}
      />

      <ShareNetModal
        isOpen={isShareNetOpen}
        onClose={() => setIsShareNetOpen(false)}
        proxyConfig={proxyConfig}
        onToggleProxy={handleToggleProxy}
        language={settings.language}
      />

      <NetworkToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        status={status}
        selectedDns={settings.selectedDns}
        onSelectDns={(dns) => {
          setSettings({ ...settings, selectedDns: dns });
          addLog('success', `تم تفعيل الـ DNS المشفر: ${dns}`);
        }}
        language={settings.language}
      />

      <LiveLogsConsole
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
        language={settings.language}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          addLog('success', 'تم حفظ وتطبيق إعدادات التطبيق بنجاح.');
        }}
        language={settings.language}
      />

      {/* Admin Control Panel Modal (Protected with Username & Password) */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        servers={servers}
        onUpdateServers={setServers}
        tweaks={tweaks}
        onUpdateTweaks={setTweaks}
        settings={settings}
        onUpdateSettings={setSettings}
        language={settings.language}
      />

      {/* 3-Line Hamburger Slide-in Drawer Menu */}
      <SideDrawerMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        status={status}
        settings={settings}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenShareNet={() => setIsShareNetOpen(true)}
        onOpenTools={() => setIsToolsOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenServers={() => setIsServerModalOpen(true)}
        onOpenPayloads={() => setIsPayloadModalOpen(true)}
        onInstallApp={handleInstallClick}
        onLanguageChange={(lang: Language) => setSettings({ ...settings, language: lang })}
      />

      {/* PWA Direct Installation Guide Modal */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0e1526] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl text-white">
            <button
              onClick={() => setIsInstallModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">طريقة تثبيت Elbouayachi VPN على الهاتف</h3>
                <p className="text-xs text-slate-400">بدون الحاجة إلى Termux أو أوامر معقدة</p>
              </div>
            </div>

            <div className="space-y-3 my-5">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-white">افتح متصفح Google Chrome على التيليفون</p>
                  <p className="text-slate-400 mt-0.5">تأكد أنك فاتح هذا الرابط فمتصفح Chrome مباشرة.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-white">اضغط على 3 النقط الفوق في الزاوية (⋮)</p>
                  <p className="text-slate-400 mt-0.5">قائمة متصفح Google Chrome أعلى الشاشة.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-emerald-300">
                    اضغط على "Installer l'application" أو "Ajouter à l'écran d'accueil"
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    غادي تخرجلك نافذة تأكيد صغيرة، اضغط على <b>Installer / إضافة</b>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                  4
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-white">مبروك! 🎉 التطبيق أصبح مثبتاً على هاتفك</p>
                  <p className="text-slate-400 mt-0.5">
                    ستجد أيقونة التطبيق باسم <b>Elbouayachi VPN</b> في الشاشة الرئيسية لهاتفك وتعمل بكامل الصلاحيات!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>جرّب التثبيت المباشر الآن</span>
              </button>
              <button
                onClick={() => setIsInstallModalOpen(false)}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
