'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { CmsModal, FormField, FormInput, FormTextarea, FormCheckbox } from './cms-modal';

const emptyItem = {
  title: '', slug: '', category: '', description: '',
  imageUrl: '', client: '', technology: '', featured: false,
};

export function CmsPortfolio() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ ...emptyItem });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio');
      const data = await res.json();
      setItems(data?.items ?? []);
    } catch { toast.error('Ошибка загрузки'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...emptyItem }); setEditing('new'); };

  const openEdit = (p: any) => {
    setForm({
      id: p.id, title: p.title || '', slug: p.slug || '',
      category: p.category || '', description: p.description || '',
      imageUrl: p.imageUrl || '', client: p.client || '',
      technology: p.technology || '', featured: p.featured,
    });
    setEditing(p.id);
  };

  const save = async () => {
    try {
      const method = editing === 'new' ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin/portfolio', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editing === 'new' ? 'Работа добавлена' : 'Работа обновлена');
      setEditing(null); load();
    } catch (e: any) { toast.error(e.message || 'Ошибка'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить работу из портфолио?')) return;
    try {
      await fetch('/api/admin/portfolio', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      toast.success('Работа удалена'); load();
    } catch { toast.error('Ошибка'); }
  };

  const f = (key: string) => form[key] || '';
  const set = (key: string, val: any) => setForm((prev: any) => ({ ...prev, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{items.length} работ</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
          <Plus className="w-4 h-4" /> Добавить работу
        </button>
      </div>

      <div className="space-y-2">
        {items.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {p.imageUrl && <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{p.title}</span>
                  {p.featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />}
                </div>
                <p className="text-xs text-gray-400 truncate">{p.category} • {p.client || 'Без клиента'} • {p.technology || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-100 transition"><Edit2 className="w-4 h-4 text-gray-600" /></button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      <CmsModal title={editing === 'new' ? 'Новая работа' : 'Редактирование работы'} open={!!editing} onClose={() => setEditing(null)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Название"><FormInput value={f('title')} onChange={v => set('title', v)} placeholder="Каталог для Winery X" /></FormField>
            <FormField label="Slug (URL)"><FormInput value={f('slug')} onChange={v => set('slug', v)} placeholder="winery-catalog" /></FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="Категория"><FormInput value={f('category')} onChange={v => set('category', v)} placeholder="Полиграфия" /></FormField>
            <FormField label="Клиент"><FormInput value={f('client')} onChange={v => set('client', v)} placeholder="Winery X" /></FormField>
            <FormField label="Технология"><FormInput value={f('technology')} onChange={v => set('technology', v)} placeholder="Офсет + УФ-лак" /></FormField>
          </div>
          <FormField label="Описание"><FormTextarea value={f('description')} onChange={v => set('description', v)} rows={3} /></FormField>
          <FormField label="URL картинки"><FormInput value={f('imageUrl')} onChange={v => set('imageUrl', v)} placeholder="https://pakfactory-blog-media.s3.ca-central-1.amazonaws.com/blog1/wp-content/uploads/2023/07/uncategorized/2023_07_diagram-offset-printing-machine-process.jpg" /></FormField>
          <FormCheckbox label="Избранная работа" checked={form.featured} onChange={v => set('featured', v)} />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Отмена</button>
            <button onClick={save} className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">Сохранить</button>
          </div>
        </div>
      </CmsModal>
    </div>
  );
}
