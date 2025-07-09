import { ADMIN_LIST_PDFS, ADMIN_DELETE_PDF } from './apiUrls';
import { ADMIN_LIST_URLS, ADMIN_DELETE_URL } from './apiUrls';
import {
  ADMIN_UPLOAD_PDF,
  ADMIN_UPLOAD_URL,
  ADMIN_BULK_UPLOAD_URLS_TEMPLATE,
  ADMIN_BULK_UPLOAD_URLS,
  ADMIN_BULK_UPLOAD_URLS_TEMPLATE_DOWNLOAD,
  CHAT_ENDPOINT,
  LOGIN_ENDPOINT,
  ADMIN_QUICK_ACTIONS,
  ADMIN_QUICK_ACTION
} from './apiUrls';

export async function fetchPdfs(jwt) {
  const res = await fetch(ADMIN_LIST_PDFS, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) throw new Error('Failed to fetch PDFs');
  const data = await res.json();
  return data.pdfs || [];
}

export async function deletePdf({ title, source_url }, jwt) {
  const res = await fetch(ADMIN_DELETE_PDF, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ title, source_url }),
  });
  if (!res.ok) throw new Error('Failed to delete PDF');
  return true;
}

export async function fetchUrls(jwt) {
  const res = await fetch(ADMIN_LIST_URLS, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) throw new Error('Failed to fetch URLs');
  const data = await res.json();
  return data.urls || [];
}

export async function deleteUrl({ title, source_url }, jwt) {
  const res = await fetch(ADMIN_DELETE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ title, source_url }),
  });
  if (!res.ok) throw new Error('Failed to delete URL');
  return true;
}

export async function uploadPdf({ file, title, sourceUrl }, jwt) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  formData.append('source_url', sourceUrl);
  const res = await fetch(ADMIN_UPLOAD_PDF, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error('Upload failed');
  return result;
}

export async function uploadUrl({ url, title }, jwt) {
  const formData = new FormData();
  formData.append('url', url);
  formData.append('title', title);
  const res = await fetch(ADMIN_UPLOAD_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });
  const result = await res.json();
  if (!res.ok || !result.success) throw new Error(result.message || 'Failed to process URL');
  return result;
}

export async function fetchBulkInstructions() {
  const res = await fetch(ADMIN_BULK_UPLOAD_URLS_TEMPLATE);
  if (!res.ok) throw new Error('Failed to fetch instructions');
  const data = await res.json();
  return data.instructions;
}

export async function uploadBulkUrls(bulkFile, jwt) {
  const formData = new FormData();
  formData.append('file', bulkFile);
  const res = await fetch(ADMIN_BULK_UPLOAD_URLS, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error('Bulk upload failed');
  return result.results || [];
}

export async function downloadBulkTemplate(jwt) {
  const res = await fetch(ADMIN_BULK_UPLOAD_URLS_TEMPLATE_DOWNLOAD, {
    method: 'GET',
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) throw new Error('Failed to download template');
  return await res.blob();
}

export async function sendChatMessage({ message, history, jwt }) {
  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({ message, history }),
  });
  if (res.status === 401) {
    const error = new Error('Authentication failed');
    error.status = 401;
    throw error;
  }
  if (!res.ok) throw new Error('Failed to get response');
  return await res.json();
}

export async function loginUser(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const res = await fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to sign in. Please check your credentials.');
  return await res.json();
}

export async function fetchQuickActions(jwt) {
  const res = await fetch(ADMIN_QUICK_ACTIONS, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) throw new Error('Failed to fetch quick actions');
  const data = await res.json();
  return data.quick_actions || [];
}

export async function createQuickAction(action, jwt) {
  const res = await fetch(ADMIN_QUICK_ACTIONS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(action),
  });
  if (!res.ok) throw new Error('Failed to create quick action');
  return await res.json();
}

export async function updateQuickAction(id, action, jwt) {
  const res = await fetch(ADMIN_QUICK_ACTION(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(action),
  });
  if (!res.ok) throw new Error('Failed to update quick action');
  return await res.json();
}

export async function deleteQuickAction(id, jwt) {
  const res = await fetch(ADMIN_QUICK_ACTION(id), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${jwt}` },
  });
  if (!res.ok) throw new Error('Failed to delete quick action');
  return await res.json();
} 