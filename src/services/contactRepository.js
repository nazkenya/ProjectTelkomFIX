/**
 * Contact Repository
 * Handles direct API calls for contact operations
 */

import api from '../api/client';

/**
 * FETCH CONTACTS FROM API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export const fetchContacts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(params.search && { search: params.search }),
      ...(params.company && { company: params.company }),
      ...(params.limit && { limit: params.limit }),
      ...(params.id && { id: params.id })
    });

    const response = await api(`/contacts?${queryParams.toString()}`, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('❌ fetchContacts error:', error);
    throw error;
  }
};

// Export default object
export default {
  fetchContacts
}