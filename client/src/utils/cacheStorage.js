// utils/cacheStorage.js

/**
 * Cache API response using Cache Storage API
 * @param {string} key - unique cache key (used as request URL)
 * @param {function} fetchFunction - async function to fetch data
 * @param {number} cacheTime - cache expiry time in ms (default 5 min)
 * @returns {Promise<any>} - cached or fresh data
 */
export const cacheFetchStorage = async (key, fetchFunction, cacheTime = 300000) => {
  try {
    const cache = await caches.open("api-cache"); // Open a named cache
    const cachedResponse = await cache.match(key);

    if (cachedResponse) {
      const cachedData = await cachedResponse.json();
      const cachedTime = cachedData._cachedAt || 0;
      const now = Date.now();

      if (now - cachedTime < cacheTime) {
        // Use cached data if not expired
        return cachedData.data;
      }
    }

    // Fetch fresh data
    const data = await fetchFunction();

    // Store in cache with timestamp
    const response = new Response(
      JSON.stringify({ data, _cachedAt: Date.now() }),
      { headers: { "Content-Type": "application/json" } }
    );

    await cache.put(key, response);

    return data;
  } catch (err) {
    console.error("Cache Storage fetch error:", err);
    return fetchFunction(); // fallback: fetch fresh data
  }
};
