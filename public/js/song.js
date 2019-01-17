function main() {
    console.log("hi");
    const trackId = window.location.search.substring(1);
    get('/api/whoami', {}, function(profileUser) {
        console.log("fuck");
      renderSongData(profileUser,trackId);
      console.log(profileUser.name);
    });
  }
  
function renderSongData(profile,trackId) {
    var BASE_URL = "https://api.spotify.com/v1/tracks/";
    var link = BASE_URL + trackId;
    console.log(link);
    var artistHeader = [['Authorization', 'Bearer ' + profile.access_token]];
    get(link, {}, function(songData) {

        // rendering song image
        const songContainer = document.getElementById('song-image');
        const songImage = document.createElement('img');
        songImage.className = "ui centered medium rounded image";
        songImage.src = songData.album.images[0].url; // need to fill this out
        songContainer.appendChild(songImage);

        //rendering song title
        const songTitleContainer = document.getElementById('song-title');
        const songTitle = document.createElement('h1');
        songTitle.innerHTML = songData.name; //need to fill this out
        songTitle.className = "ui large header";
        songTitleContainer.appendChild(songTitle);

        //rendering song artist
        const songArtistContainer = document.getElementById('song-artist');
        const songArtist = document.createElement('p');
        songArtist.innerHTML = songData.artists[0].name; //need to fill this out
        songArtist.className = "ui medium header";
        songArtistContainer.appendChild(songArtist);
        
    }, null, artistHeader);
}
  
  main();