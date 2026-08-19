"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";

/* ──────────────────────────────── types ──────────────────────────────── */
interface VideoPlayerProps {
  /** Path or URL to the video file */
  src: string;
  /** Optional poster image */
  poster?: string;
  /** Optional additional className for the wrapper */
  className?: string;
}

/* ──────────────────────────────── helpers ─────────────────────────────── */
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/* ──────────────────────────────── component ───────────────────────────── */
export default function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── state ─── */
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isVolumeScrubbing, setIsVolumeScrubbing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  /* ─── auto-hide controls ─── */
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    } else {
      resetHideTimer();
    }
  }, [isPlaying, resetHideTimer]);

  /* ─── video event handlers ─── */
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v) setDuration(v.duration);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || isScrubbing) return;
    setCurrentTime(v.currentTime);
    // buffered
    if (v.buffered.length > 0) {
      setBuffered(v.buffered.end(v.buffered.length - 1));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  /* ─── play / pause ─── */
  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
      if (!hasStarted) setHasStarted(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, [hasStarted]);

  /* ─── big center play (first click overlay) ─── */
  const handleOverlayPlay = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  /* ─── timeline scrub ─── */
  const scrubTimeline = useCallback(
    (clientX: number) => {
      const el = timelineRef.current;
      const v = videoRef.current;
      if (!el || !v) return;
      const rect = el.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newTime = pct * duration;
      v.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration],
  );

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsScrubbing(true);
    scrubTimeline(e.clientX);
  };

  useEffect(() => {
    if (!isScrubbing) return;
    const onMove = (e: MouseEvent) => scrubTimeline(e.clientX);
    const onUp = () => setIsScrubbing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isScrubbing, scrubTimeline]);

  /* ─── volume scrub ─── */
  const scrubVolume = useCallback((clientX: number) => {
    const el = volumeRef.current;
    const v = videoRef.current;
    if (!el || !v) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.volume = pct;
    setVolume(pct);
    if (pct === 0) {
      setIsMuted(true);
      v.muted = true;
    } else {
      setIsMuted(false);
      v.muted = false;
    }
  }, []);

  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVolumeScrubbing(true);
    scrubVolume(e.clientX);
  };

  useEffect(() => {
    if (!isVolumeScrubbing) return;
    const onMove = (e: MouseEvent) => scrubVolume(e.clientX);
    const onUp = () => setIsVolumeScrubbing(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isVolumeScrubbing, scrubVolume]);

  /* ─── mute toggle ─── */
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isMuted) {
      v.muted = false;
      setIsMuted(false);
      if (volume === 0) {
        v.volume = 0.5;
        setVolume(0.5);
      }
    } else {
      v.muted = true;
      setIsMuted(true);
    }
  };

  /* ─── speed ─── */
  const changeSpeed = (rate: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  /* ─── fullscreen ─── */
  const toggleFullscreen = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  /* ─── keyboard ─── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      // Only handle if the wrapper or its children are focused
      if (!wrapperRef.current?.contains(document.activeElement) && document.activeElement !== document.body) return;
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          v.currentTime = Math.max(0, v.currentTime - 5);
          break;
        case "ArrowRight":
          e.preventDefault();
          v.currentTime = Math.min(duration, v.currentTime + 5);
          break;
        case "ArrowUp":
          e.preventDefault();
          v.volume = Math.min(1, v.volume + 0.1);
          setVolume(v.volume);
          break;
        case "ArrowDown":
          e.preventDefault();
          v.volume = Math.max(0, v.volume - 0.1);
          setVolume(v.volume);
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [togglePlay, toggleFullscreen, duration]);

  /* ─── close speed menu on outside click ─── */
  useEffect(() => {
    if (!showSpeedMenu) return;
    const handler = () => setShowSpeedMenu(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showSpeedMenu]);

  /* ─── derived ─── */
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;
  const effectiveVolume = isMuted ? 0 : volume;

  /* ──────────────────────── icons (inline SVG) ──────────────────────── */
  const PlayIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 3.5L16 10L5 16.5V3.5Z" fill="currentColor" />
    </svg>
  );

  const PauseIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="4" y="3" width="4" height="14" rx="1" fill="currentColor" />
      <rect x="12" y="3" width="4" height="14" rx="1" fill="currentColor" />
    </svg>
  );

  const VolumeHighIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );

  const VolumeMutedIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );

  const VolumeLowIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );

  const FullscreenIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );

  const ExitFullscreenIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v3a2 2 0 0 1-2 2H3" />
      <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
      <path d="M3 16h3a2 2 0 0 1 2 2v3" />
      <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );

  const volumeIcon = isMuted || effectiveVolume === 0 ? VolumeMutedIcon : effectiveVolume < 0.5 ? VolumeLowIcon : VolumeHighIcon;

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <div
      ref={wrapperRef}
      className={`video-player-wrapper ${className}`}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
        setShowVolumeSlider(false);
      }}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      {/* ──── Video Element ──── */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={togglePlay}
        className="video-player-video"
        playsInline
        preload="metadata"
      />

      {/* ──── Big center play overlay (before first play) ──── */}
      {!hasStarted && (
        <div className="video-player-overlay" onClick={handleOverlayPlay}>
          <div className="video-player-big-play">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M16 10L38 24L16 38V10Z" fill="white" />
            </svg>
          </div>
          <span className="video-player-overlay-label">Watch Video</span>
        </div>
      )}

      {/* ──── Controls Bar ──── */}
      <div className={`video-player-controls ${showControls || !isPlaying ? "visible" : ""}`}>
        {/* Timeline */}
        <div
          ref={timelineRef}
          className="video-player-timeline"
          onMouseDown={handleTimelineMouseDown}
        >
          <div className="video-player-timeline-bg" />
          <div
            className="video-player-timeline-buffered"
            style={{ width: `${bufferedPct}%` }}
          />
          <div
            className="video-player-timeline-progress"
            style={{ width: `${progressPct}%` }}
          />
          <div
            className="video-player-timeline-thumb"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        {/* Bottom row */}
        <div className="video-player-bottom">
          {/* Left group */}
          <div className="video-player-left">
            <button className="video-player-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? PauseIcon : PlayIcon}
            </button>

            {/* Volume group */}
            <div
              className="video-player-volume-group"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => {
                if (!isVolumeScrubbing) setShowVolumeSlider(false);
              }}
            >
              <button className="video-player-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                {volumeIcon}
              </button>
              <div className={`video-player-volume-slider-container ${showVolumeSlider || isVolumeScrubbing ? "visible" : ""}`}>
                <div
                  ref={volumeRef}
                  className="video-player-volume-slider"
                  onMouseDown={handleVolumeMouseDown}
                >
                  <div className="video-player-volume-track" />
                  <div
                    className="video-player-volume-fill"
                    style={{ width: `${effectiveVolume * 100}%` }}
                  />
                  <div
                    className="video-player-volume-thumb"
                    style={{ left: `${effectiveVolume * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Time display */}
            <span className="video-player-time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right group */}
          <div className="video-player-right">
            {/* Speed selector */}
            <div className="video-player-speed-wrapper">
              <button
                className="video-player-btn video-player-speed-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu((prev) => !prev);
                }}
                aria-label="Playback speed"
              >
                {playbackRate}x
              </button>
              {showSpeedMenu && (
                <div className="video-player-speed-menu" onClick={(e) => e.stopPropagation()}>
                  {SPEED_OPTIONS.map((rate) => (
                    <button
                      key={rate}
                      className={`video-player-speed-option ${rate === playbackRate ? "active" : ""}`}
                      onClick={() => changeSpeed(rate)}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button className="video-player-btn" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
              {isFullscreen ? ExitFullscreenIcon : FullscreenIcon}
            </button>
          </div>
        </div>
      </div>

      {/* ──── Styles ──── */}
      <style jsx>{`
        /* ── Wrapper ── */
        .video-player-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.6),
                      0 0 0 1px rgba(255, 255, 255, 0.05);
          cursor: pointer;
          user-select: none;
        }
        .video-player-wrapper:fullscreen {
          border-radius: 0;
        }

        /* ── Video ── */
        .video-player-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── Overlay (initial) ── */
        .video-player-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 20;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
        }
        .video-player-big-play {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .video-player-big-play svg {
          margin-left: 4px;
        }
        .video-player-overlay:hover .video-player-big-play {
          transform: scale(1.12);
          background: rgba(255, 255, 255, 0.18);
        }
        .video-player-overlay-label {
          font-family: var(--font-inter, 'Inter', ui-monospace, monospace);
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        /* ── Controls ── */
        .video-player-controls {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 30;
          display: flex;
          flex-direction: column;
          padding: 0 12px 10px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }
        .video-player-controls.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        /* ── Timeline ── */
        .video-player-timeline {
          position: relative;
          width: 100%;
          height: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 7px 0;
        }
        .video-player-timeline-bg {
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.12);
          top: 50%;
          transform: translateY(-50%);
          transition: height 0.15s ease;
        }
        .video-player-timeline:hover .video-player-timeline-bg,
        .video-player-timeline:hover .video-player-timeline-buffered,
        .video-player-timeline:hover .video-player-timeline-progress {
          height: 6px;
        }
        .video-player-timeline-buffered {
          position: absolute;
          left: 0;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.2);
          top: 50%;
          transform: translateY(-50%);
          transition: height 0.15s ease;
        }
        .video-player-timeline-progress {
          position: absolute;
          left: 0;
          height: 4px;
          border-radius: 2px;
          background: #fff;
          top: 50%;
          transform: translateY(-50%);
          transition: height 0.15s ease;
        }
        .video-player-timeline-thumb {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          top: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.15s ease;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
        }
        .video-player-timeline:hover .video-player-timeline-thumb {
          transform: translate(-50%, -50%) scale(1);
        }

        /* ── Bottom Row ── */
        .video-player-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2px;
        }
        .video-player-left,
        .video-player-right {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Buttons ── */
        .video-player-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, background 0.2s;
        }
        .video-player-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        /* ── Volume ── */
        .video-player-volume-group {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .video-player-volume-slider-container {
          width: 0;
          overflow: hidden;
          transition: width 0.25s ease, opacity 0.25s ease;
          opacity: 0;
        }
        .video-player-volume-slider-container.visible {
          width: 80px;
          opacity: 1;
        }
        .video-player-volume-slider {
          position: relative;
          width: 72px;
          height: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          margin-left: 2px;
        }
        .video-player-volume-track {
          position: absolute;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.15);
          top: 50%;
          transform: translateY(-50%);
        }
        .video-player-volume-fill {
          position: absolute;
          left: 0;
          height: 4px;
          border-radius: 2px;
          background: #fff;
          top: 50%;
          transform: translateY(-50%);
        }
        .video-player-volume-thumb {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          top: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
        }

        /* ── Time ── */
        .video-player-time {
          font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-left: 8px;
          white-space: nowrap;
          letter-spacing: 0.04em;
        }

        /* ── Speed ── */
        .video-player-speed-wrapper {
          position: relative;
        }
        .video-player-speed-btn {
          font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
          min-width: 36px;
        }
        .video-player-speed-menu {
          position: absolute;
          bottom: 100%;
          right: 0;
          margin-bottom: 8px;
          background: rgba(20, 20, 20, 0.92);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 4px;
          display: flex;
          flex-direction: column;
          min-width: 80px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
        }
        .video-player-speed-option {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
          font-size: 13px;
          padding: 6px 14px;
          cursor: pointer;
          border-radius: 6px;
          text-align: left;
          transition: color 0.15s, background 0.15s;
        }
        .video-player-speed-option:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }
        .video-player-speed-option.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.12);
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .video-player-controls {
            padding: 0 8px 6px;
          }
          .video-player-time {
            font-size: 10px;
          }
          .video-player-big-play {
            width: 60px;
            height: 60px;
          }
          .video-player-big-play svg {
            width: 36px;
            height: 36px;
          }
          .video-player-volume-slider-container.visible {
            width: 60px;
          }
          .video-player-volume-slider {
            width: 52px;
          }
        }
      `}</style>
    </div>
  );
}
