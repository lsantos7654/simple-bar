export const spotifyStyles = /* css */ `
.spotify {
  position: relative;
  background-color: var(--green);
}
.simple-bar--widgets-background-color-as-foreground .spotify {
  color: var(--green);
  background-color: transparent;
}

.spotify-popup__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--dim-foreground);
  gap: 8px;
}

.spotify-popup__error svg {
  width: 24px;
  height: 24px;
}

.spotify-popup {
  position: fixed;
  top: 40px; /* Position below the top bar */
  right: 420px; /* Align to the right */
  z-index: 999;
  display: flex;
  pointer-events: all;
  isolation: isolate;
}

.spotify-popup__content {
  position: relative;
  background: var(--background);
  border-radius: 8px;
  padding: 8px;
  width: 200px; /* Fixed width */
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
  margin-right: 10px; /* Add some space from the right edge */
}

.spotify-popup__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.spotify-popup__album-art {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  background: var(--minor);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: center;
}

.spotify-popup__album-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}

.spotify-popup__album-art-loading {
  width: 20px;
  height: 20px;
  border: 2px solid var(--minor);
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
  padding: 0 4px;
}

.spotify-popup__track {
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 2px;
  color: var(--foreground);
}

.spotify-popup__artist {
  font-size: 10px;
  color: var(--dim-foreground);
}

.spotify-popup__controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.spotify-popup__controls button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--foreground);
  padding: 4px;
  border-radius: 50%;
  width: 24px;
  height: 24px;
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
  width: 14px;
  height: 14px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
