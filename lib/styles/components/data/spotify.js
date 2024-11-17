export const spotifyStyles = /* css */ `
.spotify {
  position: relative;
  background-color: var(--green);
}
.simple-bar--widgets-background-color-as-foreground .spotify {
  color: var(--green);
  background-color: transparent;
}

.spotify-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  display: 'flex';
  alignItems: 'center';
  justifyContent: 'center';
  pointerEvents: 'all';
  isolation: 'isolate';
}

.spotify-popup__content {
  position: relative;
  background: var(--background);
  border-radius: 12px;
  padding: 20px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
}

.spotify-popup__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.spotify-popup__album-art {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: var(--minor);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spotify-popup__album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.spotify-popup__album-art-loading {
  width: 40px;
  height: 40px;
  border: 3px solid var(--minor);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spotify-popup__album-art-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dim-foreground);
}

.spotify-popup__album-art-fallback svg {
  width: 40%;
  height: 40%;
}

.spotify-popup__info {
  text-align: center;
  padding: 0 8px;
}

.spotify-popup__track {
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 4px;
  color: var(--foreground);
}

.spotify-popup__artist {
  font-size: 0.9em;
  color: var(--dim-foreground);
}

.spotify-popup__controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 8px 0;
}

.spotify-popup__controls button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--foreground);
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.spotify-popup__controls button:hover {
  background: var(--minor);
  transform: scale(1.1);
}

.spotify-popup__controls button svg {
  width: 20px;
  height: 20px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;
