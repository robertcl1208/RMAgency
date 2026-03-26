'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, getStoredUser, clearTokens } from '@/lib/api/client';
import {
  Users, LayoutGrid, BookOpen, Plus, Trash2, Edit2, Check, X,
  ChevronDown, ChevronRight, LogOut, Shield, Brain,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id: string; name: string; description: string; created_at: string;
}
interface User {
  id: string; email: string; role: string; created_at: string;
}
interface KnowledgeItem {
  id: string; content: string; metadata: object; created_at: string;
}
interface MemoryItem {
  id: string; question: string; answer: string; suggested_by: string; created_at: string;
}

// ── Small reusable components ─────────────────────────────────────────────────
function Badge({ text, variant = 'teal' }: { text: string; variant?: 'teal' | 'amber' | 'slate' }) {
  const cls = {
    teal: 'bg-brand-teal/10 text-brand-teal border-brand-teal/20',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  }[variant];
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cls}`}>{text}</span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal title="Confirm" onClose={onCancel}>
      <p className="text-slate-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm">Delete</button>
      </div>
    </Modal>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [checked, setChecked] = useState(false);

  const [tab, setTab] = useState<'profiles' | 'users' | 'knowledge'>('profiles');

  useEffect(() => {
    const u = getStoredUser();
    if (!u) { router.push('/login'); return; }
    if (u.role !== 'admin') { router.push('/apply'); return; }
    setUser(u);
    setChecked(true);
  }, [router]);

  function handleLogout() {
    api.post('/api/auth/logout').catch(() => {});
    clearTokens();
    router.push('/login');
  }

  if (!checked || !user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-brand-mint via-white to-sky-50/40 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-brand-teal" />
          <span className="font-bold text-lg text-slate-900">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{user.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200 bg-white/50 px-6">
        <nav className="flex gap-1">
          {([
            { key: 'profiles', label: 'Profiles', icon: LayoutGrid },
            { key: 'users', label: 'Users', icon: Users },
            { key: 'knowledge', label: 'Knowledge & Memory', icon: BookOpen },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? 'border-brand-teal text-brand-teal'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'profiles' && <ProfilesTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'knowledge' && <KnowledgeTab />}
      </main>
    </div>
  );
}

// ── Profiles Tab ──────────────────────────────────────────────────────────────
function ProfilesTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Profile[]>('/api/admin/profiles');
      setProfiles(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setForm({ name: '', description: '' });
    setErr('');
    setShowCreate(true);
  }

  function openEdit(p: Profile) {
    setForm({ name: p.name, description: p.description || '' });
    setEditProfile(p);
    setErr('');
  }

  async function handleSave() {
    setSaving(true);
    setErr('');
    try {
      if (editProfile) {
        await api.put(`/api/admin/profiles/${editProfile.id}`, form);
        setEditProfile(null);
      } else {
        await api.post('/api/admin/profiles', form);
        setShowCreate(false);
      }
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/admin/profiles/${deleteTarget.id}`);
      setDeleteTarget(null);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    }
  }

  const formContent = (
    <div className="space-y-4">
      {err && <div className="text-red-700 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{err}</div>}
      <div>
        <label className="block text-sm text-slate-700 mb-1">Name *</label>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm" />
      </div>
      <div>
        <label className="block text-sm text-slate-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
          className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm resize-none" />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={() => { setShowCreate(false); setEditProfile(null); }}
          className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">Cancel</button>
        <button onClick={handleSave} disabled={saving || !form.name}
          className="px-4 py-2 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-dark disabled:opacity-50 text-sm">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Profiles</h2>
        <button onClick={openCreate} className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> New Profile
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500 text-center py-12">Loading…</div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <LayoutGrid size={40} className="mx-auto mb-3 opacity-40" />
          <p>No profiles yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map(p => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-bold">
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <p className="font-semibold text-slate-900">{p.name}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <Modal title="New Profile" onClose={() => setShowCreate(false)}>{formContent}</Modal>}
      {editProfile && <Modal title="Edit Profile" onClose={() => setEditProfile(null)}>{formContent}</Modal>}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete profile "${deleteTarget.name}"? This will also delete all knowledge, memory, and chat history for this profile.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [permUser, setPermUser] = useState<User | null>(null);
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, p] = await Promise.all([
        api.get<User[]>('/api/admin/users'),
        api.get<Profile[]>('/api/admin/profiles'),
      ]);
      setUsers(u);
      setProfiles(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function openPerms(u: User) {
    setPermUser(u);
    const data = await api.get<{ profile_id: string }[]>(`/api/admin/users/${u.id}/permissions`);
    setUserPerms(data.map(d => d.profile_id));
  }

  async function savePerms() {
    if (!permUser) return;
    setSaving(true);
    try {
      await api.put(`/api/admin/users/${permUser.id}/permissions`, { profile_ids: userPerms });
      setPermUser(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setErr('');
    try {
      if (editUser) {
        const updates: Record<string, string> = { role: form.role };
        if (form.email) updates.email = form.email;
        if (form.password) updates.password = form.password;
        await api.put(`/api/admin/users/${editUser.id}`, updates);
        setEditUser(null);
      } else {
        await api.post('/api/admin/users', form);
        setShowCreate(false);
      }
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/admin/users/${deleteTarget.id}`);
      setDeleteTarget(null);
      load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    }
  }

  const userForm = (
    <div className="space-y-4">
      {err && <div className="text-red-700 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{err}</div>}
      <div>
        <label className="block text-sm text-slate-700 mb-1">Email{editUser ? ' (leave blank to keep)' : ' *'}</label>
        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm" />
      </div>
      <div>
        <label className="block text-sm text-slate-700 mb-1">Password{editUser ? ' (leave blank to keep)' : ' *'}</label>
        <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm" />
      </div>
      <div>
        <label className="block text-sm text-slate-700 mb-1">Role</label>
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={() => { setShowCreate(false); setEditUser(null); }}
          className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">Cancel</button>
        <button onClick={handleSave} disabled={saving}
          className="px-4 py-2 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-dark disabled:opacity-50 text-sm">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Users</h2>
        <button onClick={() => { setForm({ email: '', password: '', role: 'user' }); setErr(''); setShowCreate(true); }}
          className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> New User
        </button>
      </div>

      {loading ? (
        <div className="text-slate-500 text-center py-12">Loading…</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 bg-slate-50">
                <th className="text-left px-5 py-3.5 font-medium">Email</th>
                <th className="text-left px-5 py-3.5 font-medium">Role</th>
                <th className="text-left px-5 py-3.5 font-medium">Joined</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-slate-900">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <Badge text={u.role} variant={u.role === 'admin' ? 'amber' : 'teal'} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openPerms(u)} title="Manage permissions"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-teal hover:bg-slate-100 transition-colors">
                        <Shield size={15} />
                      </button>
                      <button onClick={() => { setForm({ email: u.email, password: '', role: u.role }); setErr(''); setEditUser(u); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(u)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && <Modal title="New User" onClose={() => setShowCreate(false)}>{userForm}</Modal>}
      {editUser && <Modal title="Edit User" onClose={() => setEditUser(null)}>{userForm}</Modal>}
      {deleteTarget && (
        <ConfirmModal
          message={`Delete user "${deleteTarget.email}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {permUser && (
        <Modal title={`Permissions for ${permUser.email}`} onClose={() => setPermUser(null)}>
          <p className="text-sm text-slate-500 mb-4">Select which profiles this user can access:</p>
          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {profiles.map(p => (
              <label key={p.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <input type="checkbox" checked={userPerms.includes(p.id)}
                  onChange={e => setUserPerms(prev => e.target.checked ? [...prev, p.id] : prev.filter(x => x !== p.id))}
                  className="w-4 h-4 accent-brand-teal" />
                <span className="text-slate-900 text-sm">{p.name}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setPermUser(null)} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">Cancel</button>
            <button onClick={savePerms} disabled={saving} className="px-4 py-2 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-dark disabled:opacity-50 text-sm">
              {saving ? 'Saving…' : 'Save Permissions'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Knowledge Tab ─────────────────────────────────────────────────────────────
function KnowledgeTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [loadingK, setLoadingK] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState('');
  const [activeSection, setActiveSection] = useState<'knowledge' | 'memory'>('knowledge');

  useEffect(() => {
    api.get<Profile[]>('/api/admin/profiles').then(setProfiles).catch(() => {});
  }, []);

  const loadKnowledge = useCallback(async (id: string) => {
    setLoadingK(true);
    try {
      const [k, m] = await Promise.all([
        api.get<KnowledgeItem[]>(`/api/admin/profiles/${id}/knowledge`),
        api.get<MemoryItem[]>(`/api/admin/profiles/${id}/memory`),
      ]);
      setKnowledge(k);
      setMemory(m);
    } finally {
      setLoadingK(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) loadKnowledge(selectedId);
  }, [selectedId, loadKnowledge]);

  async function handleAddKnowledge() {
    if (!newContent.trim() || !selectedId) return;
    setAdding(true);
    setAddErr('');
    try {
      await api.post(`/api/admin/profiles/${selectedId}/knowledge`, { content: newContent.trim() });
      setNewContent('');
      loadKnowledge(selectedId);
    } catch (e) {
      setAddErr(e instanceof Error ? e.message : 'Error adding knowledge');
    } finally {
      setAdding(false);
    }
  }

  async function deleteKnowledge(kid: string) {
    await api.delete(`/api/admin/profiles/${selectedId}/knowledge/${kid}`);
    loadKnowledge(selectedId);
  }

  async function deleteMemory(mid: string) {
    await api.delete(`/api/admin/profiles/${selectedId}/memory/${mid}`);
    loadKnowledge(selectedId);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile selector */}
      <div className="lg:col-span-1">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Select Profile</h2>
        <div className="space-y-2">
          {profiles.map(p => (
            <button key={p.id} onClick={() => setSelectedId(p.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-center justify-between ${
                selectedId === p.id
                  ? 'border-brand-teal bg-brand-teal/5 text-brand-teal'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-brand-teal/40 shadow-sm'
              }`}>
              <span className="font-medium text-sm">{p.name}</span>
              {selectedId === p.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge/memory panel */}
      <div className="lg:col-span-2">
        {!selectedId ? (
          <div className="flex items-center justify-center h-full text-slate-400 py-20">
            <div className="text-center">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              <p>Select a profile to manage its knowledge</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Add knowledge form */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Plus size={16} className="text-brand-teal" /> Add Knowledge
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Paste any information about this profile. The AI will analyze and index it automatically.
              </p>
              {addErr && <div className="text-red-700 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-3">{addErr}</div>}
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={5}
                placeholder="Enter information about this profile…"
                className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-teal text-sm resize-none mb-3"
              />
              <button onClick={handleAddKnowledge} disabled={adding || !newContent.trim()}
                className="flex items-center gap-2 bg-brand-teal hover:bg-brand-teal-dark disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {adding ? 'Saving…' : <><Plus size={15} /> Add Knowledge</>}
              </button>
            </div>

            {/* Toggle: knowledge / memory */}
            <div className="flex gap-2 mb-4">
              <button onClick={() => setActiveSection('knowledge')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'knowledge' ? 'bg-brand-teal text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                <BookOpen size={15} /> Knowledge ({knowledge.length})
              </button>
              <button onClick={() => setActiveSection('memory')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'memory' ? 'bg-brand-teal text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                <Brain size={15} /> Memory ({memory.length})
              </button>
            </div>

            {loadingK ? (
              <div className="text-slate-500 text-sm py-8 text-center">Loading…</div>
            ) : activeSection === 'knowledge' ? (
              <div className="space-y-3">
                {knowledge.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No knowledge added yet.</p>
                ) : knowledge.map(k => (
                  <div key={k.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-relaxed">{k.content}</p>
                      <p className="text-xs text-slate-400 mt-2">{new Date(k.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={() => deleteKnowledge(k.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {memory.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No memory items yet.</p>
                ) : memory.map(m => (
                  <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-brand-teal mb-1">Q: {m.question}</p>
                      <p className="text-sm text-slate-700 leading-relaxed">A: {m.answer}</p>
                      <p className="text-xs text-slate-400 mt-2">{new Date(m.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={() => deleteMemory(m.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
