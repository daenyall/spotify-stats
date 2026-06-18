/**
 * spotifyApi.ts — Centralized Spotify Web API service layer.
 *
 * Every function:
 *  • Accepts `token: string` as the first argument.
 *  • Returns clean, typed data (never a raw Response).
 *  • Uses try/catch with array fallback (`|| []`) where appropriate.
 *  • Logs errors to the console for debugging.
 */

const BASE = "https://api.spotify.com/v1";

function headers(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

/* ── Profile ───────────────────────────────────────────────── */
export async function fetchProfile(token: string): Promise<any> {
  try {
    const res = await fetch(`${BASE}/me`, { headers: headers(token) });
    if (!res.ok) throw new Error(`Profile: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("[spotifyApi] fetchProfile error:", err);
    return null;
  }
}

/* ── Top Tracks ────────────────────────────────────────────── */
export async function fetchTopTracks(
  token: string,
  timeRange: string = "short_term",
  limit: number = 50
): Promise<any[]> {
  try {
    const res = await fetch(
      `${BASE}/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
      { headers: headers(token) }
    );
    if (!res.ok) throw new Error(`TopTracks: ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("[spotifyApi] fetchTopTracks error:", err);
    return [];
  }
}

/* ── Top Artists ───────────────────────────────────────────── */
export async function fetchTopArtists(
  token: string,
  timeRange: string = "short_term",
  limit: number = 30
): Promise<any[]> {
  try {
    const res = await fetch(
      `${BASE}/me/top/artists?time_range=${timeRange}&limit=${limit}`,
      { headers: headers(token) }
    );
    if (!res.ok) throw new Error(`TopArtists: ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("[spotifyApi] fetchTopArtists error:", err);
    return [];
  }
}

/* ── Recently Played ───────────────────────────────────────── */
export async function fetchRecentlyPlayed(
  token: string,
  limit: number = 20
): Promise<any[]> {
  try {
    const res = await fetch(
      `${BASE}/me/player/recently-played?limit=${limit}`,
      { headers: headers(token) }
    );
    if (!res.ok) throw new Error(`RecentlyPlayed: ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("[spotifyApi] fetchRecentlyPlayed error:", err);
    return [];
  }
}

/* ── Top Genres (derived from top artists) ─────────────────── */
export async function fetchTopGenres(token: string): Promise<string[]> {
  try {
    const artists = await fetchTopArtists(token, "short_term", 50);
    const genreCounts: Record<string, number> = {};

    artists.forEach((artist: any) => {
      (artist.genres || []).forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre)
      .slice(0, 15);
  } catch (err) {
    console.error("[spotifyApi] fetchTopGenres error:", err);
    return [];
  }
}

/* ── Audio Features (may return 403 for new apps) ──────────── */
export interface AudioFeaturesData {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  [key: string]: any;
}

export async function fetchAudioFeatures(
  token: string,
  trackIds: string[]
): Promise<AudioFeaturesData[] | null> {
  if (trackIds.length === 0) return null;
  try {
    const ids = trackIds.slice(0, 100).join(",");
    const res = await fetch(`${BASE}/audio-features?ids=${ids}`, {
      headers: headers(token),
    });
    if (res.status === 403) {
      console.warn(
        "[spotifyApi] audio-features endpoint returned 403 — " +
          "your app may need Extended Quota Mode."
      );
      return null;
    }
    if (!res.ok) throw new Error(`AudioFeatures: ${res.status}`);
    const data = await res.json();
    return (data.audio_features || []).filter(Boolean);
  } catch (err) {
    console.error("[spotifyApi] fetchAudioFeatures error:", err);
    return null;
  }
}

/* ── Recommendations (may return 403 for new apps) ─────────── */
export async function fetchRecommendations(
  token: string,
  seedArtistIds: string[] = [],
  seedTrackIds: string[] = [],
  limit: number = 20
): Promise<any[]> {
  const params = new URLSearchParams();
  if (seedArtistIds.length > 0)
    params.set("seed_artists", seedArtistIds.slice(0, 5).join(","));
  if (seedTrackIds.length > 0)
    params.set("seed_tracks", seedTrackIds.slice(0, 5).join(","));
  params.set("limit", String(limit));

  try {
    const res = await fetch(`${BASE}/recommendations?${params}`, {
      headers: headers(token),
    });
    if (res.status === 403) {
      console.warn(
        "[spotifyApi] recommendations endpoint returned 403 — " +
          "your app may need Extended Quota Mode."
      );
      return [];
    }
    if (!res.ok) throw new Error(`Recommendations: ${res.status}`);
    const data = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.error("[spotifyApi] fetchRecommendations error:", err);
    return [];
  }
}

/* ── User Playlists ────────────────────────────────────────── */
export async function fetchUserPlaylists(
  token: string,
  limit: number = 50
): Promise<any[]> {
  try {
    const res = await fetch(`${BASE}/me/playlists?limit=${limit}`, {
      headers: headers(token),
    });
    if (!res.ok) throw new Error(`Playlists: ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("[spotifyApi] fetchUserPlaylists error:", err);
    return [];
  }
}

/* ── Playlist Tracks (with pagination for large playlists) ── */
export async function fetchPlaylistTracks(
  token: string,
  playlistId: string
): Promise<any[]> {
  const allItems: any[] = [];
  // SPOTIFY API CHANGE: /tracks is now /items
  let url: string | null =
    `${BASE}/playlists/${playlistId}/items?limit=100`;

  try {
    while (url) {
      const res = await fetch(url, { headers: headers(token) });
      if (!res.ok) {
        const errText = await res.text();
        console.error(`[spotifyApi] PlaylistTracks 403/Error Details:`, errText);
        throw new Error(`PlaylistTracks: ${res.status}`);
      }
      const data = await res.json();
      
      // SPOTIFY API CHANGE: the inner object is now called 'item' instead of 'track'
      const mappedItems = (data.items || []).map((x: any) => ({
        ...x,
        track: x.item || x.track,
      }));
      
      allItems.push(...mappedItems);
      url = data.next; // null when no more pages
    }
    return allItems;
  } catch (err) {
    console.error("[spotifyApi] fetchPlaylistTracks error:", err);
    return allItems; // return whatever we collected so far
  }
}
