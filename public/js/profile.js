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
}


main();