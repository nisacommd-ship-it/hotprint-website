'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Star, MessageSquare, BarChart3, Check, X, Trash2, ChevronDown, RefreshCw, Shield, Building, User as UserIcon, Wrench, Package, FileText, Image as ImageIcon } from 'lucide-react';
import { CmsServices } from './cms-services';
import { CmsProducts } from './cms-products';
import { CmsBlog } from './cms-blog';
import { CmsPortfolio } from './cms-portfolio';
import { toast } from 'sonner';

const tabs = [
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'orders', label: 'Заказы', icon: ShoppingBag },
  { id: 'reviews', label: 'Отзывы', icon: Star },
  { id: 'users', label: 'Пользователи', icon: Users },
  { id: 'contacts', label: 'Заявки', icon: MessageSquare },
  { id: 'services', label: 'Услуги', icon: Wrench },
  { id: 'products', label: 'Продукция', icon: Package },
  { id: 'blog', label: 'Блог', icon: FileText },
  { id: 'portfolio', label: 'Портфолио', icon: ImageIcon },
];

const statusLabels: any = {
  PENDING: 'Ожидает',
  IN_PROGRESS: 'В работе',
  COMPLETED: 'Выполнен',
  CANCELLED: 'Отменён',
};

const statusColors: any = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-500',
};

const roleLabels: any = {
  CLIENT: 'Клиент',
  AGENCY: 'Агентство',
  ADMIN: 'Админ',
};

const roleIcons: any = {
  CLIENT: UserIcon,
  AGENCY: Building,
  ADMIN: Shield,
};

