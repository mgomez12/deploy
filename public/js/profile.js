function main() {
    const profileId = window.location.search.substring(1);
    get('/api/user', {'_id': profileId}, function(profileUser) {
      renderUserData(profileUser);
      console.log(profileUser.name);
    });
  }

function renderUserData(profile) {
    const nameDiv = document.getElementById('name');
    nameDiv.innerText = profile.name;

    const songDiv = document.getElementById('songs');
    let songs = 'top songs: '
    var artistHeader = [['Authorization', 'Bearer ' + profile.access_token]];
    get('https://api.spotify.com/v1/me/top/tracks', {'limit': '10'}, function(songJson) {
        console.log(songJson.items);
        songJson.items.map( (songInfo) => {
            songs += songInfo.name + ", "
        })
        songDiv.innerHTML = songs;
        console.log(songs);
    }, null, artistHeader);
    
}


main();