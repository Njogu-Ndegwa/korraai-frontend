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
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxNTIzMjYyLCJpYXQiOjE3NTA5MTg0NjIsImp0aSI6IjM0YjNkOTFiZTVhYTRjODg5YmYyNzg3NWZhYjJlZDE2IiwidXNlcl9pZCI6Ijg4MjgwYTkyLTdhYjItNDVlZC05NmI4LWNjMmZiZDJlZTUzOSIsInRlbmFudF9pZCI6IjQ5NTkyYzA1LWU0ZjYtNGFlMS1iYTIxLTllNTAzNDE3MWZmYSIsInRlbmFudF9uYW1lIjoiU3ByaW5nIEludGVybmF0aW9uYWwgVHJhaW5pbmcgQ29sbGVnZSIsInVzZXJfcm9sZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBzaXRjLmNvbSJ9.VNkG8vgKRxptjK7WZX_vDN33Wg61JA5uqtKy3PSyQxI"

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