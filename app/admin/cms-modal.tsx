'use client';

import { X } from 'lucide-react';

export function CmsModal({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function FormInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
  );
}

export function FormTextarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-y" />
  );
}

export function FormCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
      <span className="text-sm">{label}</span>
    </label>
  );
}

export function LangTabs({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 mb-4">
      {[{ id: 'ru', label: '🇷🇺 RU' }, { id: 'ro', label: '🇲🇩 RO' }, { id: 'en', label: '🇬🇧 EN' }].map(l => (
        <button key={l.id} type="button" onClick={() => onChange(l.id)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${active === l.id ? 'bg-white shadow-sm text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
          {l.label}
        </button>
      ))}
    </div>
  );
}
