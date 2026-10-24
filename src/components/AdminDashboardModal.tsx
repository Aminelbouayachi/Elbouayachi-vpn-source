import React, { useState } from 'react';
import {
  Server,
  CarrierTweak,
  AppSettings,
  CarrierType,
  ProtocolType,
  Language,
} from '../types';
import {
  Sliders,
  Server as ServerIcon,
  Zap,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Users,
  Activity,
  HardDrive,
  Globe,
  Radio,
  Save,
  AlertCircle,
  HelpCircle,
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: Server[];
  onUpdateServers: (servers: Server[]) => void;
  tweaks: CarrierTweak[];
  onUpdateTweaks: (tweaks: CarrierTweak[]) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  language: Language;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  servers,
  onUpdateServers,
  tweaks,
  onUpdateTweaks,
  settings,
  onUpdateSettings,
}) => {
  // Developer Credentials (Private & Secure)
  const MASTER_USERNAME = 'Aminelbouayachi';
  const MASTER_PASSWORD = '10881226aA@';

  const [adminCreds, setAdminCreds] = useState(() => {
    const saved = localStorage.getItem('elbouayachi_admin_creds');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.username && parsed.password) {
          return parsed;
        }
      } catch (e) {}
    }
    return { username: MASTER_USERNAME, password: MASTER_PASSWORD };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('elbouayachi_admin_auth') === 'true';
  });

  // Login inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'tweaks' | 'broadcast' | 'security' | 'backup'>('overview');

  // Change credentials form
  const [newUsername, setNewUsername] = useState(adminCreds.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Server Form State
  const [isAddingServer, setIsAddingServer] = useState(false);
  const [editingServerId, setEditingServerId] = useState<string | null>(null);
  const [serverFormData, setServerFormData] = useState({
    name: '',
    country: 'المغرب',
    countryCode: 'MA',
    city: 'الدار البيضاء',
    flag: '🇲🇦',
    carrier: 'inwi' as CarrierType,
    protocol: 'vmess' as ProtocolType,
    ip: '',
    pingMs: 14,
    loadPercent: 28,
    isVip: false,
    isRecommended: true,
  });

  // Tweak Form State
  const [isAddingTweak, setIsAddingTweak] = useState(false);
  const [editingTweakId, setEditingTweakId] = useState<string | null>(null);
  const [tweakFormData, setTweakFormData] = useState({
    name: '',
    carrier: 'inwi' as CarrierType,
    carrierLabel: 'إنوي (Inwi)',
    sniHost: '',
    bugHost: '',
    port: 443,
    protocol: 'vmess' as ProtocolType,
    description: '',
    speedRating: '5/5',
    payload: 'GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]',
  });

  // Broadcast state
  const [announcementText, setAnnouncementText] = useState(
    settings.announcement?.text || '🔥 تم إضافة سيرفرات وسرعات جديدة فائقة الأداء!'
  );
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    settings.announcement?.enabled ?? true
  );
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success'>(
    settings.announcement?.type || 'success'
  );

  // Status toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  // Handle Login Submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const enteredUser = loginUsername.trim().toLowerCase();
    const isUserValid =
      enteredUser === adminCreds.username.trim().toLowerCase() ||
      enteredUser === MASTER_USERNAME.toLowerCase();
    const isPassValid =
      loginPassword === adminCreds.password ||
      loginPassword === MASTER_PASSWORD;

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      sessionStorage.setItem('elbouayachi_admin_auth', 'true');
      setLoginPassword('');
      showToast('تم تسجيل الدخول بنجاح! مرحباً بك في خانة المطور 🚀');
    } else {
      setLoginError('اسم المستخدم أو كلمة المرور غير صحيحة! الوصول مرفوض.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('elbouayachi_admin_auth');
    showToast('تم تسجيل الخروج بنجاح.');
  };

  // Handle Changing Credentials
  const handleChangeCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      showToast('اسم المستخدم مطلوب.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showToast('كلمة المرور وتأكيد كلمة المرور غير متطابقين!');
      return;
    }

    const updated = {
      username: newUsername.trim(),
      password: newPassword ? newPassword : adminCreds.password,
    };

    setAdminCreds(updated);
    localStorage.setItem('elbouayachi_admin_creds', JSON.stringify(updated));
    setNewPassword('');
    setConfirmPassword('');
    showToast('تم تحديث بيانات تسجيل الدخول بنجاح! 🔒');
  };

  // Save or Update Server
  const handleSaveServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverFormData.name.trim() || !serverFormData.ip.trim()) {
      showToast('يرجى ملء اسم الخادم وعنوان الـ IP أو النطاق.');
      return;
    }

    if (editingServerId) {
      const updated = servers.map((srv) => {
        if (srv.id === editingServerId) {
          return {
            ...srv,
            ...serverFormData,
            features: [serverFormData.protocol.toUpperCase(), 'Zero-Log', 'Anti-DDoS'],
          };
        }
        return srv;
      });
      onUpdateServers(updated);
      showToast('تم تحديث بيانات الخادم بنجاح! ✓');
    } else {
      const newServer: Server = {
        id: `srv-${Date.now()}`,
        ...serverFormData,
        features: [serverFormData.protocol.toUpperCase(), 'Zero-Log', 'Anti-DDoS'],
      };
      onUpdateServers([newServer, ...servers]);
      showToast('تمت إضافة الخادم الجديد بنجاح! 🚀');
    }

    setIsAddingServer(false);
    setEditingServerId(null);
    setServerFormData({
      name: '',
      country: 'المغرب',
      countryCode: 'MA',
      city: 'الدار البيضاء',
      flag: '🇲🇦',
      carrier: 'inwi',
      protocol: 'vmess',
      ip: '',
      pingMs: 14,
      loadPercent: 28,
      isVip: false,
      isRecommended: true,
    });
  };

  const handleEditServer = (srv: Server) => {
    setEditingServerId(srv.id);
    setServerFormData({
      name: srv.name,
      country: srv.country,
      countryCode: srv.countryCode,
      city: srv.city,
      flag: srv.flag,
      carrier: srv.carrier,
      protocol: srv.protocol,
      ip: srv.ip,
      pingMs: srv.pingMs,
      loadPercent: srv.loadPercent,
      isVip: !!srv.isVip,
      isRecommended: !!srv.isRecommended,
    });
    setIsAddingServer(true);
  };

  const handleDeleteServer = (id: string) => {
    if (servers.length <= 1) {
      showToast('لا يمكن حذف جميع الخوادم. يجب ترك خادم واحد على الأقل.');
      return;
    }
    const filtered = servers.filter((s) => s.id !== id);
    onUpdateServers(filtered);
    showToast('تم حذف الخادم بنجاح.');
  };

  // Save or Update Tweak
  const handleSaveTweak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tweakFormData.name.trim() || !tweakFormData.sniHost.trim()) {
      showToast('يرجى ملء اسم البايلود وعنوان الـ SNI / Host.');
      return;
    }

    const carrierLabels: Record<CarrierType, string> = {
      inwi: 'إنوي (Inwi)',
      orange: 'أورنج (Orange)',
      iam: 'اتصالات المغرب (IAM)',
      global: 'شامل دولي (Global)',
    };

    if (editingTweakId) {
      const updated = tweaks.map((twk) => {
        if (twk.id === editingTweakId) {
          return {
            ...twk,
            ...tweakFormData,
            carrierLabel: carrierLabels[tweakFormData.carrier],
          };
        }
        return twk;
      });
      onUpdateTweaks(updated);
      showToast('تم تحديث البايلود بنجاح! ✓');
    } else {
      const newTweak: CarrierTweak = {
        id: `twk-${Date.now()}`,
        ...tweakFormData,
        carrierLabel: carrierLabels[tweakFormData.carrier],
      };
      onUpdateTweaks([newTweak, ...tweaks]);
      showToast('تمت إضافة البايلود الجديد بنجاح! 🚀');
    }

    setIsAddingTweak(false);
    setEditingTweakId(null);
  };

  const handleEditTweak = (twk: CarrierTweak) => {
    setEditingTweakId(twk.id);
    setTweakFormData({
      name: twk.name,
      carrier: twk.carrier,
      carrierLabel: twk.carrierLabel,
      sniHost: twk.sniHost,
      bugHost: twk.bugHost || twk.sniHost,
      port: twk.port,
      protocol: twk.protocol,
      description: twk.description,
      speedRating: twk.speedRating,
      payload: twk.payload,
    });
    setIsAddingTweak(true);
  };

  const handleDeleteTweak = (id: string) => {
    if (tweaks.length <= 1) {
      showToast('لا يمكن حذف جميع البايلودات.');
      return;
    }
    onUpdateTweaks(tweaks.filter((t) => t.id !== id));
    showToast('تم حذف البايلود بنجاح.');
  };

  // Save announcement
  const handleSaveAnnouncement = () => {
    onUpdateSettings({
      ...settings,
      announcement: {
        enabled: announcementEnabled,
        text: announcementText,
        type: announcementType,
      },
    });
    showToast('تم نشر التنبيه للمستخدمين بنجاح! 📢');
  };

  // Export JSON Config
  const handleExportConfig = () => {
    const data = {
      appName: settings.appName,
      exportedAt: new Date().toISOString(),
      servers,
      tweaks,
      announcement: {
        enabled: announcementEnabled,
        text: announcementText,
        type: announcementType,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elbouayachi-vpn-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف الإعدادات كاملاً بنجاح! 💾');
  };

  // Import JSON Config
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.servers && Array.isArray(parsed.servers)) {
          onUpdateServers(parsed.servers);
        }
        if (parsed.tweaks && Array.isArray(parsed.tweaks)) {
          onUpdateTweaks(parsed.tweaks);
        }
        if (parsed.announcement) {
          onUpdateSettings({
            ...settings,
            announcement: parsed.announcement,
          });
          setAnnouncementText(parsed.announcement.text);
          setAnnouncementEnabled(parsed.announcement.enabled);
        }
        showToast('تم استيراد الإعدادات وتحديث السيرفرات بنجاح! 🎉');
      } catch (err) {
        showToast('خطأ: الملف غير صالح، تأكد من اختيار ملف JSON صحيح.');
      }
    };
    reader.readAsText(file);
  };

  // ==========================================
  // VIEW 1: LOGIN GATE IF NOT AUTHENTICATED
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
        <div className="relative w-full max-w-md bg-[#0e1526] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Login Shield Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[1.5px] shadow-xl shadow-amber-500/20 mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b101c] rounded-[14px] flex items-center justify-center text-amber-400">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">خانة المطور (Developer Dashboard)</h3>
            <p className="text-xs text-slate-400 mt-1">
              منطقة سرية ومحمية بكلمة المرور خاصة بمدير ومطور التطبيق
            </p>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم المستخدم (Username)
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="اسم المستخدم..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                كلمة المرور (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-amber-500 font-mono pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all mt-2"
            >
              <Key className="w-4 h-4" />
              <span>تسجيل الدخول إلى خانة المطور</span>
            </button>
          </form>

          {/* Confidentiality & Security Notice (Zero credentials revealed) */}
          <div className="mt-6 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              منطقة حساسة مشفرة. تسجيل الدخول مقتصر على المطور المصرح له فقط.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FULL MASTER ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b111c] border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Header Bar with Logout */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#070b13] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#0b111c] rounded-[10px] flex items-center justify-center text-amber-400">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">لوحة تحكم المشرف (Admin Control)</h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  {adminCreds.username.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                التحكم الكامل في سيرفرات {settings.appName}، البايلودات، وشريط التنبيهات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-300 font-medium flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#090d16] px-4 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>نظرة عامة</span>
          </button>

          <button
            onClick={() => setActiveTab('servers')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'servers'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ServerIcon className="w-4 h-4" />
            <span>إدارة السيرفرات ({servers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tweaks')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'tweaks'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>البايلودات ({tweaks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'broadcast'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>شريط التنبيهات</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'security'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>الأمان وكلمة المرور</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 py-3 px-3.5 border-b-2 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>النسخ الاحتياطي</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs">السيرفرات النشطة</span>
                    <ServerIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{servers.length}</div>
                  <span className="text-[10px] text-emerald-400 mt-1 inline-block">100% متصلة بالإنترنت</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs">البايلودات الفعالة</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{tweaks.length}</div>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">Inwi, Orange, IAM</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs">المستخدمين النشطين</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1,842</div>
                  <span className="text-[10px] text-cyan-400 mt-1 inline-block">جلسات اتصال حية</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs">البيانات المنقولة اليوم</span>
                    <HardDrive className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">9.4 TB</div>
                  <span className="text-[10px] text-purple-400 mt-1 inline-block">عبر أنفاق V2Ray و SSH</span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">إضافة سريعة وتحديث فوري</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    أي تعديل أو إضافة لسيرفر يظهر فوراً في واجهة التطبيق لجميع المستخدمين.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setActiveTab('servers');
                      setIsAddingServer(true);
                      setEditingServerId(null);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة سيرفر جديد</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('tweaks');
                      setIsAddingTweak(true);
                      setEditingTweakId(null);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة بايلود</span>
                  </button>
                </div>
              </div>

              {/* Server Nodes Quick Status */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  عينة من السيرفرات النشطة
                </h4>
                <div className="space-y-2">
                  {servers.slice(0, 4).map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{srv.flag}</span>
                        <div>
                          <p className="text-xs font-bold text-white">{srv.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {srv.city} · {srv.ip} · {srv.protocol.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-emerald-400">{srv.pingMs}ms</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SERVERS MANAGEMENT */}
          {activeTab === 'servers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">قائمة سيرفرات التطبيق</h3>
                  <p className="text-xs text-slate-400">يمكنك إضافة، تعديل، أو حذف أي سيرفر يظهر للمستخدمين</p>
                </div>
                {!isAddingServer && (
                  <button
                    onClick={() => {
                      setIsAddingServer(true);
                      setEditingServerId(null);
                      setServerFormData({
                        name: '',
                        country: 'المغرب',
                        countryCode: 'MA',
                        city: 'الدار البيضاء',
                        flag: '🇲🇦',
                        carrier: 'inwi',
                        protocol: 'vmess',
                        ip: '',
                        pingMs: 14,
                        loadPercent: 28,
                        isVip: false,
                        isRecommended: true,
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة سيرفر جديد</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Server Form */}
              {isAddingServer && (
                <form
                  onSubmit={handleSaveServer}
                  className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <ServerIcon className="w-4 h-4" />
                      <span>{editingServerId ? 'تعديل بيانات السيرفر' : 'إضافة سيرفر جديد'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingServer(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">اسم السيرفر</label>
                      <input
                        type="text"
                        value={serverFormData.name}
                        onChange={(e) => setServerFormData({ ...serverFormData, name: e.target.value })}
                        placeholder="مثال: 🇲🇦 إنوي VIP كازابلانكا 02"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان IP أو النطاق (Host)</label>
                      <input
                        type="text"
                        value={serverFormData.ip}
                        onChange={(e) => setServerFormData({ ...serverFormData, ip: e.target.value })}
                        placeholder="مثال: 196.200.160.25 أو vpn.elbouayachi.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">الشبكة المتوافقة</label>
                      <select
                        value={serverFormData.carrier}
                        onChange={(e) => setServerFormData({ ...serverFormData, carrier: e.target.value as CarrierType })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="inwi">إنوي (Inwi 4G / 5G)</option>
                        <option value="orange">أورنج (Orange Maroc)</option>
                        <option value="iam">اتصالات المغرب (IAM)</option>
                        <option value="global">شامل (Global / All Carriers)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">بروتوكول النفق</label>
                      <select
                        value={serverFormData.protocol}
                        onChange={(e) => setServerFormData({ ...serverFormData, protocol: e.target.value as ProtocolType })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 uppercase font-mono"
                      >
                        <option value="vmess">VMESS (V2Ray WS)</option>
                        <option value="vless">VLESS (XTLS / Reality)</option>
                        <option value="trojan">TROJAN (gRPC / TLS)</option>
                        <option value="ssh">SSH Custom Direct</option>
                        <option value="v2ray">V2Ray-Core Generic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">المدينة والدولة</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={serverFormData.city}
                          onChange={(e) => setServerFormData({ ...serverFormData, city: e.target.value })}
                          placeholder="الدار البيضاء"
                          className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={serverFormData.flag}
                          onChange={(e) => setServerFormData({ ...serverFormData, flag: e.target.value })}
                          placeholder="العلم 🇲🇦"
                          className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">سرعة الاستجابة المقدرة (Ping ms)</label>
                      <input
                        type="number"
                        value={serverFormData.pingMs}
                        onChange={(e) => setServerFormData({ ...serverFormData, pingMs: Number(e.target.value) })}
                        placeholder="14"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={serverFormData.isVip}
                        onChange={(e) => setServerFormData({ ...serverFormData, isVip: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>خادم VIP فائق السرعة</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={serverFormData.isRecommended}
                        onChange={(e) => setServerFormData({ ...serverFormData, isRecommended: e.target.checked })}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <span>سيرفر موصى به (Recommended)</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingServer(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingServerId ? 'حفظ التعديلات' : 'إضافة الخادم الآن'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Servers Table / Cards List */}
              <div className="space-y-2">
                {servers.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{srv.flag}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white">{srv.name}</h4>
                          {srv.isVip && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              VIP
                            </span>
                          )}
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            {srv.protocol}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {srv.city} · Host: <span className="font-mono text-slate-300">{srv.ip}</span> · Ping:{' '}
                          <span className="text-emerald-400 font-mono">{srv.pingMs}ms</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleEditServer(srv)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="تعديل السيرفر"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteServer(srv.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="حذف السيرفر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TWEAKS MANAGEMENT */}
          {activeTab === 'tweaks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">إدارة بايلودات الشبكات المغربية (Tweaks & Payloads)</h3>
                  <p className="text-xs text-slate-400">تعديل الـ SNI و Bug Hosts لتخطي خنق البيانات</p>
                </div>
                {!isAddingTweak && (
                  <button
                    onClick={() => {
                      setIsAddingTweak(true);
                      setEditingTweakId(null);
                      setTweakFormData({
                        name: '',
                        carrier: 'inwi',
                        carrierLabel: 'إنوي (Inwi)',
                        sniHost: '',
                        bugHost: '',
                        port: 443,
                        protocol: 'vmess',
                        description: '',
                        speedRating: '5/5',
                        payload: 'GET / HTTP/1.1[crlf]Host: [host][crlf]Upgrade: websocket[crlf][crlf]',
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة بايلود جديد</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Tweak Form */}
              {isAddingTweak && (
                <form
                  onSubmit={handleSaveTweak}
                  className="p-5 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span>{editingTweakId ? 'تعديل البايلود' : 'إضافة بايلود جديد'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsAddingTweak(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">اسم البايلود</label>
                      <input
                        type="text"
                        value={tweakFormData.name}
                        onChange={(e) => setTweakFormData({ ...tweakFormData, name: e.target.value })}
                        placeholder="مثال: إنوي *6 شات غير محدود"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">الشبكة</label>
                      <select
                        value={tweakFormData.carrier}
                        onChange={(e) => setTweakFormData({ ...tweakFormData, carrier: e.target.value as CarrierType })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                      >
                        <option value="inwi">إنوي (Inwi)</option>
                        <option value="orange">أورنج (Orange)</option>
                        <option value="iam">اتصالات المغرب (IAM)</option>
                        <option value="global">شامل (Global)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">SNI / Bug Host</label>
                      <input
                        type="text"
                        value={tweakFormData.sniHost}
                        onChange={(e) => setTweakFormData({ ...tweakFormData, sniHost: e.target.value })}
                        placeholder="مثال: web.whatsapp.com أو m.facebook.com"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">المنفذ (Port)</label>
                      <input
                        type="number"
                        value={tweakFormData.port}
                        onChange={(e) => setTweakFormData({ ...tweakFormData, port: Number(e.target.value) })}
                        placeholder="443"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Payload Template (Headers)</label>
                    <textarea
                      value={tweakFormData.payload}
                      onChange={(e) => setTweakFormData({ ...tweakFormData, payload: e.target.value })}
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingTweak(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingTweakId ? 'حفظ البايلود' : 'إضافة البايلود'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tweaks List */}
              <div className="space-y-2">
                {tweaks.map((twk) => (
                  <div
                    key={twk.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <h4 className="text-xs sm:text-sm font-bold text-white">{twk.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {twk.carrierLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">
                        SNI: <span className="text-emerald-400">{twk.sniHost}</span> · Port: {twk.port}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTweak(twk)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="تعديل البايلود"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTweak(twk.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="حذف البايلود"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST & ANNOUNCEMENTS */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span>شريط إعلانات وتنبيهات المستخدمين</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      رسالة تظهر في أعلى واجهة التطبيق لجميع المستخدمين
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementEnabled}
                      onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-xs font-semibold text-slate-300">تفعيل الشريط في التطبيق</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">نص التنبيه أو الإعلان</label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="مثال: 🔥 تم إضافة سيرفر كازابلانكا 03 فائق السرعة لشبكة إنوي وأورنج!"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">نوع التنبيه</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setAnnouncementType('success')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        announcementType === 'success'
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>إيجابي (أخضر)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnouncementType('warning')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        announcementType === 'warning'
                          ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>تنبيه / صيانة (أصفر)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnnouncementType('info')}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                        announcementType === 'info'
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>معلومات (أزرق)</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-[11px] text-slate-400 mb-1.5">معاينة حية كما ستظهر للمستخدم:</span>
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      announcementType === 'success'
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : announcementType === 'warning'
                        ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                        : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    <Bell className="w-4 h-4 shrink-0" />
                    <span>{announcementText || 'لا يوجد نص'}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSaveAnnouncement}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>نشر التنبيه للمستخدمين</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & CREDENTIALS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <form
                onSubmit={handleChangeCreds}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4"
              >
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>تغيير اسم المستخدم وكلمة المرور للوحة الإدارة</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    قم بتغيير بيانات الدخول لحماية لوحة التحكم ومنع أي شخص آخر من تعديل السيرفرات
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      اسم المستخدم الجديد (New Username)
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      كلمة المرور الجديدة (اتركها فارغة إذا لم ترد تغييرها)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="كلمة مرور جديدة..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {newPassword && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        تأكيد كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="أعد كتابة كلمة المرور..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-800">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ بيانات الدخول الجديدة</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: BACKUP & EXPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">تصدير إعدادات السيرفرات (Export JSON)</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      حفظ نسخة كاملة من جميع السيرفرات، البايلودات، والتنبيهات في ملف JSON يمكنك مشاركته أو حفظه.
                    </p>
                  </div>
                  <button
                    onClick={handleExportConfig}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
                  >
                    <Download className="w-4 h-4" />
                    <span>تصدير ملف الإعدادات (JSON)</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">استيراد إعدادات جديدة (Import JSON)</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      تحميل ملف إعدادات جديد لتحديث جميع السيرفرات والبايلودات دفعة واحدة في لحظة واحدة.
                    </p>
                  </div>
                  <label className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>اختيار ملف JSON للاستيراد</span>
                    <input type="file" accept=".json" onChange={handleImportConfig} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
