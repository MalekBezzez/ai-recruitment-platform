// src/app/core/http/axiosGlobalCache.js
import axios from 'axios';

/**
 * Cache global en mémoire pour les requêtes GET
 * - TTL par défaut: 5 minutes
 * - Invalidation naïve sur POST/PUT/PATCH/DELETE (cache.clear())
 * - Désactiver par requête: config.headers['x-no-cache'] = '1'  (ou config.noCache = true)
 */

const TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

/** Clé: méthode + URL + params + Authorization (pour éviter fuites cross-user) */
function makeKey(config) {
  const method = (config.method || 'get').toLowerCase();
  const url = config.baseURL ? new URL(config.url, config.baseURL).toString() : config.url;
  const params = config.params || null;
  const token = config.headers?.Authorization || '';
  return JSON.stringify([method, url, params, token]);
}

/** Raccourci: est-ce une mutation ? */
function isMutation(method = 'get') {
  const m = method.toLowerCase();
  return m === 'post' || m === 'put' || m === 'patch' || m === 'delete';
}

/** Demande de court-circuit avec réponse cachée */
function resolveFromCache(config, cached) {
  return async () => ({
    data: cached.data,
    status: 200,
    statusText: 'OK',
    headers: cached.headers || {},
    config,
    request: { fromCache: true }
  });
}

/** Interceptor REQUEST */
axios.interceptors.request.use((config) => {
  // Invalidation simple si mutation
  if (isMutation(config.method)) {
    cache.clear();
    return config;
  }

  // Ne pas cacher si explicitement demandé
  if (config.noCache || config.headers?.['x-no-cache'] === '1') {
    return config;
  }

  // GET: tenter de servir depuis le cache
  if ((config.method || 'get').toLowerCase() === 'get') {
    const key = makeKey(config);
    const entry = cache.get(key);
    if (entry && Date.now() - entry.t < TTL) {
      // Court-circuit: on injecte un adapter qui renvoie la réponse cachée
      config.adapter = resolveFromCache(config, entry);
    }
  }
  return config;
});

/** Interceptor RESPONSE */
axios.interceptors.response.use(
  (response) => {
    const { config } = response;
    const method = (config?.method || 'get').toLowerCase();

    // Ne pas enregistrer si déjà fromCache
    if (response?.request?.fromCache) {
      return response;
    }

    // Enregistrer seulement les GET sans x-no-cache
    if (
      method === 'get' &&
      !(config.noCache || config.headers?.['x-no-cache'] === '1')
    ) {
      const key = makeKey(config);
      cache.set(key, { data: response.data, headers: response.headers, t: Date.now() });
    }
    return response;
  },
  (error) => Promise.reject(error)
);

/** Optionnel: API pour vider le cache manuellement */
export function clearAxiosMemoryCache() {
  cache.clear();
}
