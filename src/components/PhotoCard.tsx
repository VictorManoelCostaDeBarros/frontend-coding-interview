'use client';

import React, { useState } from 'react';
import { Photo } from '@/types';
import Image from 'next/image';

interface PhotoCardProps {
  photo: Photo;
  onLikeToggle: (photoId: number) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onLikeToggle }) => {
  const [imageError, setImageError] = useState(false);

  const handleLikeToggle = () => {
    onLikeToggle(photo.id);
  };

  return (
    <div className="flex items-start space-x-3">
      <button
        onClick={handleLikeToggle}
        className="hover:bg-gray-100 rounded transition-colors"
        aria-label={photo.liked ? 'Unlike photo' : 'Like photo'}
      >
        {photo.liked ? (
          <Image
            src="/images/star-filled.svg"
            alt="Filled star"
            width={19}
            height={18}
          />
        ) : (
          <Image
            src="/images/star-outline.svg"
            alt="Outline star"
            width={19}
            height={18}
          />
        )}
      </button>

      <div className="relative w-[75px] h-[75px] rounded-lg overflow-hidden bg-gray-200">
        {!imageError ? (
          <Image
            src={photo.src.medium}
            alt={photo.alt}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">Image</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">
              {photo.photographer}
            </h3>
            <p className="text-sm text-gray-900 mt-2 truncate">
              {photo.alt}
            </p>
            <div className="flex items-center mt-2">
              <p className="text-sm text-gray-500">
                #{photo.avg_color.replace('#', '')}
              </p>
              <div 
                className="w-3 h-3 rounded ml-2" 
                style={{ backgroundColor: photo.avg_color }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center ml-6">
            <Image
              src="/images/link-icon.png"
              alt="Link icon"
              width={12}
              height={12}
              className="mr-1"
            />
            <a
              href={photo.photographer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Portfolio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 