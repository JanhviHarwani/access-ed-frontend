/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUrls, deleteUrl } from '../utils/api';

function ConfirmModal({ open, onCancel, onConfirm, itemType, itemTitle }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="mb-6">Are you sure you want to delete this {itemType}?<br /><span className="font-medium">{itemTitle}</span></p>
        <div className="flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-medium">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminURLs() {
  const [urls, setUrls] = useState([]);
  const { jwt } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    async function loadUrls() {
      try {
        const urlList = await fetchUrls(jwt);
        setUrls(urlList);
      } catch (err) {}
    }
    loadUrls();
  }, [jwt]);

  const handleDeleteClick = (url) => {
    setPendingDelete(url);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUrl(pendingDelete, jwt);
      setUrls(urls => urls.filter(url => !(url.title === pendingDelete.title && url.source_url === pendingDelete.source_url)));
    } catch (err) {
      alert('Failed to delete URL.');
    }
    setModalOpen(false);
    setPendingDelete(null);
  };

  const handleCancelDelete = () => {
    setModalOpen(false);
    setPendingDelete(null);
  };

  return (
    <div>
      <ConfirmModal
        open={modalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemType="URL"
        itemTitle={pendingDelete?.title || ''}
      />
      <h2 className="text-2xl font-bold mb-4">Uploaded URLs</h2>
      {urls.length === 0 ? (
        <div className="text-gray-500">No URLs uploaded yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source URL</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retrieved Date</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {urls.map((url, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 font-medium text-blue-700">
                    {url.source_url ? (
                      <a href={url.source_url} target="_blank" rel="noopener noreferrer" className="underline">
                        {url.title || url.source_url}
                      </a>
                    ) : (
                      url.title
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {url.source_url ? (
                      <a href={url.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        {url.source_url}
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {url.retrieved_date ? new Date(url.retrieved_date).toLocaleDateString() : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDeleteClick(url)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 