// lib/api.js
// Every network call in the app goes through here.
// Screens never call fetch() directly - they call these functions.

import { API_URL, REQUEST_TIMEOUT_MS } from '../constants/api';

async function request(path, options = {}) {
  // AbortController lets us give up if the server never answers,
  // instead of leaving the spinner on screen forever.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options,
    });

    // fetch only rejects on network failure, so a 404 or 500 has to be
    // turned into an error manually.
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    if (response.status === 204) return null;
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

// GET - the whole list
export function fetchStretches() {
  return request('/stretches');
}

// GET - one item
export function fetchStretch(id) {
  return request(`/stretches/${id}`);
}

// POST - create
export function createStretch(stretch) {
  return request('/stretches', {
    method: 'POST',
    body: JSON.stringify(stretch),
  });
}

// PUT - update
export function updateStretch(id, changes) {
  return request(`/stretches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(changes),
  });
}

// DELETE - remove
export function deleteStretch(id) {
  return request(`/stretches/${id}`, { method: 'DELETE' });
}