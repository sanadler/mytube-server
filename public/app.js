
function getVideos() {
  const apiKey = "AIzaSyAmP7VkJjDa4irNYr3ov75Hoby5BWAQ-ME";
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&key=${apiKey}`)
      .then(response => response.json())
      .then(responseJson => 
        displayVideos(responseJson))
      .catch(error => alert("Can't find videos"));
  }

  function getFavoritedVideos() {
    fetch(`/videos`)
      .then(response => response.json())
      .then(responseJson => 
        displayFavoritedVideos(responseJson))
      .catch(error => alert("Can't find videos"));
  }

  function displayVideos(data) {
    $('.row').empty();
    for (index in data.items) {
        $('.row').append(
        `<div class="col-6">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${data.items[index].id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          <button type="submit" onclick="handleAddButton(this.value)" value="${data.items[index]}" name="add">Add to Favorites</button>
        </div>`)
    }
    
}

function displayFavoritedVideos(data) {
  $('.row').empty();
  for (index in data.videos) {
      $('.row').append(
      `<div class="col-6">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/${data.videos[index].videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      <button type="submit" value="${data.videos[index].id}" name="delete">Delete from Favorites</button>
    </div>`)
  }
}

function handleAddButton(){
  $('.row').on('click','button[name="add"]', function(){
    const id  =  $(this).prop("value");

    addVideoToFavorites(id);
  }); 
}

function deleteVideo(id){
  fetch(`/videos/${id}`,{
      method: 'delete',
      headers: {
          "Content-Type": "application/json"
      },
  })
      .then(handleErrors)
      .catch(error => alert(error))
}

function handleDeleteButton(){
  $('.row').on('click','button[name="delete"]', function(){
    const id  =  $(this).prop("value");
    deleteVideo(id);
    location.reload();
  }); 
}

function addVideoToFavorites(id) {
  const newVideoId = id;
  fetch('/videos' ,{
      method: 'post',
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          videoId: newVideoId,
      })
  })
      .then(handleErrors)
      .catch(error => alert(error))
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.message);
  }
  return response;
}

$(function() {
  getFavoritedVideos();
  handleAddButton();
  handleDeleteButton();
})