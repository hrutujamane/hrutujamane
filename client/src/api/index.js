import axios from 'axios';
import { getUser } from '../utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 60000, // AI can take a while
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user && user.email) {
      config.headers['x-user-email'] = user.email;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Submit an internship listing for AI analysis
 * @param {Object} payload - { inputType, companyName, jobTitle, listingText?, listingUrl? }
 * @returns {Promise<Object>} Analysis result
 */
export async function analyzeInternship(payload) {
  const { data } = await api.post('/analyze', payload);
  return data;
}

/**
 * Retrieve a previous analysis by ID
 */
export async function getAnalysis(id) {
  const { data } = await api.get(`/analyze/${id}`);
  return data;
}

/**
 * Get platform-wide statistics
 */
export async function getPlatformStats() {
  const { data } = await api.get('/reports/stats');
  return data;
}

export default api;
