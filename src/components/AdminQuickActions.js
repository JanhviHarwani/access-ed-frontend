import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchQuickActions, createQuickAction, updateQuickAction, deleteQuickAction } from '../utils/api';
import TopNav from './TopNav';
import ConfirmModal from './ConfirmModal';
import { Pencil, Trash } from 'lucide-react';

const ICON_OPTIONS = [
  'Book', 'Calendar', 'Users', 'Loader' // Add more as needed
];

export default function AdminQuickActions() {
  const { jwt } = useAuth();
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', message: '', icon: ICON_OPTIONS[0] });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [tab, setTab] = useState('manage');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadQuickActions();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function loadQuickActions() {
    setLoading(true);
    setError('');
    try {
      const actions = await fetchQuickActions(jwt);
      setQuickActions(actions);
    } catch (err) {
      setError('Failed to load quick actions.');
    }
    setLoading(false);
  }

  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(action) {
    setEditingId(action.id);
    setForm({
      title: action.title,
      description: action.description,
      message: action.message,
      icon: action.icon || ICON_OPTIONS[0],
    });
    setTab('manage'); // Switch to the manage tab when editing
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ title: '', description: '', message: '', icon: ICON_OPTIONS[0] });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await updateQuickAction(editingId, form, jwt);
        setSuccess('Quick action updated successfully!');
      } else {
        await createQuickAction(form, jwt);
        setSuccess('Quick action added successfully!');
      }
      await loadQuickActions();
      cancelEdit();
    } catch (err) {
      setError('Failed to save quick action.');
    }
    setSubmitting(false);
  }

  function handleDeleteClick(id) {
    setPendingDeleteId(id);
    setModalOpen(true);
  }

  async function handleConfirmDelete() {
    setError('');
    try {
      await deleteQuickAction(pendingDeleteId, jwt);
      setQuickActions(quickActions.filter(a => a.id !== pendingDeleteId));
    } catch (err) {
      setError('Failed to delete quick action.');
    }
    setModalOpen(false);
    setPendingDeleteId(null);
  }

  function handleCancelDelete() {
    setModalOpen(false);
    setPendingDeleteId(null);
  }

  return (
    <div className="min-h-screen bg-[#f6f5f1]">
      <TopNav />
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
        <h2 className="text-2xl font-bold mb-4">Manage Quick Actions</h2>
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-4 py-2 rounded-t-lg font-medium focus:outline-none ${
              tab === 'manage'
                ? 'bg-amber-700 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTab('manage')}
          >
            Add Quick Action
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-medium focus:outline-none ${
              tab === 'list'
                ? 'bg-amber-700 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => setTab('list')}
          >
            All Quick Actions
          </button>
        </div>
        {error && <div className="bg-red-50 text-red-800 p-3 rounded mb-4">{error}</div>}
        {success && (
          <div className="bg-green-50 text-green-800 p-3 rounded mb-4 font-medium">
            {success}
          </div>
        )}
        {loading ? (
          <div className="py-12 text-center text-amber-700 font-semibold">Loading...</div>
        ) : tab === 'manage' ? (
          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input name="title" value={form.title} onChange={handleInputChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input name="description" value={form.description} onChange={handleInputChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <input name="message" value={form.message} onChange={handleInputChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Icon</label>
              <select name="icon" value={form.icon} onChange={handleInputChange} className="w-full border rounded p-2">
                {ICON_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <button type="submit" disabled={submitting} className="bg-amber-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50">
              {editingId ? 'Update' : 'Add'} Quick Action
            </button>
            {editingId && <button type="button" onClick={cancelEdit} className="ml-2 px-4 py-2 rounded border">Cancel</button>}
          </form>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">All Quick Actions</h3>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-amber-50 to-white sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-amber-700 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-amber-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-amber-700 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-amber-700 uppercase tracking-wider">Icon</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {quickActions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No quick actions found.</td>
                    </tr>
                  ) : quickActions.map(action => (
                    <tr key={action.id} className="hover:bg-amber-50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-pre-line">{action.title}</td>
                      <td className="px-6 py-4 text-gray-700 whitespace-pre-line">{action.description}</td>
                      <td className="px-6 py-4 text-gray-700 whitespace-pre-line">{action.message}</td>
                      <td className="px-6 py-4 text-gray-700">{action.icon}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                        <button
                          onClick={() => startEdit(action)}
                          className="text-blue-600 hover:bg-blue-50 rounded-full p-2 transition"
                          aria-label="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(action.id)}
                          className="text-red-600 hover:bg-red-50 rounded-full p-2 transition"
                          aria-label="Delete"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <ConfirmModal
          open={modalOpen}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          message="Delete this quick action?"
        />
      </div>
    </div>
  );
} 