'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { CmsModal, FormField, FormInput, FormTextarea, FormCheckbox, LangTabs } from './cms-modal';

const emptyProduct = {
  name: '', nameRo: '', nameEn: '',
  slug: '', description: '', descriptionRo: '', descriptionEn: '',
  category: '', categoryRo: '', categoryEn: '',
  imageUrl: '', minPrice: '', maxPrice: '', printTech: '',
  featured: false, active: true,
};

export function CmsProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ ...emptyProduct });
  const [lang, setLang] = useState('ru');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data?.products ?? []);
    } catch { toast.error('Ошибка загрузки'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...emptyProduct }); setEditing('new'); setLang('ru'); };

  const openEdit = (p: any) => {
    setForm({
      id: p.id, name: p.name || '', nameRo: p.nameRo || '', nameEn: p.nameEn || '',
      slug: p.slug || '', description: p.description || '', descriptionRo: p.descriptionRo || '', descriptionEn: p.descriptionEn || '',
      category: p.category || '', categoryRo: p.categoryRo || '', categoryEn: p.categoryEn || '',
      imageUrl: p.imageUrl || '', minPrice: p.minPrice?.toString() || '', maxPrice: p.maxPrice?.toString() || '',
      printTech: p.printTech || '', featured: p.featured, active: p.active,
    });
    setEditing(p.id); setLang('ru');
  };

  const save = async () => {
    try {
      const method = editing === 'new' ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin/products', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editing === 'new' ? 'Продукт создан' : 'Продукт обновлён');
      setEditing(null); load();
    } catch (e: any) { toast.error(e.message || 'Ошибка'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить продукт?')) return;
    try {
      await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      toast.success('Продукт удалён'); load();
    } catch { toast.error('Ошибка'); }
  };

  const f = (key: string) => form[key] || '';
  const set = (key: string, val: any) => setForm((prev: any) => ({ ...prev, [key]: val }));

  const nameField = lang === 'ro' ? 'nameRo' : lang === 'en' ? 'nameEn' : 'name';
  const descField = lang === 'ro' ? 'descriptionRo' : lang === 'en' ? 'descriptionEn' : 'description';
  const catField = lang === 'ro' ? 'categoryRo' : lang === 'en' ? 'categoryEn' : 'category';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{products.length} продуктов</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
          <Plus className="w-4 h-4" /> Добавить продукт
        </button>
      </div>

      <div className="space-y-2">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {p.imageUrl && <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{p.name}</span>
                  {p.featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />}
                  {!p.active && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Скрыт</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{p.category} • {p.minPrice ? `от ${p.minPrice} MDL` : 'Без цены'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-100 transition"><Edit2 className="w-4 h-4 text-gray-600" /></button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      <CmsModal title={editing === 'new' ? 'Новый продукт' : 'Редактирование продукта'} open={!!editing} onClose={() => setEditing(null)}>
        <LangTabs active={lang} onChange={setLang} />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label={`Название (${lang.toUpperCase()})`}>
              <FormInput value={f(nameField)} onChange={v => set(nameField, v)} placeholder="Название продукта" />
            </FormField>
            <FormField label={`Категория (${lang.toUpperCase()})`}>
              <FormInput value={f(catField)} onChange={v => set(catField, v)} placeholder="Визитки" />
            </FormField>
          </div>

          <FormField label={`Описание (${lang.toUpperCase()})`}>
            <FormTextarea value={f(descField)} onChange={v => set(descField, v)} rows={3} />
          </FormField>

          {lang === 'ru' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Slug (URL)"><FormInput value={f('slug')} onChange={v => set('slug', v)} placeholder="business-cards" /></FormField>
                <FormField label="Технология печати"><FormInput value={f('printTech')} onChange={v => set('printTech', v)} placeholder="offset" /></FormField>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Мин. цена"><FormInput value={f('minPrice')} onChange={v => set('minPrice', v)} type="number" /></FormField>
                <FormField label="Макс. цена"><FormInput value={f('maxPrice')} onChange={v => set('maxPrice', v)} type="number" /></FormField>
                <FormField label="URL картинки"><FormInput value={f('imageUrl')} onChange={v => set('imageUrl', v)} placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Enzyme_inhibitors_2.svg/250px-Enzyme_inhibitors_2.svg.png" /></FormField>
              </div>
              <div className="flex gap-6">
                <FormCheckbox label="Избранный" checked={form.featured} onChange={v => set('featured', v)} />
                <FormCheckbox label="Активен" checked={form.active} onChange={v => set('active', v)} />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Отмена</button>
            <button onClick={save} className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">Сохранить</button>
          </div>
        </div>
      </CmsModal>
    </div>
  );
}
