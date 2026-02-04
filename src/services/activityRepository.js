/**
 * Activity Repository
 * Handles direct API calls for AM activity operations
 */

import api from '../api/client';

/**
 * FETCH AM ACTIVITIES FROM API
 * @param {string} idSales - AM ID_SALES
 * @returns {Promise<Object>} API response
 */
export const fetchAMActivities = async (idSales) => {
  try {
    const response = await api(`/executive/am/${encodeURIComponent(idSales)}/activities`, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    console.error(`❌ fetchAMActivities error for ${idSales}:`, error);
    throw error;
  }
};

/**
 * CREATE AM ACTIVITY
 * @param {Object} data - Activity payload
 * @returns {Promise<Object>} API response
 */
export const createAMActivity = async (data) => {
  try {
    console.log('📡 [Repo] createAMActivity payload:', data);

    const response = await api('/am-activities', {
      method: 'POST',
      body: JSON.stringify({
        AM_ID: data.amId,
        ACTIVITY_TYPE: data.type || 'visit',
        CUSTOMER_NAME: data.customer || '',
        CUSTOMER_SEGMENT: data.segment || 'B2B',
        DURATION_MINUTES: data.duration || 30,
        NOTES: data.notes || '',
        ACTIVITY_DATE: data.date 
          ? new Date(data.date).toISOString() 
          : new Date().toISOString()
      }),
    });

    console.log('✅ [Repo] createAMActivity response:', response);
    return response;
  } catch (error) {
    console.error('❌ createAMActivity error:', error);
    throw error;
  }
};

/**
 * UPDATE AM ACTIVITY
 * @param {number} activityId - Activity ID
 * @param {Object} data - Update payload
 * @returns {Promise<Object>} API response
 */
export const updateAMActivity = async (activityId, data) => {
  try {
    console.log('📡 [Repo] updateAMActivity called - ID:', activityId);
    console.log('📡 [Repo] updateAMActivity payload:', data);

    const response = await api(`/am-activities/${activityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    console.log('✅ [Repo] updateAMActivity response:', response);
    return response;
  } catch (error) {
    console.error('❌ updateAMActivity error:', error);
    throw error;
  }
};

/**
 * DELETE AM ACTIVITY
 * @param {number} activityId - Activity ID
 * @returns {Promise<Object>} API response
 */
export const deleteAMActivity = async (activityId) => {
  try {
    console.log('📡 [Repo] deleteAMActivity called - ID:', activityId);

    const response = await api(`/am-activities/${activityId}`, {
      method: 'DELETE',
    });

    console.log('✅ [Repo] deleteAMActivity response:', response);
    return response;
  } catch (error) {
    console.error('❌ deleteAMActivity error:', error);
    throw error;
  }
};

// Export default object
export default {
  fetchAMActivities,
  createAMActivity,
  updateAMActivity,
  deleteAMActivity
}