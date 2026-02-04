/**
 * Contact Service
 * Handles business logic for contact operations
 */

import { fetchContacts } from './contactRepository';

/**
 * GET LIST CONTACTS
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search term
 * @param {string} params.company - Filter by company
 * @param {number} params.limit - Limit results
 * @returns {Promise<Object>} Response with contact data
 */
export async function getContacts(params = {}) {
  try {
    const res = await fetchContacts(params);

    if (Array.isArray(res)) {
      return { data: res };
    }

    if (res && Array.isArray(res.data)) {
      return res;
    }

    return { data: [] };
  } catch (error) {
    console.error('❌ Gagal fetch contacts:', error);
    return { data: [] };
  }
}

/**
 * GET CONTACT BY ID
 * @param {string} id - Contact ID
 * @returns {Promise<Object|null>} Contact data or null
 */
export async function getContactById(id) {
  try {
    const res = await fetchContacts({ id });
    return res?.data?.[0] ?? null;
  } catch (error) {
    console.error(`❌ Gagal fetch contact ${id}:`, error);
    return null;
  }
}

// Export default object
export default {
  getContacts,
  getContactById
}