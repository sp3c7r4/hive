/**
 * Pexels Image Search Skill
 * -------------------------
 * A small, typed utility for searching and fetching photos from the Pexels API.
 *
 * SETUP:
 * 1. Add your Pexels API key to `.env.local` (see instructions below this file).
 * 2. Import and call `searchPhotos()` or `getCuratedPhotos()` from a Server
 *    Component, Route Handler, or API route — NEVER from client-side code,
 *    since the key must stay server-only.
 *
 * Docs: https://www.pexels.com/api/documentation/
 */

// ---- Config -----------------------------------------------------------

// PLACEHOLDER: this reads from an environment variable — do NOT hardcode
// your key here. See setup instructions below.
const PEXELS_API_KEY = process.env.PEXELS_API_KEY as string;

const BASE_URL = "https://api.pexels.com/v1";

// ---- Types --------------------------------------------------------------

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

// ---- Core request helper -------------------------------------------------

async function pexelsFetch<T>(path: string): Promise<T> {
  if (!PEXELS_API_KEY) {
    throw new Error(
      "Missing PEXELS_API_KEY. Add it to your .env.local file — see setup instructions."
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: PEXELS_API_KEY },
    // Cache search results for an hour — tune as needed
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ---- Public functions -----------------------------------------------------

/**
 * Search Pexels for photos matching a query.
 * e.g. searchPhotos("web design portrait", { perPage: 5 })
 */
export async function searchPhotos(
  query: string,
  options?: { perPage?: number; page?: number; orientation?: "landscape" | "portrait" | "square" }
): Promise<PexelsPhoto[]> {
  const params = new URLSearchParams({
    query,
    per_page: String(options?.perPage ?? 6),
    page: String(options?.page ?? 1),
  });

  if (options?.orientation) {
    params.set("orientation", options.orientation);
  }

  const data = await pexelsFetch<PexelsSearchResponse>(`/search?${params.toString()}`);
  return data.photos;
}

/**
 * Get Pexels' hand-picked "curated" photos — good for generic hero/background imagery
 * when you don't have a specific search term.
 */
export async function getCuratedPhotos(perPage = 6, page = 1): Promise<PexelsPhoto[]> {
  const data = await pexelsFetch<PexelsSearchResponse>(
    `/curated?per_page=${perPage}&page=${page}`
  );
  return data.photos;
}

/**
 * Fetch a single photo by its Pexels ID.
 */
export async function getPhotoById(id: number): Promise<PexelsPhoto> {
  return pexelsFetch<PexelsPhoto>(`/photos/${id}`);
}
