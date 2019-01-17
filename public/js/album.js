function main() {
    console.log("hi");
    const albumId = window.location.search.substring(1);
    get('/api/whoami', {}, function(profileUser) {
        console.log("fuck");
      renderAlbumData(profileUser,albumId);
      console.log(profileUser.name);
    });
  }
  
function renderAlbumData(profile,albumId) {
    var BASE_URL = "https://api.spotify.com/v1/albums/";
    var link = BASE_URL + albumId;
    console.log(link);
    var artistHeader = [['Authorization', 'Bearer ' + profile.access_token]];
    get(link, {}, function(albumData) {

        // rendering album image
        const albumContainer = document.getElementById('album-image');
        const albumImage = document.createElement('img');
        albumImage.className = "ui centered medium rounded image";
        albumImage.src = albumData.images[0].url; // need to fill this out
        albumContainer.appendChild(albumImage);

        //rendering album title
        const albumTitleContainer = document.getElementById('album-title');
        const albumTitle = document.createElement('h1');
        albumTitle.innerHTML = albumData.name; //need to fill this out
        albumTitle.className = "ui large header";
        albumTitleContainer.appendChild(albumTitle);

        //rendering album artist
        const albumArtistContainer = document.getElementById('album-artist');
        const albumArtist = document.createElement('p');
        albumArtist.innerHTML = albumData.artists[0].name; //need to fill this out
        albumArtist.className = "ui medium header";
        albumArtistContainer.appendChild(albumArtist);
        
        //album tracks
        const albumTracksContainer = document.getElementById('album-tracks');
        
        
        console.log(albumData.tracks);
        albumData.tracks.items.map( (trackInfo) => {
            const trackDiv = document.createElement("div");
            trackDiv.className = "ui vertical segment";

            const trackName = document.createElement('a');
            trackName.href = trackInfo.href;
            trackName.innerHTML = trackInfo.name;
            trackDiv.appendChild(trackName);
            
            albumTracksContainer.appendChild(trackDiv);
        });
        //albumTracksContainer.innerHTML = tracks;
        //console.log(tracks);
    }, null, artistHeader);
}
  
  main();