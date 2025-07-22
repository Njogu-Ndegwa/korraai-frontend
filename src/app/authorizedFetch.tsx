// src/lib/api.ts

const API_BASE_URL = 'https://korraai.bitwavetechnologies.com/api';

/**
 * A wrapper around the native fetch function that automatically adds
 * the Authorization header for authenticated API requests.
 * @param endpoint The API endpoint to call (e.g., '/conversations/some-id/messages/')
 * @param options The standard options object for a fetch request (method, body, etc.)
 * @returns The JSON response from the API.
 */
export const authorizedFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Retrieve the authentication token from where you stored it after login.
  // localStorage is a common place, but it could also be sessionStorage or a state manager.
  const token = localStorage.getItem('access_token') || '';

  // Prepare the default headers for our requests.
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // If a token exists, add the 'Authorization' header.
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  } else {
    // If no token is found, you might want to handle this case,
    // for example by redirecting to the login page.
    console.warn("No authentication token found for API request.");
  }

  // Merge the default headers with any custom headers passed in the options.
  // This allows you to override or add headers on a per-call basis if needed.
  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Construct the full URL and make the API call.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  // Check if the request was successful.
  if (!response.ok) {
    // If not, try to parse the error body for a more specific message.
    const errorBody = await response.json().catch(() => ({ 
      message: 'An unknown API error occurred.' 
    }));
    console.error("API Error:", errorBody);
    throw new Error(`API call failed: ${errorBody.message || response.statusText}`);
  }
  
  // If the request is successful but there's no content (e.g., for a DELETE request),
  // return null to avoid a JSON parsing error.
  if (response.status === 204) { // 204 No Content
      return null;
  }

  // If everything is OK, parse and return the JSON response.
  return response.json();
};