import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api, User } from '../services/api';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-hot-toast';


import {
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Receipt,
  FileText,
  Users,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Download,
  Filter,
  TrendingUp,
  Eye,
  Trash2,
  Edit2,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Baby,
  User as UserIcon,
  Shield,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Loader2,
  History,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CreditCard,
  DollarSign,
  Briefcase,
  Plus,
  Link as LinkIcon,
  Video
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { KanbanBoard, RequestDetailsModal, transformToKanbanRequest, KanbanRequest } from './KanbanBoard';
import { AddNewActiveRequestModal } from './AddNewActiveRequestModal';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminPage = 'dashboard' | 'new-requests' | 'completed-requests' | 'ongoing-requests' | 'requests' | 'active-requests' | 'signed-contracts' | 'interviews' | 'invoices' | 'contracts' | 'attestations' | 'users';


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [viewingChoiceId, setViewingChoiceId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'All Requests', icon: ClipboardList },
    { id: 'new-requests', label: 'New Request', icon: Plus },
    { id: 'active-requests', label: 'Active Requests', icon: Activity },
    { id: 'ongoing-requests', label: 'Ongoing Requests', icon: Clock },
    { id: 'completed-requests', label: 'Completed Request', icon: CheckCircle2 },
    { id: 'signed-contracts', label: 'Signed Contract', icon: ShieldCheck },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'attestations', label: 'Attestations Fiscales', icon: History },
    { id: 'users', label: 'All Users', icon: Users },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                <Shield size={24} />
              </div>
              {isSidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl font-bold tracking-tight whitespace-nowrap"
                >
                  AdminPanel
                </motion.span>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as AdminPage)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'} />
                  {isSidebarOpen && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {!isSidebarOpen && isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-900 rounded-r-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-100">
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all group ${!isSidebarOpen && 'justify-center'}`}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Top Header Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-slate-900 capitalize hidden sm:block">
              {viewingUserId ? 'User Details' : viewingChoiceId ? 'Contract Details' : activePage.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-slate-200 rounded-xl text-sm outline-none transition-all w-64"
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              <div className="h-8 w-px bg-slate-200 mx-1" />

              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900">Admin User</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Super Admin</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                  AD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activePage === 'dashboard' && <DashboardView />}
              {activePage === 'new-requests' && <NewRequestsView />}
              {activePage === 'completed-requests' && <CompletedRequestsView />}
              {activePage === 'ongoing-requests' && <OngoingRequestsView />}
              {activePage === 'requests' && <RequestsView />}
              {activePage === 'active-requests' && <ActiveRequestsView />}
              {activePage === 'signed-contracts' && <SignedContractsView />}
              {activePage === 'interviews' && <InterviewsView />}
              {activePage === 'invoices' && <InvoicesView />}
              {activePage === 'attestations' && <AttestationsView />}
              {viewingChoiceId ? (

                <ContractDetailView 
                  choiceId={viewingChoiceId} 
                  onBack={() => setViewingChoiceId(null)} 
                />
              ) : activePage === 'contracts' ? (
                <ContractsView onViewContract={(id) => setViewingChoiceId(id)} />
              ) : null}
              {activePage === 'users' && (
                viewingUserId ? (
                  <UserDetailsView 
                    id={viewingUserId} 
                    onBack={() => setViewingUserId(null)} 
                  />
                ) : (
                  <UsersView onViewUser={(id) => setViewingUserId(id)} />
                )
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Sub-Views ---

const DashboardView = () => {
  const stats = [
    { label: 'Total Requests', value: '1,284', trend: '+12.5%', icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Interviews', value: '42', trend: '+5.2%', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Payments', value: '€3,450', trend: '-2.4%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Revenue', value: '€48,290', trend: '+18.7%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
            <select className="bg-slate-50 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-end justify-between px-8 pb-4 gap-2">
            {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-200 rounded-t-lg hover:bg-slate-900 transition-colors cursor-pointer group relative" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h * 100}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">New request from Family Smith</p>
                  <p className="text-xs text-slate-400">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewRequestsView = () => {
    const [requests, setRequests] = useState<import('../services/api').ParentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<KanbanRequest | null>(null);

    const handleEdit = (req: import('../services/api').ParentRequest) => {
        setEditingRequest(transformToKanbanRequest(req));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const response = await api.removeParentRequest(id);
                if (response.status) {
                    toast.success('Request deleted successfully');
                    setRequests(requests.filter(r => r.id !== id));
                } else {
                    toast.error(response.message || 'Failed to delete request');
                }
            } catch (err) {
                toast.error('An error occurred while deleting');
            }
        }
    };

    const handleUpdate = async (reqId: number, updatedFields: Partial<KanbanRequest>) => {
        try {
            const response = await api.updateParentRequest(reqId, {
                first_name: updatedFields.user?.first_name || '',
                last_name: updatedFields.user?.last_name || '',
                parent_address: updatedFields.parent_address || '',
                email: updatedFields.email || '',
                children: (updatedFields.children || []).map((c: any) => ({ id: c.id, child_dob: c.child_dob })),
                choices: (updatedFields.choices || []).map((c: any) => ({
                    choice_order: c.choice_order,
                    bb_bs_id: c.user_id,
                    babysitter_first_name: c.babysitter_first_name,
                    babysitter_last_name: c.babysitter_last_name,
                    interview_date: c.interview_date,
                    interview_time: c.interview_time
                })),
                schedules: (updatedFields.schedules || []).map((s: any) => ({
                    schedule_date: s.schedule_date,
                    slots: (s.slots || []).map((slot: any) => ({ start_time: slot.start_time, end_time: slot.end_time }))
                })),
                hourly_rate: updatedFields.hourly_rate,
                _method: 'put'
            } as any);

            if (response.status && response.data) {
                toast.success('Request updated successfully');
                setRequests(prev => prev.map(r => r.id === reqId ? response.data! : r));
                setEditingRequest(null);
            } else {
                toast.error(response.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    const fetchNewRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.getNewRequests();
            setRequests(result);
        } catch (err: any) {
            setError('Failed to load new requests. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNewRequests();
    }, []);

    const filteredRequests = requests.filter(req => {
        const parentName = `${req.user?.first_name} ${req.user?.last_name}`.toLowerCase();
        return parentName.includes(searchQuery.toLowerCase()) || 
               req.id.toString().includes(searchQuery) ||
               req.parent_address?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">New Requests List</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter new requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                        />
                    </div>

                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Request
                    </button>

                    <button 
                        onClick={fetchNewRequests}
                        className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <History size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Address</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Rate</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="text-sm font-medium">Loading new requests...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && error && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-red-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle size={18} />
                                            <span className="text-sm font-medium">{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        No new requests found.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900">#{req.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{req.user?.first_name} {req.user?.last_name}</span>
                                            <span className="text-xs text-slate-400">{req.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{req.parent_address || 'No address provided'}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">€{req.hourly_rate}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {req.created_at ? new Date(req.created_at).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => {
                                                    const link = `${window.location.origin}/price/${req.id}`;
                                                    navigator.clipboard.writeText(link);
                                                    toast.success('Price Quote link copied!');
                                                }}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                title="Copy Price Quote"
                                            >
                                                <LinkIcon size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(req)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(req.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

              <AnimatePresence>
                {isAddModalOpen && (
                    <AddNewActiveRequestModal
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={fetchNewRequests}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingRequest && (
                    <RequestDetailsModal
                        request={editingRequest}
                        onClose={() => setEditingRequest(null)}
                        onUpdate={(updatedFields) => handleUpdate(editingRequest.id, updatedFields)}
                    />
                )}
            </AnimatePresence>

        </div>
        
    );
};

const OngoingRequestsView = () => {
    const [requests, setRequests] = useState<import('../services/api').ParentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingRequest, setEditingRequest] = useState<KanbanRequest | null>(null);

    const handleEdit = (req: import('../services/api').ParentRequest) => {
        setEditingRequest(transformToKanbanRequest(req));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const response = await api.removeParentRequest(id);
                if (response.status) {
                    toast.success('Request deleted successfully');
                    setRequests(requests.filter(r => r.id !== id));
                } else {
                    toast.error(response.message || 'Failed to delete request');
                }
            } catch (err) {
                toast.error('An error occurred while deleting');
            }
        }
    };

    const handleUpdate = async (reqId: number, updatedFields: Partial<KanbanRequest>) => {
        try {
            const response = await api.updateParentRequest(reqId, {
                first_name: updatedFields.user?.first_name || '',
                last_name: updatedFields.user?.last_name || '',
                parent_address: updatedFields.parent_address || '',
                email: updatedFields.email || '',
                children: (updatedFields.children || []).map((c: any) => ({ id: c.id, child_dob: c.child_dob })),
                choices: (updatedFields.choices || []).map((c: any) => ({
                    choice_order: c.choice_order,
                    bb_bs_id: c.user_id,
                    babysitter_first_name: c.babysitter_first_name,
                    babysitter_last_name: c.babysitter_last_name,
                    interview_date: c.interview_date,
                    interview_time: c.interview_time
                })),
                schedules: (updatedFields.schedules || []).map((s: any) => ({
                    schedule_date: s.schedule_date,
                    slots: (s.slots || []).map((slot: any) => ({ start_time: slot.start_time, end_time: slot.end_time }))
                })),
                hourly_rate: updatedFields.hourly_rate,
                _method: 'put'
            } as any);

            if (response.status && response.data) {
                toast.success('Request updated successfully');
                setRequests(prev => prev.map(r => r.id === reqId ? response.data! : r));
                setEditingRequest(null);
            } else {
                toast.error(response.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    const fetchOngoingRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.getOngoingRequests();
            setRequests(result);
        } catch (err: any) {
            setError('Failed to load ongoing requests. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOngoingRequests();
    }, []);

    const filteredRequests = requests.filter(req => {
        const parentName = `${req.user?.first_name} ${req.user?.last_name}`.toLowerCase();
        const hiredSitter = req.choices?.find(c => Number(c.final_choice) === 1);
        const sitterName = hiredSitter ? `${hiredSitter.babysitter_first_name} ${hiredSitter.babysitter_last_name}`.toLowerCase() : '';
        return parentName.includes(searchQuery.toLowerCase()) || 
               sitterName.includes(searchQuery.toLowerCase()) ||
               req.id.toString().includes(searchQuery) ||
               req.parent_address?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Ongoing Requests List</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search ongoing requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={fetchOngoingRequests}
                        className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <History size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hired Sitter</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Rate</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="text-sm font-medium">Loading ongoing requests...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && error && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-red-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle size={18} />
                                            <span className="text-sm font-medium">{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        No ongoing requests found.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.map((req) => {
                                const hiredSitter = req.choices?.find(c => Number(c.final_choice) === 1);
                                return (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-900">#{req.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{req.user?.first_name} {req.user?.last_name}</span>
                                                <span className="text-xs text-slate-400">{req.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {hiredSitter ? (
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800">{hiredSitter.babysitter_first_name} {hiredSitter.babysitter_last_name}</span>
                                                        <span className="text-xs text-slate-400">{hiredSitter.babysitter_email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                        <Phone size={10} />
                                                        <span>{hiredSitter.babysitter_phone}</span>
                                                    </div>
                                                    {hiredSitter.interview_date && (
                                                        <div className="flex items-center gap-2 text-[10px] text-blue-600 font-medium">
                                                            <Calendar size={10} />
                                                            <span>Interview: {hiredSitter.interview_date} {hiredSitter.interview_time}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">€{req.hourly_rate}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        const link = `https://ponctuel.bloom-buddies.fr/price/${req.id}`;
                                                        navigator.clipboard.writeText(link);
                                                        toast.success('Price Quote link copied!');
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Copy Price Quote Link"
                                                >
                                                    <LinkIcon size={18} />
                                                </button>
                                                {hiredSitter?.zoom_meeting_link && (
                                                    <a 
                                                        href={hiredSitter.zoom_meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Join Zoom Meeting"
                                                    >
                                                        <Video size={18} />
                                                    </a>
                                                )}
                                                <button 
                                                    onClick={() => handleEdit(req)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {editingRequest && (
                    <RequestDetailsModal
                        request={editingRequest}
                        onClose={() => setEditingRequest(null)}
                        onUpdate={(updatedFields) => handleUpdate(editingRequest.id, updatedFields)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const CompletedRequestsView = () => {
    const [requests, setRequests] = useState<import('../services/api').ParentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingRequest, setEditingRequest] = useState<KanbanRequest | null>(null);

    const handleEdit = (req: import('../services/api').ParentRequest) => {
        setEditingRequest(transformToKanbanRequest(req));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const response = await api.removeParentRequest(id);
                if (response.status) {
                    toast.success('Request deleted successfully');
                    setRequests(requests.filter(r => r.id !== id));
                } else {
                    toast.error(response.message || 'Failed to delete request');
                }
            } catch (err) {
                toast.error('An error occurred while deleting');
            }
        }
    };

    const handleUpdate = async (reqId: number, updatedFields: Partial<KanbanRequest>) => {
        try {
            const response = await api.updateParentRequest(reqId, {
                first_name: updatedFields.user?.first_name || '',
                last_name: updatedFields.user?.last_name || '',
                parent_address: updatedFields.parent_address || '',
                email: updatedFields.email || '',
                children: (updatedFields.children || []).map((c: any) => ({ id: c.id, child_dob: c.child_dob })),
                choices: (updatedFields.choices || []).map((c: any) => ({
                    choice_order: c.choice_order,
                    bb_bs_id: c.user_id,
                    babysitter_first_name: c.babysitter_first_name,
                    babysitter_last_name: c.babysitter_last_name,
                    interview_date: c.interview_date,
                    interview_time: c.interview_time
                })),
                schedules: (updatedFields.schedules || []).map((s: any) => ({
                    schedule_date: s.schedule_date,
                    slots: (s.slots || []).map((slot: any) => ({ start_time: slot.start_time, end_time: slot.end_time }))
                })),
                hourly_rate: updatedFields.hourly_rate,
                _method: 'put'
            } as any);

            if (response.status && response.data) {
                toast.success('Request updated successfully');
                setRequests(prev => prev.map(r => r.id === reqId ? response.data! : r));
                setEditingRequest(null);
            } else {
                toast.error(response.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    const fetchCompletedRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.getCompletedRequests();
            setRequests(result);
        } catch (err: any) {
            setError('Failed to load completed requests. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedRequests();
    }, []);

    const filteredRequests = requests.filter(req => {
        const parentName = `${req.user?.first_name} ${req.user?.last_name}`.toLowerCase();
        const hiredSitter = req.choices?.find(c => Number(c.final_choice) === 1);
        const sitterName = hiredSitter ? `${hiredSitter.babysitter_first_name} ${hiredSitter.babysitter_last_name}`.toLowerCase() : '';
        return parentName.includes(searchQuery.toLowerCase()) || 
               sitterName.includes(searchQuery.toLowerCase()) ||
               req.id.toString().includes(searchQuery) ||
               req.parent_address?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Completed Requests List</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search completed requests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={fetchCompletedRequests}
                        className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <History size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hired Sitter</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Rate</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Completed At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="text-sm font-medium">Loading completed requests...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && error && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-red-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle size={18} />
                                            <span className="text-sm font-medium">{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        No completed requests found.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.map((req) => {
                                const hiredSitter = req.choices?.find(c => Number(c.final_choice) === 1);
                                return (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-900">#{req.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{req.user?.first_name} {req.user?.last_name}</span>
                                                <span className="text-xs text-slate-400">{req.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {hiredSitter ? (
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800">{hiredSitter.babysitter_first_name} {hiredSitter.babysitter_last_name}</span>
                                                        <span className="text-xs text-slate-400">{hiredSitter.babysitter_email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                                        <Phone size={10} />
                                                        <span>{hiredSitter.babysitter_phone}</span>
                                                    </div>
                                                    {hiredSitter.interview_date && (
                                                        <div className="flex items-center gap-2 text-[10px] text-blue-600 font-medium">
                                                            <Calendar size={10} />
                                                            <span>Interview: {hiredSitter.interview_date} {hiredSitter.interview_time}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">€{req.hourly_rate}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {req.updated_at ? new Date(req.updated_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => {
                                                        const link = `https://ponctuel.bloom-buddies.fr/price/${req.id}`;
                                                        navigator.clipboard.writeText(link);
                                                        toast.success('Price Quote link copied!');
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Copy Price Quote Link"
                                                >
                                                    <LinkIcon size={18} />
                                                </button>
                                                {hiredSitter?.zoom_meeting_link && (
                                                    <a 
                                                        href={hiredSitter.zoom_meeting_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Join Zoom Meeting"
                                                    >
                                                        <Video size={18} />
                                                    </a>
                                                )}
                                                <button 
                                                    onClick={() => handleEdit(req)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {editingRequest && (
                    <RequestDetailsModal
                        request={editingRequest}
                        onClose={() => setEditingRequest(null)}
                        onUpdate={(updatedFields) => handleUpdate(editingRequest.id, updatedFields)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const SitterChoicesModal: React.FC<{ 
    choices: any[], 
    requestId: number, 
    onClose: () => void 
}> = ({ choices, requestId, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Sitter Choices</h3>
                        <p className="text-sm text-slate-500">Request #{requestId}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="flex flex-col border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="grid grid-cols-[1.5fr,1fr,1fr,120px] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-left">
                            <span>Babysitter Info</span>
                            <span>Contact</span>
                            <span>Interview</span>
                            <span className="text-right">Actions</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {choices.map((choice) => (
                                <div key={choice.id} className="grid grid-cols-[1.5fr,1fr,1fr,120px] gap-4 px-6 py-5 hover:bg-slate-50/50 transition-colors items-center group/modal-row">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">
                                            {choice.babysitter_first_name} {choice.babysitter_last_name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">{choice.babysitter_email}</p>
                                    </div>
                                    <div className="text-xs text-slate-600 font-medium">
                                        {choice.babysitter_phone || 'N/A'}
                                    </div>
                                    <div>
                                        {choice.interview_date ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Calendar size={12} className="text-brand-accent/70" />
                                                    <span>{choice.interview_date}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Clock size={12} className="text-slate-300" />
                                                    <span>{choice.interview_time?.substring(0, 5)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-300 italic">Not scheduled</span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => {
                                                const link = `https://ponctuel.bloom-buddies.fr/babysitting-matching/${requestId}`;
                                                navigator.clipboard.writeText(link);
                                                toast.success('Price quote link copied!');
                                            }}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all border border-transparent hover:border-emerald-100"
                                            title="Copy Price Quote Link"
                                        >
                                            <LinkIcon size={16} />
                                        </button>
                                        {choice.zoom_meeting_link && (
                                            <a 
                                                href={choice.zoom_meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                                                title="Join Zoom Meeting"
                                            >
                                                <Video size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const ActiveRequestChoicesCell: React.FC<{ 
    choices: any[], 
    requestId: number, 
    onShowMore: (choices: any[], reqId: number) => void 
}> = ({ choices, requestId, onShowMore }) => {
    if (!choices || choices.length === 0) return <span className="text-slate-400 text-sm italic">No choices</span>;

    const visibleChoices = choices.slice(0, 2);
    const hasMore = choices.length > 2;

    return (
        <div className="flex items-center gap-2 flex-wrap min-w-[150px]">
            {visibleChoices.map((choice) => (
                <div 
                    key={choice.id} 
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full hover:bg-white transition-all shadow-sm group/tag"
                >
                    <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                        {choice.babysitter_first_name}
                    </span>
                    <div className="flex items-center gap-1 opacity-40 group-hover/tag:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                const link = `https://ponctuel.bloom-buddies.fr/babysitting-matching/${requestId}`;
                                navigator.clipboard.writeText(link);
                                toast.success('Link copied!');
                            }}
                            className="p-0.5 hover:text-emerald-600 transition-colors"
                            title="Copy Quote"
                        >
                            <LinkIcon size={10} />
                        </button>
                        {choice.zoom_meeting_link && (
                            <a 
                                href={choice.zoom_meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-0.5 hover:text-blue-600 transition-colors"
                                title="Zoom"
                            >
                                <Video size={10} />
                            </a>
                        )}
                    </div>
                </div>
            ))}
            {hasMore && (
                <button 
                    onClick={() => onShowMore(choices, requestId)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                    <Plus size={10} />
                    <span>{choices.length - 2} more</span>
                </button>
            )}
        </div>
    );
};

const ActiveRequestsView = () => {
    const [requests, setRequests] = useState<import('../services/api').ParentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRequest, setEditingRequest] = useState<KanbanRequest | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewingSitterChoices, setViewingSitterChoices] = useState<{ choices: any[], reqId: number } | null>(null);

    const fetchActiveRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.getActiveRequests();
            setRequests(result);
        } catch (err: any) {
            setError('Failed to load active requests. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchActiveRequests();
    }, []);

    const handleEdit = (req: import('../services/api').ParentRequest) => {
        setEditingRequest(transformToKanbanRequest(req));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const response = await api.removeParentRequest(id);
                if (response.status) {
                    toast.success('Request deleted successfully');
                    setRequests(requests.filter(r => r.id !== id));
                } else {
                    toast.error(response.message || 'Failed to delete request');
                }
            } catch (err) {
                toast.error('An error occurred while deleting');
            }
        }
    };

    const handleUpdate = async (reqId: number, updatedFields: Partial<KanbanRequest>) => {
        try {
            // Clean children payload
            const childrenPayload = (updatedFields.children || []).map((c: any) => ({
                id: c.id,
                child_dob: c.child_dob
            }));

            // Clean choices payload
            const choicesPayload = (updatedFields.choices || []).map((c: any) => ({
                choice_order: c.choice_order,
                bb_bs_id: c.user_id,
                babysitter_first_name: c.babysitter_first_name,
                babysitter_last_name: c.babysitter_last_name,
                babysitter_email: c.babysitter_email,
                babysitter_phone: c.babysitter_phone,
                babysitter_address: c.babysitter_address,
                interview_date: c.interview_date,
                interview_time: c.interview_time
            }));

            // Clean schedules payload
            const schedulesPayload = (updatedFields.schedules || []).map((s: any) => ({
                schedule_date: s.schedule_date,
                slots: (s.slots || []).map((slot: any) => ({
                    start_time: slot.start_time,
                    end_time: slot.end_time
                }))
            }));

            const response = await api.updateParentRequest(reqId, {
                first_name: updatedFields.user?.first_name || '',
                last_name: updatedFields.user?.last_name || '',
                parent_address: updatedFields.parent_address || '',
                email: updatedFields.email || '',
                children: childrenPayload,
                choices: choicesPayload,
                schedules: schedulesPayload,
                hourly_rate: updatedFields.hourly_rate,
                _method: 'put'
            } as any);

            if (response.status && response.data) {
                toast.success('Request updated successfully');
                setRequests(prev => prev.map(r => r.id === reqId ? response.data! : r));
                setEditingRequest(null);
            } else {
                toast.error(response.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Active Requests List</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter active requests..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add New Request
                    </button>
                    <button 
                        onClick={fetchActiveRequests}
                        className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        title="Refresh"
                    >
                        <History size={18} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Sitter Choices</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Address</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Rate</th>
                                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Schedules</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="text-sm font-medium">Loading active requests...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && error && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-red-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle size={18} />
                                            <span className="text-sm font-medium">{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && requests.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        No active requests found.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && requests.map((req) => (
                                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-4 py-4 font-bold text-slate-900">#{req.id}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col max-w-[120px]">
                                            <span className="font-bold text-slate-800 truncate">{req.user?.first_name} {req.user?.last_name}</span>
                                            <span className="text-xs text-slate-400 truncate">{req.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <ActiveRequestChoicesCell 
                                            choices={req.choices ?? []} 
                                            requestId={req.id} 
                                            onShowMore={(choices, reqId) => setViewingSitterChoices({ choices, reqId })}
                                        />
                                    </td>
                                    <td className="px-4 py-4 text-sm text-slate-600 max-w-[180px] truncate">{req.parent_address}</td>
                                    <td className="px-4 py-4 font-bold text-slate-900">€{req.hourly_rate}</td>
                                    <td className="px-4 py-4">
                                        <ActiveRequestSchedulesCell schedules={req.schedules ?? []} />
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(req)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(req.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {viewingSitterChoices && (
                    <SitterChoicesModal
                        requestId={viewingSitterChoices.reqId}
                        choices={viewingSitterChoices.choices}
                        onClose={() => setViewingSitterChoices(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingRequest && (
                    <RequestDetailsModal
                        request={editingRequest}
                        onClose={() => setEditingRequest(null)}
                        onUpdate={(updatedFields) => handleUpdate(editingRequest.id, updatedFields)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAddModalOpen && (
                    <AddNewActiveRequestModal
                        onClose={() => setIsAddModalOpen(false)}
                        onSuccess={fetchActiveRequests}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const SignedContractsView = () => {
    const [requests, setRequests] = useState<import('../services/api').ParentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingRequest, setEditingRequest] = useState<KanbanRequest | null>(null);

    const handleEdit = (req: import('../services/api').ParentRequest) => {
        setEditingRequest(transformToKanbanRequest(req));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const response = await api.removeParentRequest(id);
                if (response.status) {
                    toast.success('Request deleted successfully');
                    setRequests(requests.filter(r => r.id !== id));
                } else {
                    toast.error(response.message || 'Failed to delete request');
                }
            } catch (err) {
                toast.error('An error occurred while deleting');
            }
        }
    };

    const handleUpdate = async (reqId: number, updatedFields: Partial<KanbanRequest>) => {
        try {
            const response = await api.updateParentRequest(reqId, {
                first_name: updatedFields.user?.first_name || '',
                last_name: updatedFields.user?.last_name || '',
                parent_address: updatedFields.parent_address || '',
                email: updatedFields.email || '',
                children: (updatedFields.children || []).map((c: any) => ({ id: c.id, child_dob: c.child_dob })),
                choices: (updatedFields.choices || []).map((c: any) => ({
                    choice_order: c.choice_order,
                    bb_bs_id: c.user_id,
                    babysitter_first_name: c.babysitter_first_name,
                    babysitter_last_name: c.babysitter_last_name,
                    interview_date: c.interview_date,
                    interview_time: c.interview_time
                })),
                schedules: (updatedFields.schedules || []).map((s: any) => ({
                    schedule_date: s.schedule_date,
                    slots: (s.slots || []).map((slot: any) => ({ start_time: slot.start_time, end_time: slot.end_time }))
                })),
                hourly_rate: updatedFields.hourly_rate,
                _method: 'put'
            } as any);

            if (response.status && response.data) {
                toast.success('Request updated successfully');
                setRequests(prev => prev.map(r => r.id === reqId ? response.data! : r));
                setEditingRequest(null);
            } else {
                toast.error(response.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    const fetchSignedContracts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await api.getSignedContractRequests();
            setRequests(result);
        } catch (err: any) {
            setError('Failed to load signed contracts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSignedContracts();
    }, []);

    const filteredRequests = requests.filter(req => {
        const parentName = `${req.user?.first_name} ${req.user?.last_name}`.toLowerCase();
        const hiredSitter = req.choices?.find(c => Number(c.final_choice) === 1);
        const sitterName = hiredSitter ? `${hiredSitter.babysitter_first_name} ${hiredSitter.babysitter_last_name}`.toLowerCase() : '';
        return parentName.includes(searchQuery.toLowerCase()) || 
               sitterName.includes(searchQuery.toLowerCase()) ||
               req.id.toString().includes(searchQuery);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Signed Contracts List</h3>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search contracts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hired Babysitter</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex items-center justify-center gap-3">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="text-sm font-medium">Loading signed contracts...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && error && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle size={18} />
                                            <span className="text-sm font-medium">{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        No signed contracts found.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && !error && filteredRequests.map((req) => {
                                const hiredSitter = req.choices?.find(c => Number(c.final_choice) === 1);
                                return (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-900">#{req.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800">{req.user?.first_name} {req.user?.last_name}</span>
                                                <span className="text-xs text-slate-400">{req.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {hiredSitter ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800">{hiredSitter.babysitter_first_name} {hiredSitter.babysitter_last_name}</span>
                                                    <span className="text-xs text-slate-400">{hiredSitter.babysitter_email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-sm">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(req)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {editingRequest && (
                    <RequestDetailsModal
                        request={editingRequest}
                        onClose={() => setEditingRequest(null)}
                        onUpdate={(updatedFields) => handleUpdate(editingRequest.id, updatedFields)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const RequestsView = () => {
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
    const [requests, setRequests] = useState<import('../services/api').ParentRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingRequest, setEditingRequest] = useState<KanbanRequest | null>(null);

    const fetchRequests = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { api } = await import('../services/api');
            const result = await api.getParentRequests();
            setRequests(result.data);
        } catch {
            setError('Failed to load requests. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleEdit = (req: import('../services/api').ParentRequest) => {
        setEditingRequest(transformToKanbanRequest(req));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                const response = await api.removeParentRequest(id);
                if (response.status) {
                    toast.success('Request deleted successfully');
                    setRequests(requests.filter(r => r.id !== id));
                } else {
                    toast.error(response.message || 'Failed to delete request');
                }
            } catch (err) {
                toast.error('An error occurred while deleting');
            }
        }
    };

    const handleUpdate = async (reqId: number, updatedFields: Partial<KanbanRequest>) => {
        try {
            const response = await api.updateParentRequest(reqId, {
                first_name: updatedFields.user?.first_name || '',
                last_name: updatedFields.user?.last_name || '',
                parent_address: updatedFields.parent_address || '',
                email: updatedFields.email || '',
                children: (updatedFields.children || []).map((c: any) => ({ id: c.id, child_dob: c.child_dob })),
                choices: (updatedFields.choices || []).map((c: any) => ({
                    choice_order: c.choice_order,
                    bb_bs_id: c.user_id,
                    babysitter_first_name: c.babysitter_first_name,
                    babysitter_last_name: c.babysitter_last_name,
                    interview_date: c.interview_date,
                    interview_time: c.interview_time
                })),
                schedules: (updatedFields.schedules || []).map((s: any) => ({
                    schedule_date: s.schedule_date,
                    slots: (s.slots || []).map((slot: any) => ({ start_time: slot.start_time, end_time: slot.end_time }))
                })),
                hourly_rate: updatedFields.hourly_rate,
                _method: 'put'
            } as any);

            if (response.status && response.data) {
                toast.success('Request updated successfully');
                setRequests(prev => prev.map(r => r.id === reqId ? response.data! : r));
                setEditingRequest(null);
            } else {
                toast.error(response.message || 'Update failed');
            }
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter requests..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
                        />
                    </div>
                    <button className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button 
                        onClick={fetchRequests}
                        className="p-2 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        title="Refresh"
                    >
                        <History size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* View Toggle */}
                    <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <TableIcon size={14} />
                            Table View
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'kanban' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <LayoutGrid size={14} />
                            Kanban View
                        </button>
                    </div>

                    <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Export CSV
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'table' ? (
                    <motion.div
                        key="table"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Family Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Children</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Dates</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex items-center justify-center gap-3 text-slate-400">
                                                    <Loader2 className="animate-spin w-5 h-5" />
                                                    <span className="text-sm font-medium">Loading requests…</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {!isLoading && error && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex items-center justify-center gap-2 text-red-500">
                                                    <AlertCircle size={18} />
                                                    <span className="text-sm font-medium">{error}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {!isLoading && !error && requests.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                                No requests found.
                                            </td>
                                        </tr>
                                    )}
                                    {!isLoading && !error && requests.map((req) => (
                                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900">#{req.id}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">
                                                {req.user?.first_name} {req.user?.last_name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {req.children?.length}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <ScheduleDatesCell schedules={req.schedules ?? []} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleEdit(req)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(req.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-400 font-medium">
                                {isLoading ? 'Loading…' : `Showing ${requests.length} ${requests.length === 1 ? 'entry' : 'entries'}`}
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                                <button className="p-2 border border-slate-200 rounded-lg text-slate-900 hover:bg-slate-50">Next</button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="kanban"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <KanbanBoard initialRequests={requests} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingRequest && (
                    <RequestDetailsModal
                        request={editingRequest}
                        onClose={() => setEditingRequest(null)}
                        onUpdate={(updatedFields) => handleUpdate(editingRequest.id, updatedFields)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Helper: Schedule Dates Cell ---

interface ScheduleDatesCellProps {
  schedules: import('../services/api').Schedule[];
}

const MAX_VISIBLE_DATES = 4;

const ActiveRequestSchedulesCell: React.FC<{ schedules: any[] }> = ({ schedules }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    if (!schedules || schedules.length === 0) return <span className="text-slate-400 text-sm italic">No schedules</span>;

    const visibleSchedules = schedules.slice(0, 2);
    const hiddenSchedules = schedules.slice(2);

    return (
        <div className="flex flex-wrap gap-2 max-w-[400px]">
            {visibleSchedules.map((sch) => (
                <div key={sch.id} className="flex items-center gap-1.5 p-1.5 px-2 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-white transition-all shadow-sm">
                    <div className="flex items-center gap-1 shrink-0">
                        <Calendar size={11} className="text-brand-accent/70" />
                        <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{sch.schedule_date}</span>
                    </div>
                    {sch.slots && sch.slots.length > 0 && (
                        <>
                            <div className="w-px h-3 bg-slate-200" />
                            <div className="flex items-center gap-1">
                                <Clock size={10} className="text-slate-400" />
                                <span className="text-[9px] font-medium text-slate-500 whitespace-nowrap">
                                    {sch.slots.map((slot: any) => `${slot.start_time?.substring(0, 5)}-${slot.end_time?.substring(0, 5)}`).join(', ')}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            ))}
            {hiddenSchedules.length > 0 && (
                <div className="relative">
                    <button
                        onMouseEnter={() => setTooltipOpen(true)}
                        onMouseLeave={() => setTooltipOpen(false)}
                        className="flex items-center gap-1 px-2 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-slate-200 transition-colors h-full whitespace-nowrap"
                    >
                        <History size={10} />
                        <span>+{hiddenSchedules.length} more</span>
                    </button>
                    {tooltipOpen && (
                        <div className="absolute z-[100] top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-4 min-w-[300px] animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Remaining Schedules
                                </span>
                                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {hiddenSchedules.length} dates
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {hiddenSchedules.map((sch) => (
                                    <div key={sch.id} className="flex flex-col gap-1 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-brand-accent/70" />
                                            <span className="text-[11px] font-bold text-slate-700">{sch.schedule_date}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 ml-5">
                                            {sch.slots?.map((slot: any) => (
                                                <div key={slot.id} className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-500">
                                                    <Clock size={10} className="text-slate-400" />
                                                    <span>{slot.start_time?.substring(0, 5)} - {slot.end_time?.substring(0, 5)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Pointer Arrow pointing UP */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-[2px] rotate-180">
                                <div className="border-[6px] border-transparent border-t-white relative z-10" />
                                <div className="border-[7px] border-transparent border-t-slate-200 -mt-[14px]" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const ScheduleDatesCell: React.FC<ScheduleDatesCellProps> = ({ schedules }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (schedules.length === 0) {
    return <span className="text-slate-400 text-sm italic">No dates</span>;
  }

  const dates = schedules.map((s) => s.schedule_date);
  const visibleDates = dates.slice(0, MAX_VISIBLE_DATES);
  const hiddenDates = dates.slice(MAX_VISIBLE_DATES);

  return (
    <span className="flex items-center flex-wrap gap-x-1 gap-y-0.5">
      <span>{visibleDates.join(', ')}</span>
      {hiddenDates.length > 0 && (
        <span className="relative inline-block">
          <button
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            onClick={() => setTooltipOpen((v) => !v)}
            className="ml-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold rounded-full transition-colors whitespace-nowrap"
            aria-label={`Show ${hiddenDates.length} more dates`}
          >
            +{hiddenDates.length} more
          </button>
          {tooltipOpen && (
            <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs font-medium rounded-xl px-3 py-2 shadow-xl whitespace-nowrap">
              {hiddenDates.join(', ')}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
            </div>
          )}
        </span>
      )}
    </span>
  );
};



const InterviewsView = () => {
  const interviews = [
    { id: '1', family: 'Smith Family', sitter: 'Amélie Laurent', date: '15/03/2026', status: 'Scheduled' },
    { id: '2', family: 'Dupont Family', sitter: 'Thomas Dubois', date: '16/03/2026', status: 'Completed' },
    { id: '3', family: 'Miller Family', sitter: 'Chloé Mercier', date: '18/03/2026', status: 'Cancelled' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Family</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Babysitter</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Interview Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {interviews.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{item.family}</td>
                <td className="px-6 py-4 text-slate-600">{item.sitter}</td>
                <td className="px-6 py-4 text-slate-600">{item.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                    item.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InvoicesView = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [invoices, setInvoices] = useState<import('../services/api').Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const fetchInvoices = async () => {
      setIsLoading(true);
      setError(null);
      try {

        const { api } = await import('../services/api');
        const result = await api.getAllInvoices({
          month: selectedMonth,
          year: selectedYear
        });

        if (!cancelled) {
          setInvoices(result.data);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load invoices. Please try again.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchInvoices();
    return () => { cancelled = true; };
  }, [selectedMonth, selectedYear]);

  const formatBillingMonth = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

      <div className="flex items-center gap-4 p-4 border-b border-slate-100">

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {[2023, 2024, 2025, 2026, 2027, 2028].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Invoice ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Billing Month</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-3 text-slate-400">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-sm font-medium">Loading invoices…</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-red-500 text-sm font-medium">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                  No invoices found.
                </td>
              </tr>
            )}
            {!isLoading && !error && invoices.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800">{item.invoice_num}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">User #{item.user_id}</span>
                    <span className="text-[10px] text-slate-400">Request #{item.parent_request_id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{item.due_date}</td>
                <td className="px-6 py-4 text-slate-600 capitalize">{formatBillingMonth(item.due_date)}</td>
                <td className="px-6 py-4 font-bold text-slate-900">€{parseFloat(item.amount).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                    item.payment_status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {item.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={async () => {
                      const { generateInvoicePdf } = await import('../utils/invoicePdfGenerator');
                      const placeholderUser = { first_name: 'Customer', last_name: `(#${item.user_id})`, email: '-', user_address: '-' } as any;
                      generateInvoicePdf(item, placeholderUser, 'fr', {} as any);
                    }}
                    className="p-2 text-brand-accent hover:bg-brand-accent/10 rounded-xl transition-colors inline-flex items-center gap-2 text-xs font-bold"
                  >
                    <Download size={14} />
                    <span className="hidden xl:inline">Download PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ContractsView = ({ onViewContract }: { onViewContract: (id: number) => void }) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await api.getContracts();
        setContracts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contract ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Contract Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Rate</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-12" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded-xl w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : contracts.length > 0 ? (
                contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-black text-slate-900">#{contract.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <UserIcon size={14} />
                        </div>
                        <span className="font-bold text-slate-800">
                          {contract.user?.first_name} {contract.user?.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">
                      {new Date(contract.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        contract.status === 1 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {contract.status === 1 ? 'Signed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-700">
                      {contract.hourly_rate ? `${contract.hourly_rate}€/hr` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onViewContract(contract.choice_id)}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all" 
                        title="View Contract"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AttestationsView = () => {
  const [attestations, setAttestations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttestations = async () => {
      try {
        const result = await api.getAttestations();
        setAttestations(result.data || []);
      } catch (error) {
        console.error("Error fetching attestations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttestations();
  }, []);

  const handleDownload = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `/certificates/${fileName}`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };


  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">User Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Year</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-8" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded-xl w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : attestations.length > 0 ? (
                attestations.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-black text-slate-900">#{a.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <UserIcon size={14} />
                        </div>
                        <span className="font-bold text-slate-800">
                          {a.user?.first_name} {a.user?.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">
                      {a.year}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDownload(a.file)}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all" 
                        title="Download Attestation"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No attestations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const UsersView = ({ onViewUser }: { onViewUser: (id: number) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    const id = userToDelete.id;
    setIsDeleting(id);
    try {
      const response = await api.deleteUser(id);
      if (response.status) {
        setUsers(users.filter(u => u.id !== id));
        toast.success(response.message || 'User deleted successfully');
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('An error occurred while deleting the user');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none w-64 focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all font-medium"
            />
          </div>
          <div className="text-sm text-slate-400 font-medium">
            {filteredUsers.length} Users Total
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">SMG Num</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Requests</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Address</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-12" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-100 rounded-xl w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <UserIcon size={14} />
                        </div>
                        <span className="font-bold text-slate-800">{user.first_name} {user.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">{user.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">{user.cmg_num || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                        {user.parent_requests_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">{user.user_phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">{user.user_address || 'N/A'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => onViewUser(user.id)}
                          className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                          className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={isDeleting === user.id}
                          className={`p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-all ${isDeleting === user.id ? 'animate-pulse' : ''}`}
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
          onUpdate={() => { fetchUsers(); setIsEditModalOpen(false); setSelectedUser(null); }}
        />
      )}

      {isDeleteModalOpen && userToDelete && (
        <DeleteConfirmationModal
          userName={`${userToDelete.first_name} ${userToDelete.last_name}`}
          isDeleting={isDeleting === userToDelete.id}
          onClose={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

const UserDetailsView = ({ id, onBack }: { id: number; onBack: () => void }) => {
  const [user, setUser] = useState<User & { parent_requests: any[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await api.getUserDetails(id);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-48 bg-white rounded-3xl border border-slate-100 shadow-sm" />
        <div className="h-96 bg-white rounded-3xl border border-slate-100 shadow-sm" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
            <ChevronLeft size={18} />
          </div>
          Back to Users
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
              <UserIcon size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-1">{user?.first_name} {user?.last_name}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email || 'N/A'}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="flex items-center gap-1.5"><Phone size={14} /> {user?.user_phone || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Address</label>
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <MapPin size={18} className="text-slate-400 mt-0.5" />
              <p className="text-sm font-bold text-slate-700 leading-relaxed">{user?.user_address || 'Not Provided'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CMG Identification</label>
            <div className="flex items-center gap-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 group">
              <Shield size={18} className="text-emerald-500" />
              <div>
                <p className="text-[10px] font-bold text-emerald-600/60 uppercase">CMG</p>
                <p className="text-lg font-black text-emerald-600 tracking-wider">
                  {user?.cmg_num || 'PENDING'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quick Stats</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Requests</p>
                <p className="text-xl font-black text-slate-900">{user?.parent_requests?.length || 0}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Role</p>
                <p className="text-xl font-black text-slate-900">Parent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList size={20} className="text-slate-400" /> Parent Requests
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rate</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Address</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Children</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {user?.parent_requests?.map((req: any) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-black text-slate-900">#{req.id}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {req.board_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{req.hourly_rate}€/hr</td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{req.parent_address}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Baby size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{req.children?.length || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!user?.parent_requests || user.parent_requests.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    No requests found for this user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ContractDetailView = ({ choiceId, onBack }: { choiceId: number; onBack: () => void }) => {
  const { t: trans, language } = useLanguage();
  const t = trans.contract;
  const [contractData, setContractData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        const data = await api.getContract(choiceId);
        setContractData(data);
      } catch (err) {
        console.error("Failed to fetch contract:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [choiceId]);

  const calculateHoursFromSlot = (slot: string): number => {
    try {
      const separator = slot.includes(' : ') ? ' : ' : ' - ';
      const [start, end] = slot.split(separator).map(s => s.trim());
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const startDecimal = startH + (startM / 60);
      const endDecimal = endH + (endM / 60);
      return Math.max(0, endDecimal - startDecimal);
    } catch (e) {
      return 0;
    }
  };

  const getMonthlyHours = (monthDates: Record<string, string[]>): number => {
    let total = 0;
    Object.values(monthDates).forEach(slots => {
      (slots as string[]).forEach(slot => {
        total += calculateHoursFromSlot(slot);
      });
    });
    return total;
  };

  const formatMonthString = (monthStr: string) => {
    try {
      const [monthName, year] = monthStr.split(' ');
      const date = new Date(Date.parse(`${monthName} 1, ${year}`));
      if (isNaN(date.getTime())) return monthStr;
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' });
    } catch {
      return monthStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold">Loading contract details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
          <ChevronLeft size={18} />
        </div>
        Back to Contracts
      </button>

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 md:p-12 relative overflow-hidden max-w-4xl mx-auto">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-900/10 rounded-2xl flex items-center justify-center text-slate-900">
                <FileText size={28} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {t.title}
              </h1>
            </div>
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">ID</p>
              <p className="text-sm font-bold text-slate-700">#CTR-{choiceId}-{contractData?.contract_id}</p>
            </div>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto pr-4 custom-scroll">
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wide">{t.between}</h2>
              <p className="mb-6">{t.agency}</p>
              <p className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-2">{t.part1}</p>
              <p className="font-bold text-slate-900 text-[10px] uppercase tracking-wider mb-2">{t.part2}</p>
              <div className="mb-4">
                <p>
                  <strong className="text-slate-900">{contractData?.user?.first_name} {contractData?.user?.last_name}</strong>
                  {contractData?.user?.user_address && (
                    <span className="mx-1">{t.domiciledAt} {contractData.user.user_address}</span>
                  )}
                  {contractData?.user?.user_phone && (
                    <span className="mx-1">{t.reachableAt} {contractData.user.user_phone}</span>
                  )}
                  {contractData?.user?.email && (
                    <span className="mx-1">{language === 'fr' ? 'et' : 'and'} {contractData.user.email}</span>
                  )}
                </p>
              </div>
              <p className="italic text-slate-500 text-sm mb-4">{t.clientDesignation}</p>
              <p className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">{t.partOther}</p>
            </section>

            <p className="py-4 border-y border-slate-50 text-center font-medium text-slate-400 italic text-sm">
              {t.agreedFollowing}
            </p>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">1</span>
                {t.article1.title}
              </h3>
              <p className="mb-6">{t.article1.content}</p>
              
              <div className="space-y-4 mb-6">
                {contractData?.format1 && Object.entries(contractData.format1 as Record<string, any>).map(([month, dates]) => {
                  const monthlyHours = getMonthlyHours(dates);
                  const formattedMonth = formatMonthString(month);
                  return (
                    <div key={month} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-4">{formattedMonth}</h4>
                      <div className="space-y-2 mb-4">
                        {Object.entries(dates as Record<string, string[]>).map(([date, slots]) => (
                          <div key={date} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                            <span className="text-sm capitalize">{new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                            <span className="text-sm font-bold text-slate-900">{(slots as string[]).join(' - ')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
                        {t.article1.totalMonth.replace('{month}', formattedMonth)} <span className="text-slate-900 ml-1 font-bold text-sm">{monthlyHours.toFixed(2)} h</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-5 bg-slate-900 text-white rounded-2xl flex justify-between items-center shadow-lg">
                <span className="font-bold text-sm">{t.article1.totalPeriod}</span>
                <span className="text-xl font-bold">
                  {contractData ? Object.values(contractData.format1 as Record<string, any>).reduce((total: number, monthDates) => total + getMonthlyHours(monthDates), 0).toFixed(2) : '0.00'} h
                </span>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">2</span>
                {t.article2.title}
              </h3>
              <p className="text-sm leading-relaxed">{t.article2.content}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">3</span>
                {t.article3.title}
              </h3>
              <p className="mb-6">
                {t.article3.content
                  .replace('{start}', contractData?.start_date ? new Date(contractData.start_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]')
                  .replace('{end}', contractData?.end_date ? new Date(contractData.end_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]')
                }
              </p>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{t.article3.subTitle}</h4>
                <p className="text-xs text-slate-500 italic">{t.article3.subContent}</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">4</span>
                {t.article4.title}
              </h3>
              <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{t.article4.subTitle41}</h4>
              <p className="mb-4">{t.article4.content}</p>

              <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-inner bg-slate-50 mb-6">
                <table className="w-full text-left text-sm">
                  <thead className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-6 py-4">{t.article4.period}</th>
                      <th className="px-6 py-4">{t.article4.hrTotal}</th>
                      <th className="px-6 py-4">{t.article4.amountTtc}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {contractData?.format2 && Object.entries(contractData.format2 as Record<string, number>).map(([month, amount]) => (
                      <tr key={month}>
                        <td className="px-6 py-4 font-bold text-slate-700 capitalize">{formatMonthString(month)}</td>
                        <td className="px-6 py-4 text-slate-500">{getMonthlyHours(contractData.format1[month]).toFixed(2)}h</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{amount.toFixed(2)} €</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-900 text-white">
                    <tr>
                      <td className="px-6 py-4 font-bold">{t.article4.hourlyRate}</td>
                      <td colSpan={2} className="px-6 py-4 text-right font-bold text-lg">
                        {contractData?.hourly_rate} €/h
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{t.article4.subTitle42}</h4>
                  <p className="text-xs text-slate-500 italic leading-relaxed">{t.article4.content42}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{t.article4.subTitle43}</h4>
                  <p className="text-xs text-slate-500 italic leading-relaxed">{t.article4.content43}</p>
                </div>
              </div>
            </section>

            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((num) => {
              const art = (t as any)[`article${num}`];
              if (!art) return null;
              return (
                <section key={num}>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">{num}</span>
                    {art.title}
                  </h3>
                  <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                    {num === 6 && (
                      <><p>{art.content1}</p><p>{art.content2}</p><p>{art.content3}</p></>
                    )}
                    {num === 9 && (
                      <><p>{art.content1}</p><p>{art.content2}</p><p>{art.content3}</p><p>{art.content4}</p></>
                    )}
                    {num === 11 && (
                      <>
                        <p>{art.content}</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>{art.item1}</li><li>{art.item2}</li><li>{art.item3}</li>
                        </ul>
                      </>
                    )}
                    {num === 13 && (
                      <><p>{art.content1}</p><p>{art.content2}</p><p>{art.content3}</p></>
                    )}
                    {num === 14 && (
                      <>
                        <p>{art.content1}</p><p>{art.content2}</p><p>{art.content3}</p>
                        <p>{art.content4}</p><p>{art.content5}</p>
                        <p className="italic font-medium">{art.content6}</p>
                      </>
                    )}
                    {num === 15 && (
                      <div className="space-y-4">
                        <div><h4 className="font-bold text-slate-700 text-sm mb-1">{art.subTitle151}</h4><p>{art.content151}</p></div>
                        <div><h4 className="font-bold text-slate-700 text-sm mb-1">{art.subTitle152}</h4><p>{art.content152}</p></div>
                        <div><h4 className="font-bold text-slate-700 text-sm mb-1">{art.subTitle153}</h4><p>{art.content153}</p></div>
                      </div>
                    )}
                    {num === 16 && (
                      <>
                        <p>{art.content1}</p><p>{art.content2}</p><p>{art.content3}</p>
                        <p>{art.content4}</p><p>{art.content5}</p>
                        <p className="italic font-medium">{art.content6}</p>
                      </>
                    )}
                    {num === 17 && (
                      <>
                        <p>{art.content1}</p>
                        <div className="pl-4 space-y-3"><p>{art.itemA}</p><p>{art.itemB}</p></div>
                        <p>{art.content2}</p><p>{art.content3}</p><p>{art.content4}</p>
                        <p className="italic font-medium">{art.content5}</p>
                      </>
                    )}
                    {num === 18 && (
                      <><p>{art.content1}</p><p>{art.content2}</p><p>{art.content3}</p><p>{art.content4}</p></>
                    )}
                    {num === 19 && (
                      <div className="space-y-6">
                        <div className="space-y-3"><p>{art.contentA}</p><p>{art.contentB}</p><p>{art.contentC}</p></div>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{art.subTitle1}</h4>
                          <div className="space-y-2 text-xs text-slate-500 italic">
                            <p>{art.subContent1A}</p><p>{art.subContent1B}</p><p>{art.subContent1C}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                          <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{art.subTitle2}</h4>
                          <div className="space-y-2 text-xs text-slate-500 italic">
                            <p>{art.subContent2A}</p><p>{art.subContent2B}</p><p>{art.subContent2C}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {art.content && ![6, 9, 11, 13, 14, 15, 16, 17, 18, 19].includes(num) && (
                      <p>{art.content}</p>
                    )}
                  </div>
                </section>
              );
            })}

            <section className="mt-12 pt-12 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900/10 flex items-center justify-center text-slate-900">
                  <FileText size={20} />
                </div>
                {t.annexe.title}
              </h3>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>{t.annexe.content1}</p><p>{t.annexe.content2}</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{t.annexe.item1}</li><li>{t.annexe.item2}</li>
                  <li>{t.annexe.item3}</li><li>{t.annexe.item4}</li><li>{t.annexe.item5}</li>
                </ul>
                <p className="italic text-slate-500">{t.annexe.content3}</p>
                <p>{t.annexe.content4}</p>
              </div>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-end gap-2 text-slate-400">
            <p className="text-xs">
              {t.signatureLocationDate.replace('{date}', new Date(contractData?.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }))}
            </p>
            {contractData?.status === 1 && (
              <div className="text-right py-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Signature du Client</p>
                <p className="font-['Caveat',_cursive] text-4xl text-slate-900 mb-1 leading-none transform -rotate-2">
                  {contractData?.user?.first_name} {contractData?.user?.last_name}
                </p>
                <div className="w-56 h-0.5 bg-slate-900/10 rounded-full mt-2" />
              </div>
            )}
            <p className="font-bold text-slate-900 text-sm italic">
              {contractData?.status === 1 ? 'Electronic Signature Verified' : 'Pending Signature'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditUserModal = ({ user, onClose, onUpdate }: { user: User; onClose: () => void; onUpdate: () => void }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    user_phone: user.user_phone || '',
    user_address: user.user_address || '',
    cmg_num: user.cmg_num || '',
    lat: '',
    lng: ''
  });
  const [saving, setSaving] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!addressRef.current || !window.google) return;
    const autocomplete = new window.google.maps.places.Autocomplete(addressRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry']
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        setFormData(prev => ({
          ...prev,
          user_address: place.formatted_address || '',
          lat: place.geometry!.location.lat().toString(),
          lng: place.geometry!.location.lng().toString()
        }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.updateUser(user.id, formData);
      if (response.status) {
        toast.success(response.message || 'User profile updated successfully!');
        onUpdate();
        onClose();
      } else {
        toast.error(response.message || 'Failed to update user profile');
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error('An error occurred while updating the profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Edit2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Edit User Profile</h2>
                <p className="text-xs text-slate-400 font-medium">Update account information for {user.first_name}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-sm font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Phone Number</label>
              <PhoneInput
                country={'fr'}
                value={formData.user_phone}
                onChange={(phone) => setFormData({ ...formData, user_phone: phone })}
                enableSearch={true}
                inputClass="!w-full !h-[48px] !bg-slate-50 !border !border-slate-100 !rounded-xl !text-sm !font-bold !pl-12 focus:!bg-white focus:!ring-2 focus:!ring-slate-900/10 focus:!border-slate-900"
                containerClass="phone-input-container"
                buttonClass="!bg-transparent !border-none !rounded-l-xl"
                searchClass="!bg-white !text-slate-900"
                dropdownClass="!bg-white !text-slate-900 !rounded-xl !shadow-xl !border-slate-100"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  ref={addressRef}
                  type="text"
                  defaultValue={formData.user_address}
                  placeholder="Street address, city..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">CMG Number</label>
              <input
                type="text"
                placeholder="e.g. ABC123456"
                value={formData.cmg_num}
                onChange={(e) => setFormData({ ...formData, cmg_num: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all text-sm font-bold"
              />
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const DeleteConfirmationModal = ({ userName, isDeleting, onClose, onConfirm }: { userName: string; isDeleting: boolean; onClose: () => void; onConfirm: () => void }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden p-8 text-center"
      >
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-2">Delete User?</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Are you sure you want to delete <span className="font-bold text-slate-900">{userName}</span>? 
          This action is permanent and cannot be undone.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full py-4 bg-red-600 text-white text-sm font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, Delete User'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full py-4 bg-slate-50 text-slate-500 text-sm font-bold rounded-2xl hover:bg-slate-100 transition-all"
          >
            No, Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
