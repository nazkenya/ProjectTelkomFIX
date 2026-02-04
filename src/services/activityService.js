/**
 * Activity Service
 * Handles business logic for AM activity operations
 */

import { 
  fetchAMActivities as repoFetchAMActivities,
  createAMActivity as repoCreateAMActivity,
  updateAMActivity as repoUpdateAMActivity,
  deleteAMActivity as repoDeleteAMActivity 
} from './activityRepository';

/**
 * GET AM ACTIVITIES
 * @param {string} idSales - AM ID_SALES
 * @returns {Promise<Object>} Response with activity data
 */
export async function getAMActivities(idSales) {
  try {
    if (!idSales || idSales.trim() === '') {
      console.warn('⚠️ ID Sales kosong untuk getAMActivities');
      return { data: [] };
    }

    const res = await repoFetchAMActivities(idSales.trim());

    if (Array.isArray(res)) {
      return { data: res };
    }

    if (res && Array.isArray(res.data)) {
      return res;
    }

    return { data: [] };
  } catch (error) {
    console.error(`❌ Gagal fetch activities untuk AM ${idSales}:`, error);
    return { data: [] };
  }
}

/**
 * CREATE AM ACTIVITY
 * @param {Object} payload - Activity data
 * @param {string} payload.amId - AM ID_SALES
 * @param {string} payload.type - Activity type
 * @param {string} payload.customer - Customer name
 * @param {string} payload.segment - Customer segment
 * @param {number} payload.duration - Duration in minutes
 * @param {string} payload.notes - Activity notes
 * @param {string} payload.date - Activity date
 * @returns {Promise<Object>} Created activity
 */
export async function createAMActivity(payload) {
  try {
    console.log('📡 [Service] createAMActivity called:', payload);

    const res = await repoCreateAMActivity(payload);
    
    console.log('✅ [Service] createAMActivity success:', res);
    return res;
  } catch (error) {
    console.error('❌ [Service] createAMActivity failed:', error);
    throw error;
  }
}

/**
 * UPDATE AM ACTIVITY
 * @param {number} activityId - Activity ID
 * @param {Object} payload - Update data
 * @returns {Promise<Object>} Updated activity
 */
export async function updateAMActivity(activityId, payload) {
  try {
    console.log('📡 [Service] updateAMActivity called:', { activityId, payload });

    const res = await repoUpdateAMActivity(activityId, payload);
    
    console.log('✅ [Service] updateAMActivity success:', res);
    return res;
  } catch (error) {
    console.error('❌ [Service] updateAMActivity failed:', error);
    throw error;
  }
}

/**
 * DELETE AM ACTIVITY
 * @param {number} activityId - Activity ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteAMActivity(activityId) {
  try {
    console.log('📡 [Service] deleteAMActivity called:', { activityId });

    const res = await repoDeleteAMActivity(activityId);
    
    console.log('✅ [Service] deleteAMActivity success');
    return res;
  } catch (error) {
    console.error('❌ [Service] deleteAMActivity failed:', error);
    throw error;
  }
}

// Export default object
export default {
  getAMActivities,
  createAMActivity,
  updateAMActivity,
  deleteAMActivity
}