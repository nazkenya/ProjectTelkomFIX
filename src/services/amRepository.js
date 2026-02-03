// src/services/amRepository.js

import api from '../api/client';

/* =========================
   GET LIST AM
========================= */
export const fetchAMList = async (fields = []) => {
  try {
    const response = await api('/am', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('❌ fetchAMList error:', error);
    throw error;
  }
};

/* =========================
   POST AM (INSERT)
========================= */
export const postAM = async (data) => {
  try {
    console.log('📡 [Repo] postAM payload:', data);

    const response = await api('/am', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    console.log('✅ [Repo] postAM response:', response);
    return response;
  } catch (error) {
    console.error('❌ postAM error:', error);
    throw error;
  }
};

/* =========================
   PUT AM (UPDATE)
========================= */
export const putAM = async (id, data) => {
  try {
    console.log('📡 [Repo] putAM called - ID:', id);
    console.log('📡 [Repo] putAM payload:', data);

    const response = await api(`/am/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    console.log('✅ [Repo] putAM response:', response);
    return response;
  } catch (error) {
    console.error('❌ [Repo] putAM failed:', error);
    throw error;
  }
};

/* =========================
   GET DETAIL AM
========================= */
export const fetchAMDetail = async ({ nik, idSales }) => {
  try {
    const params = new URLSearchParams();
    if (nik) params.append('nik', nik);
    if (idSales) params.append('id_sales', idSales);

    const response = await api(`/am/detail?${params.toString()}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('❌ fetchAMDetail error:', error);
    throw error;
  }
};