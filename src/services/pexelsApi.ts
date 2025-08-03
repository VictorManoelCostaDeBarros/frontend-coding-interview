import { PexelsResponse, Photo } from '@/types';

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const PEXELS_BASE_URL = process.env.NEXT_PUBLIC_PEXELS_BASE_URL || 'https://api.pexels.com/v1';

export const fetchPhotos = async (): Promise<Photo[]> => {
  if (!PEXELS_API_KEY) {
    throw new Error('Pexels API key is not configured. Please set NEXT_PUBLIC_PEXELS_API_KEY in your .env file.');
  }

  try {
    const response = await fetch(
      `${PEXELS_BASE_URL}/search?query=nature&per_page=10`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PexelsResponse = await response.json();
    
    return data.photos.map(photo => ({
      ...photo,
      liked: false,
      alt: photo.alt || 'Nature photo'
    }));
  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
}; 