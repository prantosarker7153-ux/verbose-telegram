import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Movie } from '../types';

interface MovieTileProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (movie: Movie) => void;
}

const MovieTile: React.FC<MovieTileProps> = ({ movie, isFavorite, onToggleFavorite, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.22 }}
      onClick={() => onClick(movie)}
      whileTap={{ scale: 0.93 }}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px' }}
    >
      {/* ── POSTER — 100% clean, no text inside ── */}
      <div style={{
        position: 'relative',
        aspectRatio: '2/3',
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#111827',
        flexShrink: 0,
      }}>
        {/* Shimmer loader */}
        {!loaded && !imgError && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #111827 25%, #1e2a3a 50%, #111827 75%)',
            backgroundSize: '200% 100%',
            animation: 'tileShimmer 1.4s ease-in-out infinite',
          }} />
        )}

        {/* Fallback if image fails */}
        {imgError && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#111827',
          }}>
            <span style={{ fontSize: '28px', opacity: 0.3 }}>🎬</span>
          </div>
        )}

        {/* Poster — full clear, no overlay */}
        <img
          src={movie.thumbnail}
          alt={movie.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => { setImgError(true); setLoaded(true); }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: loaded && !imgError ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: 'block',
          }}
        />

        {/* UPCOMING badge — top left */}
        {movie.isUpcoming && (
          <div style={{
            position: 'absolute', top: 7, left: 0, zIndex: 5,
            background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
            padding: '3px 8px 3px 6px',
            borderRadius: '0 7px 7px 0',
          }}>
            <span style={{
              fontSize: '7px', fontWeight: 900,
              color: '#fff', letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>SOON</span>
          </div>
        )}

        {/* EXCLUSIVE badge */}
        {(movie as any).isExclusive && !movie.isUpcoming && (
          <div style={{
            position: 'absolute', top: 7, left: 0, zIndex: 5,
            background: 'linear-gradient(90deg, #DCB43C, #F59E0B)',
            padding: '3px 8px 3px 6px',
            borderRadius: '0 7px 7px 0',
          }}>
            <span style={{
              fontSize: '7px', fontWeight: 900,
              color: '#000', letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>EXCL</span>
          </div>
        )}

        {/* Fav button — top right */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(movie.id); }}
          style={{
            position: 'absolute', top: 7, right: 7, zIndex: 5,
            width: 28, height: 28, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isFavorite ? 'rgba(239,68,68,0.95)' : 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: 0,
          }}
        >
          <Heart
            size={12}
            style={{ color: '#fff', fill: isFavorite ? '#fff' : 'none', flexShrink: 0 }}
          />
        </button>
      </div>

      {/* ── INFO — completely outside poster ── */}
      <div style={{ padding: '0 1px' }}>
        {/* Title */}
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '11.5px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.92)',
          lineHeight: '1.3',
          marginBottom: '3px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          letterSpacing: '-0.01em',
        }}>
          {movie.title}
        </p>

        {/* Rating + Category */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          flexWrap: 'nowrap', overflow: 'hidden',
        }}>
          <Star size={9} fill="#DCB43C" color="#DCB43C" style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10px', fontWeight: 700,
            color: '#DCB43C', flexShrink: 0,
          }}>
            {movie.rating || '–'}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>·</span>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '9.5px',
            color: 'rgba(255,255,255,0.38)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {movie.category === 'Korean Drama' ? 'K-Drama' : movie.category || ''}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes tileShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default MovieTile;