export function AdminClient() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      if (tab === 'stats') {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setStats(data);
      } else if (tab === 'orders') {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        setOrders(data?.orders ?? []);
      } else if (tab === 'reviews') {
        const res = await fetch('/api/admin/reviews');
        const data = await res.json();
        setReviews(data?.reviews ?? []);
      } else if (tab === 'users') {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        setUsers(data?.users ?? []);
      } else if (tab === 'contacts') {
        const res = await fetch('/api/admin/contacts');
        const data = await res.json();
        setContacts(data?.submissions ?? []);
      }
    } catch { toast.error('Ошибка загрузки'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(activeTab); }, [activeTab, fetchData]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      toast.success('Статус обновлён');
      fetchData('orders');
    } catch { toast.error('Ошибка'); }
  };

  const moderateReview = async (id: string, approved: boolean) => {
    try {
      await fetch('/api/admin/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, approved }) });
      toast.success(approved ? 'Отзыв одобрен' : 'Отзыв отклонён');
      fetchData('reviews');
    } catch { toast.error('Ошибка'); }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Удалить отзыв?')) return;
    try {
      await fetch('/api/admin/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      toast.success('Отзыв удалён');
      fetchData('reviews');
    } catch { toast.error('Ошибка'); }
  };

  const changeUserRole = async (id: string, role: string) => {
    try {
      await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, role }) });
      toast.success('Роль изменена');
      fetchData('users');
    } catch { toast.error('Ошибка'); }
  };

  const markContactProcessed = async (id: string) => {
    try {
      await fetch('/api/admin/contacts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'processed' }) });
      toast.success('Отмечено как обработанное');
      fetchData('contacts');
    } catch { toast.error('Ошибка'); }
  };

  return (
    <div className="py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-display font-bold">Админ-панель</h1>
          <button onClick={() => fetchData(activeTab)} className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Обновить
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'
                }`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

          {/* STATS */}
          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Пользователи', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
                { label: 'Заказы', value: stats.totalOrders, sub: `${stats.pendingOrders} ожидают`, icon: ShoppingBag, color: 'text-green-600 bg-green-50' },
                { label: 'Отзывы', value: stats.totalReviews, sub: `${stats.pendingReviews} на модерации`, icon: Star, color: 'text-yellow-600 bg-yellow-50' },
                { label: 'Заявки', value: stats.totalContacts, sub: `${stats.newContacts} новых`, icon: MessageSquare, color: 'text-red-600 bg-red-50' },
              ].map((s: any) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-gray-500">{s.label}</p>
                    {s.sub && <p className="text-xs text-gray-400 mt-1">{s.sub}</p>}
                  </div>
                );
              })}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 && <p className="text-gray-400 text-center py-12">Заказов пока нет</p>}
              {orders.map((o: any) => (
                <div key={o.id} className="bg-white rounded-xl p-5 shadow-sm border">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm">#{o.orderNumber}</p>
                      <p className="text-sm text-gray-600">{o.user?.name} — {o.user?.email}</p>
                      {o.user?.phone && <p className="text-xs text-gray-400">Тел: {o.user.phone}</p>}
                      <p className="text-sm mt-1">{o.product?.name || o.serviceName || '—'} × {o.quantity}</p>
                      {o.description && <p className="text-xs text-gray-500 mt-1">{o.description}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>
                        {statusLabels[o.status]}
                      </span>
                      <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="text-xs border rounded-lg px-2 py-1 bg-white">
                        <option value="PENDING">Ожидает</option>
                        <option value="IN_PROGRESS">В работе</option>
                        <option value="COMPLETED">Выполнен</option>
                        <option value="CANCELLED">Отменён</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(o.createdAt).toLocaleString('ru-RU')}</p>
                </div>
              ))}
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {reviews.length === 0 && <p className="text-gray-400 text-center py-12">Отзывов нет</p>}
              {reviews.map((r: any) => (
                <div key={r.id} className={`bg-white rounded-xl p-5 shadow-sm border ${!r.approved ? 'border-l-4 border-l-yellow-400' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{r.author}</span>
                        {r.company && <span className="text-xs text-gray-400">{r.company}</span>}
                        <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        {!r.approved && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">На модерации</span>}
                      </div>
                      <p className="text-sm text-gray-700">{r.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{r.user?.email} • {new Date(r.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {!r.approved && (
                        <button onClick={() => moderateReview(r.id, true)}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="Одобрить">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {r.approved && (
                        <button onClick={() => moderateReview(r.id, false)}
                          className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition" title="Скрыть">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => deleteReview(r.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition" title="Удалить">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              {users.map((u: any) => {
                const RoleIcon = roleIcons[u.role] || UserIcon;
                return (
                  <div key={u.id} className="bg-white rounded-xl p-5 shadow-sm border">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          u.role === 'ADMIN' ? 'bg-red-100 text-red-600' : u.role === 'AGENCY' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <RoleIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{u.name || '—'}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                          {u.company && <p className="text-xs text-gray-400">{u.company}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs text-gray-400">
                          <p>{u._count?.orders || 0} заказов</p>
                          <p>{u._count?.reviews || 0} отзывов</p>
                        </div>
                        <select value={u.role} onChange={(e) => changeUserRole(u.id, e.target.value)}
                          className="text-xs border rounded-lg px-2 py-1.5 bg-white font-medium">
                          <option value="CLIENT">Клиент</option>
                          <option value="AGENCY">Агентство</option>
                          <option value="ADMIN">Админ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CONTACTS */}
          {activeTab === 'contacts' && (
            <div className="space-y-3">
              {contacts.length === 0 && <p className="text-gray-400 text-center py-12">Заявок нет</p>}
              {contacts.map((c: any) => (
                <div key={c.id} className={`bg-white rounded-xl p-5 shadow-sm border ${c.status === 'new' ? 'border-l-4 border-l-red-400' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm">{c.name}</span>
                        <span className="text-xs text-gray-500">{c.email}</span>
                        {c.phone && <span className="text-xs text-gray-400">{c.phone}</span>}
                        {c.status === 'new' && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Новая</span>}
                      </div>
                      {c.subject && <p className="text-sm font-medium text-gray-700">{c.subject}</p>}
                      <p className="text-sm text-gray-600 mt-1">{c.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleString('ru-RU')}</p>
                    </div>
                    {c.status === 'new' && (
                      <button onClick={() => markContactProcessed(c.id)}
                        className="px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-medium">
                        <Check className="w-3.5 h-3.5 inline mr-1" />Обработано
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CMS Tabs */}
          {activeTab === 'services' && <CmsServices />}
          {activeTab === 'products' && <CmsProducts />}
          {activeTab === 'blog' && <CmsBlog />}
          {activeTab === 'portfolio' && <CmsPortfolio />}

        </motion.div>
      </div>
    </div>
  );
}
