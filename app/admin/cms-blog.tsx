'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { CmsModal, FormField, FormInput, FormTextarea, FormCheckbox } from './cms-modal';

const emptyPost = {
  title: '', slug: '', excerpt: '', content: '',
  imageUrl: '', author: 'Hot Print', tags: '',
  published: true, seoTitle: '', seoDesc: '',
};

export function CmsBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({ ...emptyPost });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(data?.posts ?? []);
    } catch { toast.error('Ошибка загрузки'); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ ...emptyPost }); setEditing('new'); };

  const openEdit = (p: any) => {
    setForm({
      id: p.id, title: p.title || '', slug: p.slug || '',
      excerpt: p.excerpt || '', content: p.content || '',
      imageUrl: p.imageUrl || '', author: p.author || 'Hot Print',
      tags: (p.tags || []).join(', '),
      published: p.published, seoTitle: p.seoTitle || '', seoDesc: p.seoDesc || '',
    });
    setEditing(p.id);
  };

  const save = async () => {
    const payload: any = { ...form };
    payload.tags = form.tags ? form.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    try {
      const method = editing === 'new' ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin/blog', {
        method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editing === 'new' ? 'Статья создана' : 'Статья обновлена');
      setEditing(null); load();
    } catch (e: any) { toast.error(e.message || 'Ошибка'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить статью?')) return;
    try {
      await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      toast.success('Статья удалена'); load();
    } catch { toast.error('Ошибка'); }
  };

  const togglePublish = async (p: any) => {
    try {
      await fetch('/api/admin/blog', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, published: !p.published }),
      });
      toast.success(p.published ? 'Статья скрыта' : 'Статья опубликована');
      load();
    } catch { toast.error('Ошибка'); }
  };

  const f = (key: string) => form[key] || '';
  const set = (key: string, val: any) => setForm((prev: any) => ({ ...prev, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{posts.length} статей</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
          <Plus className="w-4 h-4" /> Добавить статью
        </button>
      </div>

      <div className="space-y-2">
        {posts.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {p.imageUrl && <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{p.title}</span>
                  {!p.published && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Черновик</span>}
                </div>
                <p className="text-xs text-gray-400 truncate">{p.slug} • {p.author} • {(p.tags || []).join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => togglePublish(p)} className="p-2 rounded-lg hover:bg-gray-100 transition" title={p.published ? 'Скрыть' : 'Опубликовать'}>
                {p.published ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
              </button>
              <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-gray-100 transition"><Edit2 className="w-4 h-4 text-gray-600" /></button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>

      <CmsModal title={editing === 'new' ? 'Новая статья' : 'Редактирование статьи'} open={!!editing} onClose={() => setEditing(null)}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Заголовок"><FormInput value={f('title')} onChange={v => set('title', v)} placeholder="Заголовок статьи" /></FormField>
            <FormField label="Slug (URL)"><FormInput value={f('slug')} onChange={v => set('slug', v)} placeholder="my-article" /></FormField>
          </div>
          <FormField label="Краткое описание"><FormTextarea value={f('excerpt')} onChange={v => set('excerpt', v)} rows={2} /></FormField>
          <FormField label="Полный текст" hint="Поддерживается HTML-разметка">
            <FormTextarea value={f('content')} onChange={v => set('content', v)} rows={10} />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="URL картинки"><FormInput value={f('imageUrl')} onChange={v => set('imageUrl', v)} placeholder="https://upload.wikimedia.org/wikipedia/commons/c/c3/PrintMus_038.jpg" /></FormField>
            <FormField label="Автор"><FormInput value={f('author')} onChange={v => set('author', v)} /></FormField>
            <FormField label="Теги" hint="Через запятую"><FormInput value={f('tags')} onChange={v => set('tags', v)} placeholder="печать, офсет" /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="SEO Title"><FormInput value={f('seoTitle')} onChange={v => set('seoTitle', v)} /></FormField>
            <FormField label="SEO Description"><FormInput value={f('seoDesc')} onChange={v => set('seoDesc', v)} /></FormField>
          </div>
          <FormCheckbox label="Опубликована" checked={form.published} onChange={v => set('published', v)} />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Отмена</button>
            <button onClick={save} className="px-6 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">Сохранить</button>
          </div>
        </div>
      </CmsModal>
    </div>
  );
}
