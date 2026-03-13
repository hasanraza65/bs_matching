import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Clock,
  CheckCircle2,
  AlertCircle,
  Baby,
  User,
  Shield,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminPage = 'dashboard' | 'requests' | 'interviews' | 'invoices' | 'tax' | 'users';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'All Requests', icon: ClipboardList },
    // { id: 'interviews', label: 'Interviews', icon: Calendar },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'tax', label: 'Tax Certificates', icon: FileText },
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
              {activePage.replace('-', ' ')}
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
              {activePage === 'requests' && <RequestsView />}
              {activePage === 'interviews' && <InterviewsView />}
              {activePage === 'invoices' && <InvoicesView />}
              {activePage === 'tax' && <TaxCertificatesView />}
              {activePage === 'users' && <UsersView />}
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
                  <User size={18} />
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

const RequestsView = () => {
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [requests, setRequests] = useState<import('../services/api').ParentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const fetchRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { api } = await import('../services/api');
        const result = await api.getParentRequests();
        if (!cancelled) {
          setRequests(result.data);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load requests. Please try again.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchRequests();
    return () => { cancelled = true; };
  }, []);

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
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Family Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Children</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Dates</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center gap-3 text-slate-400">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
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
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {req.user.first_name} {req.user.last_name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {req.children.length}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <ScheduleDatesCell schedules={req.schedules ?? []} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                          {req.board_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical size={18} />
                        </button>
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
    </div>
  );
};

// --- Helper: Schedule Dates Cell ---

interface ScheduleDatesCellProps {
  schedules: import('../services/api').Schedule[];
}

const MAX_VISIBLE_DATES = 4;

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

const TaxCertificatesView = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="bg-white border border-slate-200 text-sm font-bold rounded-xl px-4 py-2 outline-none">
            <option>Year 2024</option>
            <option>Year 2023</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Tax Certificate Q{i}</p>
                <p className="text-xs text-slate-400">Generated on 01/03/2026</p>
              </div>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white rounded-xl transition-all">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersView = () => {
  const [activeTab, setActiveTab] = useState<'families' | 'sitters' | 'admins'>('families');

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-100 w-fit">
        {['families', 'sitters', 'admins'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4].map((i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">User Name {i}</td>
                  <td className="px-6 py-4 text-slate-600">user{i}@example.com</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
