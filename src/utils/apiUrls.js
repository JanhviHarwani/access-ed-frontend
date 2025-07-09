// API endpoint URLs for the admin portal

export const API_BASE_URL = process.env.REACT_APP_API_URL;

export const ADMIN_LIST_PDFS = `${API_BASE_URL}/admin/list-pdfs`;
export const ADMIN_DELETE_PDF = `${API_BASE_URL}/admin/delete-pdf`;
export const ADMIN_LIST_URLS = `${API_BASE_URL}/admin/list-urls`;
export const ADMIN_DELETE_URL = `${API_BASE_URL}/admin/delete-url`;
export const ADMIN_UPLOAD_PDF = `${API_BASE_URL}/admin/upload-pdf`;
export const ADMIN_UPLOAD_URL = `${API_BASE_URL}/admin/upload-url`;
export const ADMIN_BULK_UPLOAD_URLS_TEMPLATE = `${API_BASE_URL}/admin/bulk-upload-urls-template`;
export const ADMIN_BULK_UPLOAD_URLS = `${API_BASE_URL}/admin/bulk-upload-urls`;
export const ADMIN_BULK_UPLOAD_URLS_TEMPLATE_DOWNLOAD = `${API_BASE_URL}/admin/bulk-upload-urls-template/download`;
export const CHAT_ENDPOINT = `${API_BASE_URL}/chat`;
export const LOGIN_ENDPOINT = `${API_BASE_URL}/token`;
export const ADMIN_QUICK_ACTIONS = `${API_BASE_URL}/admin/quick-actions`;
export const ADMIN_QUICK_ACTION = (id) => `${API_BASE_URL}/admin/quick-actions/${id}`;
// Add other endpoints as needed 