window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQDnF7JugC9ZT_d6GasMXs77Yl6JnnE_VVWWTo4YgbIvoZQ_eIsFSrBHhrkJCCun-Q2Pfb8q8AgCHplpnhxCXvWQU1m5BczyhAXj5NbAqakfQqyz8fwtJ9pk075e8sDb1BB4zqSl8eq5PBVldPR8SPx8QaBSo_hx0h79';
    const player = new Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
  
    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });
  
    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    // Connect to the player!
    player.connect();
  };