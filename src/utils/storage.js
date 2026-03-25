import config from './config';

function $key(k) {
  return (config.prefix ? config.prefix + '-' : '') + k;
}

export function getStorageData(key, d) {
  const k = $key(key);

  return localStorage.getItem(k) || d;
}

export function setStorageData(key, value) {
  const k = $key(key);

  try {
    return localStorage.setItem(k, value);
  } catch (e) {}
}

export function removeStorageData(key, value) {
  const k = $key(key);

  return localStorage.removeItem(k, value);
}

export function getSessionStorageData(key, d) {
  const k = $key(key);

  return sessionStorage.getItem(k) || d;
}

export function removeSessionStorageData(key) {
  const k = $key(key);
  
  return sessionStorage.removeItem(k);
}

export function setSessionStorageData(key, value) {
  const k = $key(key);

  try {
    return sessionStorage.setItem(k, value);
  } catch (e) {}
}
