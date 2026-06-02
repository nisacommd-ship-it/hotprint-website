'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import { CmsModal, FormField, FormInput, FormTextarea, FormCheckbox, LangTabs } from './cms-modal';

const emptyService = {
  name: '', nameRo: '', nameEn: '',
  slug: '', shortDesc: '', shortDescRo: '', shortDescEn: '',
  fullDesc: '', fullDescRo: '', fullDescEn: '',
  imageUrl: '', icon: '', minPrice: '',
  features: '', featuresRo: '', featuresEn: '',
  featured: false, active: true,
  seoTitle: '', seoDesc: '', seoH1: '',
  aeoAnswer: '', aeoAnswerRo: '', aeoAnswerEn: '',
  faqJson: '', faqJsonRo: '', faqJsonEn: '',
};

export function CmsServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ ...emptyService });
  const [lang, setLang] = useState('ru');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(data?.services ?? []);
    } catch { toast.error('Ошибка загрузки'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ ...emptyService });
    setEditing('new');
    setLang('ru');
  };

  const openEdit = (s: any) => {
    setForm({
      id: s.id, name: s.name || '', nameRo: s.nameRo || '', nameEn: s.nameEn || '',
      slug: s.slug || '', shortDesc: s.shortDesc || '', shortDescRo: s.shortDescRo || '', shortDescEn: s.shortDescEn || '',
      fullDesc: s.fullDesc || '', fullDescRo: s.fullDescRo || '', fullDescEn: s.fullDescEn || '',
      imageUrl: s.imageUrl || '', icon: s.icon || '', minPrice: s.minPrice?.toString() || '',
      features: (s.features || []).join('\n'), featuresRo: (s.featuresRo || []).join('\n'), featuresEn: (s.featuresEn || []).join('\n'),
      featured: s.featured, active: s.active,
      seoTitle: s.seoTitle || '', seoDesc: s.seoDesc || '', seoH1: s.seoH1 || '',
      aeoAnswer: s.aeoAnswer || '', aeoAnswerRo: s.aeoAnswerRo || '', aeoAnswerEn: s.aeoAnswerEn || '',
      faqJson: s.faqJson || '', faqJsonRo: s.faqJsonRo || '', faqJsonEn: s.faqJsonEn || '',
    });
    setEditing(s.id);
    setLang('ru');
  };

  const save = async () => {
    const payload: any = { ...form };
    payload.features = form.features ? form.features.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
    payload.featuresRo = form.featuresRo ? form.featuresRo.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
    payload.featuresEn = form.featuresEn ? form.featuresEn.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];

    try {
      const method = editing === 'new' ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin/services', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editing === 'new' ? 'Услуга создана' : 'Услуга обновлена');
      setEditing(null);
      load();
    } catch (e: any) { toast.error(e.message || 'Ошибка сохранения'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить услугу? Это действие необратимо.')) return;
    try {
      await fetch('/api/admin/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      toast.success('Услуга удалена');
      load();
    } catch { toast.error('Ошибка удаления'); }
  };

  const f = (key: string) => form[key] || '';
  const set = (key: string, val: any) => setForm((prev: any) => ({ ...prev, [key]: val }));

  const nameField = lang === 'ro' ? 'nameRo' : lang === 'en' ? 'nameEn' : 'name';
  const shortDescField = lang === 'ro' ? 'shortDescRo' : lang === 'en' ? 'shortDescEn' : 'shortDesc';
  const fullDescField = lang === 'ro' ? 'fullDescRo' : lang === 'en' ? 'fullDescEn' : 'fullDesc';
  const featuresField = lang === 'ro' ? 'featuresRo' : lang === 'en' ? 'featuresEn' : 'features';
  const aeoField = lang === 'ro' ? 'aeoAnswerRo' : lang === 'en' ? 'aeoAnswerEn' : 'aeoAnswer';
  const faqField = lang === 'ro' ? 'faqJsonRo' : lang === 'en' ? 'faqJsonEn' : 'faqJson';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{services.length} услуг</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
          <Plus className="w-4 h-4" /> Добавить услугу
        </button>
      </div>

      <div className="space-y-2">
        {services.map((s: any) => (
          <div key={s.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {s.imageUrl && <img src={s.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{s.name}</span>
                  {s.featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 shrink-0" />}
                  {!s.active && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Скрыта</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{s.slug} • {s.minPrice ? `от ${s.minPrice} MDL` : 'Без цены'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-gray-100 transition" title="Редактировать">
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={() => remove(s.id)} className="p-2 rounded-lg hover:bg-red-50 transition" title="Удалить">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <CmsModal title={editing === 'new' ? 'Новая услуга' : 'Редактирование услуги'} open={!!editing} onClose={() => setEditing(null)}>
        <LangTabs active={lang} onChange={setLang} />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label={`Название (${lang.toUpperCase()})`}>
              <FormInput value={f(nameField)} onChange={v => set(nameField, v)} placeholder="Название услуги" />
            </FormField>
            {lang === 'ru' && (
              <FormField label="Slug (URL)">
                <FormInput value={f('slug')} onChange={v => set('slug', v)} placeholder="offset-printing" />
              </FormField>
            )}
            {lang !== 'ru' && (
              <FormField label="Оригинал (RU)" hint="Для справки">
                <p className="text-sm text-gray-500 py-2">{f('name') || '—'}</p>
              </FormField>
            )}
          </div>

          <FormField label={`Краткое описание (${lang.toUpperCase()})`}>
            <FormTextarea value={f(shortDescField)} onChange={v => set(shortDescField, v)} rows={2} />
          </FormField>

          <FormField label={`Полное описание (${lang.toUpperCase()})`}>
            <FormTextarea value={f(fullDescField)} onChange={v => set(fullDescField, v)} rows={4} />
          </FormField>

          <FormField label={`Преимущества (${lang.toUpperCase()})`} hint="Каждое преимущество с новой строки">
            <FormTextarea value={f(featuresField)} onChange={v => set(featuresField, v)} rows={4} placeholder="Первое преимущество\nВторое преимущество" />
          </FormField>

          <FormField label={`AEO ответ (${lang.toUpperCase()})`} hint="Блок ответа для поисковиков">
            <FormTextarea value={f(aeoField)} onChange={v => set(aeoField, v)} rows={3} />
          </FormField>

          <FormField label={`FAQ JSON (${lang.toUpperCase()})`} hint='Формат: [{"question":"...","answer":"..."}]'>
            <FormTextarea value={f(faqField)} onChange={v => set(faqField, v)} rows={4} />
          </FormField>

          {lang === 'ru' && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Иконка">
                  <FormInput value={f('icon')} onChange={v => set('icon', v)} placeholder="Printer" />
                </FormField>
                <FormField label="Мин. цена (MDL)">
                  <FormInput value={f('minPrice')} onChange={v => set('minPrice', v)} type="number" placeholder="0" />
                </FormField>
                <FormField label="URL картинки">
                  <FormInput value={f('imageUrl')} onChange={v => set('imageUrl', v)} placeholder="https://i.ytimg.com/vi/MLIbKcPX244/maxresdefault.jpg" />
                </FormField>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField label="SEO Title"><FormInput value={f('seoTitle')} onChange={v => set('seoTitle', v)} /></FormField>
                <FormField label="SEO Description"><FormInput value={f('seoDesc')} onChange={v => set('seoDesc', v)} /></FormField>
                <FormField label="SEO H1"><FormInput value={f('seoH1')} onChange={v => set('seoH1', v)} /></FormField>
              </div>
              <div className="flex gap-6">
                <FormCheckbox label="Избранная" checked={form.featured} onChange={v => set('featured', v)} />
                <FormCheckbox label="Активна" checked={form.active} onChange={v => set('active', v)} />
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
