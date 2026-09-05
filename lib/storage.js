// lib/storage.js
// AsyncStorage wrapper. Stores the last successful server response so the
// app still shows stretches when the network is unavailable.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STRETCHES_KEY = 'deskreset:stretches';
const SYNCED_KEY = 'deskreset:lastSynced';

export async function saveStretchesToCache(stretches) {
  try {
    // AsyncStorage only stores strings, so objects are serialised to JSON.
    await AsyncStorage.setItem(STRETCHES_KEY, JSON.stringify(stretches));
    await AsyncStorage.setItem(SYNCED_KEY, new Date().toISOString());
  } catch (error) {
    // A failed cache write should never crash the app - the server copy still works.
    console.warn('Could not write cache:', error);
  }
}

export async function loadStretchesFromCache() {
  try {
    const raw = await AsyncStorage.getItem(STRETCHES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Could not read cache:', error);
    return null;
  }
}

export async function getLastSynced() {
  try {
    return await AsyncStorage.getItem(SYNCED_KEY);
  } catch {
    return null;
  }
}

export async function clearCache() {
  await AsyncStorage.multiRemove([STRETCHES_KEY, SYNCED_KEY]);
}