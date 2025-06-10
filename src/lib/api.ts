// const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// export async function getPosts() {
//   if (!BASE_URL) throw new Error('NEXT_PUBLIC_API_URL is not set');
//   console.log('Fetching posts from:', BASE_URL);
//   const res = await fetch(`${BASE_URL}/posts`);
//   if (!res.ok) throw new Error('Failed to fetch posts');
//   return res.json();
// }


// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPosts() {
  console.log('Fetching posts from:', BASE_URL);
  // Add a check for BASE_URL to provide a clearer error if it's not set
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined. Please set this environment variable.');
  }
  const res = await fetch(`${BASE_URL}/posts`);
  if (!res.ok) {
    // It's good practice to log the response status and text for debugging server errors
    const errorText = await res.text();
    console.error(`Failed to fetch posts: ${res.status} - ${errorText}`);
    throw new Error(`Failed to fetch posts: ${res.statusText}`);
  }
  return res.json();
}