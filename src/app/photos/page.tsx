'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Photo } from '@/types';
import { fetchPhotos } from '@/services/pexelsApi';
import { Logo } from '@/components/Logo';
import { PhotoCard } from '@/components/PhotoCard';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    const loadPhotos = async () => {
      try {
        setLoading(true);
        const fetchedPhotos = await fetchPhotos();
        setPhotos(fetchedPhotos);
      } catch (err) {
        setError('Failed to load photos. Please try again.');
        console.error('Error loading photos:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, [isAuthenticated, router]);

  const handleLikeToggle = (photoId: number) => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === photoId
          ? { ...photo, liked: !photo.liked }
          : photo
      )
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-[568px] py-9 px-[34px] mx-auto">
        <div className="flex flex-col space-y-6 mb-10">
          <Logo />
          <h1 className="text-xl font-bold text-gray-900">All photos</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading photos...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onLikeToggle={handleLikeToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 