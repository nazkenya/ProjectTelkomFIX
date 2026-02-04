/**
 * Customer Repository
 * Handles direct API calls for customer operations
 */

import api from '../api/client';

/**
 * FETCH CUSTOMERS FROM API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export const fetchCustomers = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(params.search && { search: params.search }),
      ...(params.witel && { witel: params.witel }),
      ...(params.limit && { limit: params.limit }),
      ...(params.id && { id: params.id })
    });

    const response = await api(`/customers?${queryParams.toString()}`, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error('❌ fetchCustomers error:', error);
    throw error;
  }
};

// Export default object
export default {
  fetchCustomers
}