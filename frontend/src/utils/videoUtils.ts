/**
 * High-Performance Video & Cloudinary Utility Engine
 * Provides URL parsing, high-fidelity transformation injection, and automatic HD thumbnail generation.
 */

/**
 * Checks if a URL is hosted on Cloudinary
 */
export function isCloudinary(url: string): boolean {
  if (!url) return false;
  return /cloudinary\.com/i.test(url);
}

/**
 * Checks if a URL is a YouTube or YouTube Shorts video
 */
export function isYouTube(url: string): boolean {
  if (!url) return false;
  return /youtube\.com|youtu\.be/i.test(url);
}

/**
 * Extracts the 11-character YouTube video ID
 */
export function getYouTubeId(url: string): string {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}

/**
 * Gets high-quality YouTube Embed URL
 */
export function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  return url;
}

/**
 * Gets YouTube MaxRes thumbnail
 */
export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  if (id) {
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  }
  return '';
}

/**
 * Checks if a URL is an Instagram post or reel
 */
export function isInstagram(url: string): boolean {
  if (!url) return false;
  return /instagram\.com\/(p|reel|reels|tv)\//i.test(url);
}

/**
 * Checks if a URL is Vimeo
 */
export function isVimeo(url: string): boolean {
  if (!url) return false;
  return /vimeo\.com\//i.test(url);
}

/**
 * Gets Vimeo Embed URL
 */
export function getVimeoEmbedUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/vimeo\.com\/(\d+)/i);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1&color=a855f7&title=0&byline=0&portrait=0`;
  }
  return url;
}

/**
 * Determines if the URL represents a direct video stream (Cloudinary, local MP4, WebM, etc.)
 */
export function isVideoFile(url: string): boolean {
  if (!url) return false;
  if (isCloudinary(url)) return true;
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) return true;
  if (url.startsWith('/uploads/') || url.startsWith('blob:') || url.startsWith('data:video/')) return true;
  if (url.startsWith('http') && !isYouTube(url) && !isInstagram(url) && !isVimeo(url) && !/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url)) {
    return true;
  }
  return false;
}

/**
 * Injects Cloudinary High-Quality Video Transformations.
 * Uses `q_auto:best` to guarantee crisp details, sharp cuts, and uncompromised color grades,
 * along with `f_auto` and `vc_auto` for optimal modern codec delivery without buffering.
 */
export function getCloudinaryOptimizedVideo(
  url: string,
  options?: {
    maxWidth?: number;
    quality?: 'best' | 'good' | 'eco';
  }
): string {
  if (!url || !isCloudinary(url)) return url;

  // Pattern: https://res.cloudinary.com/<cloud_name>/video/upload/[transforms/]v[version]/[path]
  const uploadMarker = '/video/upload/';
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) return url;

  const quality = options?.quality || 'best';
  const widthTransform = options?.maxWidth ? `,w_${options.maxWidth},c_limit` : '';
  const transformString = `q_auto:${quality},f_auto,vc_auto${widthTransform}`;

  const prefix = url.substring(0, uploadIndex + uploadMarker.length);
  const remainder = url.substring(uploadIndex + uploadMarker.length);

  // If URL already has our transformations, return it
  if (remainder.startsWith(transformString + '/')) {
    return url;
  }

  return `${prefix}${transformString}/${remainder}`;
}

/**
 * Automatically extracts a crystal-clear HD video frame from Cloudinary at a specific timestamp (default second 1.0)
 * and formats it as an image (.jpg / .webp).
 */
export function getCloudinaryPosterUrl(url: string, second: number = 1): string {
  if (!url || !isCloudinary(url)) return '';

  const uploadMarker = '/video/upload/';
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) return '';

  const prefix = url.substring(0, uploadIndex + uploadMarker.length);
  let remainder = url.substring(uploadIndex + uploadMarker.length);

  // Replace video extension with .jpg for image frame capture
  remainder = remainder.replace(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i, '.jpg');

  // Insert second offset and high-res image transformation
  const transform = `so_${second},q_auto:best,f_auto`;

  return `${prefix}${transform}/${remainder}`;
}

/**
 * Returns the best high-resolution thumbnail available for any video link
 */
export function getAutoThumbnail(url: string, fallback: string = ''): string {
  if (!url) return fallback;

  if (isCloudinary(url)) {
    const poster = getCloudinaryPosterUrl(url, 1);
    if (poster) return poster;
  }

  if (isYouTube(url)) {
    const ytThumb = getYouTubeThumbnail(url);
    if (ytThumb) return ytThumb;
  }

  if (isInstagram(url)) {
    return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200';
  }

  return fallback;
}
