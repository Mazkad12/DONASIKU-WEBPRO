import { STORAGE_URL } from '../services/api';

/**
 * Converts a photo path to a full URL.
 * Handles various cases:
 * - Already a full URL (http/https) - returns as-is
 * - Data URL (base64) - returns as-is
 * - Relative path - prepends STORAGE_URL
 * 
 * @param {string} photoPath - The photo path or URL
 * @returns {string|null} The full URL or null if no path
 */
export const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('data:')) return photoPath;
    // Handle paths that start with 'storage/' 
    if (photoPath.startsWith('storage/')) {
        return `${STORAGE_URL}/${photoPath}`;
    }
    // Handle paths that don't have 'storage/' prefix
    return `${STORAGE_URL}/storage/${photoPath}`;
};

/**
 * Gets the image URL for donation/request images
 * @param {string} imagePath - The image path
 * @returns {string|null} The full URL or null
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;

    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    // Handle 'storage/' prefix
    if (cleanPath.startsWith('storage/')) {
        return `${STORAGE_URL}/${cleanPath}`;
    }

    return `${STORAGE_URL}/${cleanPath}`;
};

export default { getPhotoUrl, getImageUrl };
