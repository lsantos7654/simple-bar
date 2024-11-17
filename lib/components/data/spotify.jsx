import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Icons from "../icons/icons.jsx";
import * as Utils from "../../utils";
import { SPOTIFY_CONFIG } from "../../config.js";

export { spotifyStyles as styles } from "../../styles/components/data/spotify";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 10000;

// Add this function at the top level
const getSpotifyToken = async (clientId, clientSecret) => {
  const basicAuth = btoa(`${clientId}:${clientSecret}`);
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return null;
  }
};

const SpotifyPopup = React.memo(({ state, onClose, getSpotify }) => {
  const { playerState, trackName, artistName } = state;
  const isPlaying = playerState === "playing";
  const [albumArt, setAlbumArt] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { clientId, clientSecret } = SPOTIFY_CONFIG;

  const mounted = React.useRef(true);
  const controller = React.useRef(null);

  // Proper cleanup
  React.useEffect(() => {
    return () => {
      mounted.current = false;
      if (controller.current) {
        controller.current.abort();
      }
    };
  }, []);

  const fetchAlbumArt = React.useCallback(async () => {
    if (!mounted.current) return;
    
    // Cancel any in-flight requests
    if (controller.current) {
      controller.current.abort();
    }
    controller.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);

      const trackId = await Uebersicht.run(`
        osascript -e '
          tell application "Spotify"
            return id of current track
          end tell'
      `);
      
      if (!mounted.current) return;

      const cleanTrackId = Utils.cleanupOutput(trackId).split(':')[2];
      const token = await getSpotifyToken(clientId, clientSecret);
      
      if (!mounted.current) return;
      if (!token) {
        throw new Error('Failed to get Spotify token');
      }

      const response = await fetch(`https://api.spotify.com/v1/tracks/${cleanTrackId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: controller.current.signal
      });
      
      if (!mounted.current) return;
      if (!response.ok) {
        throw new Error('Failed to fetch track info');
      }

      const data = await response.json();
      if (mounted.current) {
        setAlbumArt(data.album.images[0]?.url || null);
        setLoading(false);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;
      
      console.error('Failed to fetch album art:', error);
      if (mounted.current) {
        setError(error.message);
        setAlbumArt(null);
        setLoading(false);
      }
    }
  }, [clientId, clientSecret]);

  React.useEffect(() => {
    fetchAlbumArt();
  }, [fetchAlbumArt, trackName]);

	const handlePlay = async () => {
		try {
			const state = isPlaying ? "pause" : "play";
			await Uebersicht.run(`osascript -e 'tell application "Spotify" to ${state}'`);
			if (mounted.current) {
				getSpotify();
			}
		} catch (error) {
			console.error('Failed to toggle playback:', error);
		}
	};

  const handleNext = () => {
    Uebersicht.run(`osascript -e 'tell application "Spotify" to Next Track'`);
    getSpotify();
  };

  const handlePrev = () => {
    Uebersicht.run(`osascript -e 'tell application "Spotify" to Previous Track'`);
    getSpotify();
  };

  const renderAlbumArt = () => {
    if (loading) {
      return <div className="spotify-popup__album-art-loading" />;
    }
    
    if (!albumArt) {
      return (
        <div className="spotify-popup__album-art-fallback">
          <Icons.Music />
        </div>
      );
    }

    return (
      <img 
        src={albumArt} 
        alt={`${trackName} album art`} 
        onError={() => setAlbumArt(null)} 
      />
    );
  };

	const renderContent = () => {
			if (error) {
				return (
					<div className="spotify-popup__error">
						<Icons.Warning />
						<span>Failed to load album art</span>
					</div>
				);
			}

			return (
				<>
					<div className="spotify-popup__album-art">
						{renderAlbumArt()}
					</div>
					<div className="spotify-popup__info">
						<div className="spotify-popup__track">{trackName}</div>
						<div className="spotify-popup__artist">{artistName}</div>
					</div>
					<div className="spotify-popup__controls">
						<button onClick={handlePrev} title="Previous">
							<Icons.Previous />
						</button>
						<button onClick={handlePlay} title={isPlaying ? "Pause" : "Play"}>
							{isPlaying ? <Icons.Playing /> : <Icons.Paused />}
						</button>
						<button onClick={handleNext} title="Next">
							<Icons.Next />
						</button>
					</div>
				</>
			);
		};

	return (
			<div className="spotify-popup">
				<div className="spotify-popup__overlay" onClick={onClose} />
				<div className="spotify-popup__content">
					{renderContent()}
				</div>
			</div>
		);
});

export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, spotifyWidgetOptions } = settings;
  const { spotifyWidget } = widgets;
  const { refreshFrequency, showSpecter, showOnDisplay } = spotifyWidgetOptions;
  
  // Add this new state for controlling popup visibility
  const [showPopup, setShowPopup] = React.useState(false);

  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency]
  );

  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && spotifyWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);

  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  const getSpotify = React.useCallback(async () => {
    if (!visible) return;
    const isRunning = await Uebersicht.run(
      `ps aux | grep -v 'grep' | grep -q '[S]potify Helper' && echo "true" || echo "false"`
    );
    if (Utils.cleanupOutput(isRunning) === "false") {
      setLoading(false);
      setState({
        playerState: "",
        trackName: "",
        artistName: "",
      });
      return;
    }
    const [playerState, trackName, artistName] = await Promise.all([
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to player state as string' 2>/dev/null || echo "stopped"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to name of current track as string' 2>/dev/null || echo "unknown track"`
      ),
      Uebersicht.run(
        `osascript -e 'tell application "Spotify" to artist of current track as string' 2>/dev/null || echo "unknown artist"`
      ),
    ]);
    setState({
      playerState: Utils.cleanupOutput(playerState),
      trackName: Utils.cleanupOutput(trackName),
      artistName: Utils.cleanupOutput(artistName),
    });
    setLoading(false);
  }, [visible]);

  useServerSocket("spotify", visible, getSpotify, resetWidget);
  useWidgetRefresh(visible, getSpotify, refresh);

  if (loading) return <DataWidgetLoader.Widget className="spotify" />;
  if (!state) return null;
  const { playerState, trackName, artistName } = state;

  if (!trackName.length) return null;

  const label = artistName.length ? `${trackName} - ${artistName}` : trackName;
  const isPlaying = playerState === "playing";
  const Icon = getIcon(playerState);

  const onClick = (e) => {
    Utils.clickEffect(e);
    setShowPopup(true);
  };

  const onRightClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(`osascript -e 'tell application "Spotify" to Next Track'`);
    getSpotify();
  };
  const onMiddleClick = (e) => {
    Utils.clickEffect(e);
    Uebersicht.run(`open -a 'Spotify'`);
    getSpotify();
  };

  const classes = Utils.classNames("spotify", {
    "spotify--playing": isPlaying,
  });

  return (
    <>
      <DataWidget.Widget
        classes={classes}
        Icon={Icon}
        onClick={onClick}
        onRightClick={onRightClick}
        onMiddleClick={onMiddleClick}
        showSpecter={showSpecter && isPlaying}
      >
        {label}
      </DataWidget.Widget>
      {showPopup && (
        <React.Suspense fallback={<DataWidgetLoader.Widget className="spotify-popup" />}>
          <SpotifyPopup
            state={state}
            onClose={() => setShowPopup(false)}
            getSpotify={getSpotify}
          />
        </React.Suspense>
      )}
    </>
  );
});

Widget.displayName = "Spotify";

function togglePlay(isPaused) {
  const state = isPaused ? "play" : "pause";
  Uebersicht.run(`osascript -e 'tell application "Spotify" to ${state}'`);
}

function getIcon(playerState) {
  if (playerState === "stopped") return Icons.Stopped;
  if (playerState === "playing") return Icons.Playing;
  return Icons.Paused;
}
