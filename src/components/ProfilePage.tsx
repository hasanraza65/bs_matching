import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Baby, 
  Clock, 
  Euro, 
  Calendar, 
  CalendarDays,
  FileText, 
  Download, 
  ChevronRight, 
  CheckCircle2, 
  Clock3,
  Receipt,
  Award,
  ArrowLeft,
  User as UserIcon,
  Trash2,
  LogOut,
  Loader2,
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { api, User } from '../services/api';

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
  onModifyRequest: (request: any) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onLogout, onModifyRequest }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'requests' | 'invoices' | 'tax'>('requests');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.getUser();
        if (response.status && response.data) {
          setUser(response.data);
        } else {
          // If token is invalid or expired, logout
          onLogout();
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [onLogout]);

  const handleLogout = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      onConfirm: async () => {
        try {
          await api.logout();
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          onLogout();
        }
      }
    });
  };

  const handleRemoveRequest = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Request',
      message: 'Are you sure you want to remove this request?',
      onConfirm: () => {
        if (user) {
          setUser({
            ...user,
            parent_requests: user.parent_requests?.filter(req => req.id.toString() !== id)
          });
        }
      }
    });
  };

  const invoices = [
    { id: "INV-2024-001", date: "2024-02-01", amount: 150.00 },
    { id: "INV-2024-002", date: "2024-01-01", amount: 120.00 }
  ];

  const taxCertificates = [
    { year: 2023, type: "Annual Tax Certificate", date: "2024-01-15" }
  ];

  const tabs = [
    { id: 'requests', label: t.profilePage.tabs.requests, icon: Baby },
    { id: 'invoices', label: t.profilePage.tabs.invoices, icon: Receipt },
    { id: 'tax', label: t.profilePage.tabs.tax, icon: FileText },
  ];

  const calculateTotalHours = (schedules?: any[]) => {
    if (!schedules) return 0;
    let totalMinutes = 0;
    schedules.forEach(schedule => {
      schedule.slots?.forEach((slot: any) => {
        const [startH, startM] = slot.start_time.split(':').map(Number);
        const [endH, endM] = slot.end_time.split(':').map(Number);
        totalMinutes += (endH * 60 + endM) - (startH * 60 + startM);
      });
    });
    return totalMinutes / 60;
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-brand-accent animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* Creative Header */}
      <div className="relative mb-16">
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-accent transition-all group"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:text-white transition-all">
                  <ArrowLeft size={14} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{t.common.back}</span>
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all group"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-red-500 group-hover:bg-red-50 transition-all">
                  <LogOut size={14} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Logout</span>
              </button>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-slate-900 tracking-tight">
              {t.profilePage.title.split(' ')[0]}
              <span className="text-brand-accent">.</span>
              <span className="block text-2xl md:text-3xl text-slate-400 font-medium mt-1">{t.profilePage.subtitle}</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-2 pr-6 rounded-[32px] border border-white shadow-xl shadow-slate-200/50">
            <div className="w-16 h-16 bg-brand-accent rounded-[24px] flex items-center justify-center text-white shadow-lg shadow-brand-accent/30">
              <UserIcon size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-0.5">Premium Account</p>
              <p className="text-xl font-display font-bold text-slate-800">{user?.first_name} {user?.last_name}</p>
              {user?.children && user.children.length > 0 && (
                <p className="text-[10px] text-slate-400 font-medium">
                  {user.children.length} {user.children.length > 1 ? t.common.children : t.common.child}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Children Section */}
      {user?.children && user.children.length > 0 && (
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {user.children.map((child, idx) => (
            <div key={child.id || idx} className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                <Baby size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Child {idx + 1}</p>
                <p className="text-sm font-bold text-slate-800">{child.child_dob}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Minimal Inline Tab Navigation */}
      <div className="relative mb-12 border-b border-slate-100">
        <style dangerouslySetInnerHTML={{ __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        ` }} />
        <div className="flex items-center overflow-x-auto no-scrollbar gap-8 scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 transition-all relative whitespace-nowrap group ${
                  isActive ? 'text-brand-accent' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-brand-accent' : 'text-slate-400 group-hover:text-slate-500'} />
                <span className="text-sm font-bold tracking-tight">{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-accent rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'requests' && (
              <div className="space-y-6">
                {user?.parent_requests && user.parent_requests.length > 0 ? (
                  user.parent_requests.map((req) => (
                    <div key={req.id} className="group bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="space-y-8 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-accent group-hover:text-white transition-colors">
                                <Baby size={20} />
                              </div>
                              <span className="text-sm font-bold text-slate-900 tracking-tight">REQ-{req.id}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-accent/5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                                <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                                  {req.status || t.profilePage.requests.pending}
                                </span>
                              </div>
                              <button 
                                onClick={() => handleRemoveRequest(req.id.toString())}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                title="Remove Request"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                          
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.profilePage.requests.children}</p>
                                <div className="flex items-baseline gap-1">
                                  <p className="text-3xl font-display font-bold text-slate-900">{req.children?.length || 0}</p>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Kids</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.profilePage.requests.hours}</p>
                                <div className="flex items-baseline gap-1">
                                  <p className="text-3xl font-display font-bold text-slate-900">{calculateTotalHours(req.schedules)}</p>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hrs</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t.profilePage.requests.amount}</p>
                                <p className="text-3xl font-display font-bold text-brand-accent">€{(calculateTotalHours(req.schedules) * 28.50).toFixed(2)}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Schedules</p>
                                <div className="flex items-baseline gap-1">
                                  <p className="text-3xl font-display font-bold text-slate-900">{req.schedules?.length || 0}</p>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">Days</span>
                                </div>
                              </div>
                            </div>

                            {/* Detailed Schedule Summary */}
                            {req.schedules && req.schedules.length > 0 && (
                              <div className="mt-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                <div className="flex items-center gap-2 mb-3">
                                  <CalendarDays size={14} className="text-brand-accent" />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Booking Calendar</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                  {req.schedules.map((s: any) => (
                                    <div key={s.id} className="px-3 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col gap-1 min-w-[100px]">
                                      <span className="text-[10px] font-bold text-slate-900">{s.schedule_date}</span>
                                      <div className="flex flex-col gap-0.5">
                                        {s.slots?.map((slot: any) => (
                                          <span key={slot.id} className="text-[9px] text-slate-400 font-medium">
                                            {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Choices / Interviews Section */}
                            {req.choices && req.choices.length > 0 && (
                              <div className="mt-8 pt-8 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                  <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Babysitter Interviews</p>
                                    <p className="text-xs text-slate-500">Your selected candidates and scheduled meetings</p>
                                  </div>
                                  <div className="px-3 py-1 bg-brand-blue/10 rounded-full">
                                    <span className="text-[9px] font-bold text-brand-blue uppercase tracking-wider">{req.choices.length} Candidates</span>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {req.choices.map((choice: any) => (
                                    <div key={choice.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group/choice relative overflow-hidden">
                                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover/choice:bg-brand-accent/10 transition-colors" />
                                      
                                      <div className="relative flex items-start gap-4">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-accent group-hover/choice:bg-brand-accent group-hover/choice:text-white transition-all duration-500 shadow-inner">
                                          <UserIcon size={24} />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                          <div>
                                            <p className="text-base font-display font-bold text-slate-900">{choice.babysitter_first_name} {choice.babysitter_last_name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <div className="px-2 py-0.5 bg-brand-blue/5 rounded-md flex items-center gap-1.5">
                                                <Clock size={10} className="text-brand-blue" />
                                                <span className="text-[9px] font-bold text-brand-blue uppercase tracking-wider">
                                                  {choice.interview_date} @ {choice.interview_time?.substring(0, 5)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          <div className="grid grid-cols-1 gap-2">
                                            {choice.babysitter_phone && (
                                              <div className="flex items-center gap-2 text-slate-400">
                                                <Phone size={12} />
                                                <span className="text-[10px] font-medium">{choice.babysitter_phone}</span>
                                              </div>
                                            )}
                                            {choice.babysitter_email && (
                                              <div className="flex items-center gap-2 text-slate-400">
                                                <Mail size={12} />
                                                <span className="text-[10px] font-medium truncate max-w-[150px]">{choice.babysitter_email}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:border-l border-slate-100 lg:pl-10 min-w-[200px]">
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{t.profilePage.requests.date}</p>
                            <p className="text-lg font-display font-bold text-slate-700">{req.created_at?.split('T')[0] || '--'}</p>
                          </div>
                          <button 
                            onClick={() => onModifyRequest(req)}
                            className="flex-1 px-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-brand-accent transition-all shadow-lg shadow-slate-900/10 hover:shadow-brand-accent/20 flex items-center justify-center gap-2"
                          >
                            {t.common.modify} <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-32 bg-white rounded-[48px] border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                      <Baby size={40} />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">{t.profilePage.requests.noRequests}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-bottom border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.profilePage.invoices.number}</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.profilePage.invoices.date}</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.profilePage.invoices.amount}</th>
                      <th className="px-6 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {invoices.length > 0 ? (
                      invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700 text-sm">{inv.id}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{inv.date}</td>
                          <td className="px-6 py-4 font-bold text-slate-800 text-sm">€{inv.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-brand-accent hover:bg-brand-accent/10 rounded-xl transition-colors inline-flex items-center gap-2 text-xs font-bold">
                              <Download size={14} />
                              <span className="hidden sm:inline">{t.profilePage.invoices.download}</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <Receipt size={48} className="mx-auto text-slate-200 mb-4" />
                          <p className="text-slate-400 font-medium">{t.profilePage.invoices.noInvoices}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'tax' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {taxCertificates.length > 0 ? (
                  taxCertificates.map((cert, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-brand-accent/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-brand-pink">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{cert.type}</p>
                          <p className="text-xs text-slate-400">{t.profilePage.tax.year} {cert.year}</p>
                        </div>
                      </div>
                      <button className="p-3 bg-slate-50 text-slate-400 group-hover:bg-brand-accent group-hover:text-white rounded-2xl transition-all">
                        <Download size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200">
                    <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-medium">{t.profilePage.tax.noCertificates}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Support Banner */}
      <div className="mt-12 bg-brand-blue/10 rounded-[32px] p-8 border border-brand-blue/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="font-bold text-slate-800">Need help with your documents?</p>
            <p className="text-sm text-slate-500">Our support team is available 24/7 to assist you.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-brand-blue text-white font-bold rounded-2xl hover:bg-brand-blue/90 transition-colors shadow-lg shadow-brand-blue/20">
          Contact Support
        </button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                    <AlertCircle size={24} />
                  </div>
                  <button 
                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-800 mb-2">{confirmModal.title}</h3>
                <p className="text-slate-500 mb-8">{confirmModal.message}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      confirmModal.onConfirm();
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }}
                    className="flex-1 px-6 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
