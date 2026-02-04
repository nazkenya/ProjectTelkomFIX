/**
 * Customer Service
 * Handles business logic for customer operations
 */

import { fetchCustomers } from './customerRepository';

/**
 * GET LIST CUSTOMERS
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search term
 * @param {string} params.witel - Filter by WITEL
 * @param {number} params.limit - Limit results
 * @returns {Promise<Object>} Response with customer data
 */
export async function getCustomers(params = {}) {
  try {
    const res = await fetchCustomers(params);

    if (Array.isArray(res)) {
      return { data: res };
    }

    if (res && Array.isArray(res.data)) {
      return res;
    }

    return { data: [] };
  } catch (error) {
    console.error('❌ Gagal fetch customers:', error);
    return { data: [] };
  }
}

/**
 * GET CUSTOMER BY ID
 * @param {string} id - Customer ID
 * @returns {Promise<Object|null>} Customer data or null
 */
export async function getCustomerById(id) {
  try {
    const res = await fetchCustomers({ id });
    return res?.data?.[0] ?? null;
  } catch (error) {
    console.error(`❌ Gagal fetch customer ${id}:`, error);
    return null;
  }
}

// Export default object for easy import
export default {
  getCustomers,
  getCustomerById
}