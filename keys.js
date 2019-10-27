
var axios = require("axios");
var Spotify = require('node-spotify-api');

axios.get("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy").then(
  function(response) {
  }
);

var spotify = new Spotify({
  id: ed0f03812b364098931fbc2ff5266ec3,
  secret: ca4e48ba8d8f446b8fa0b7105f261640
});
