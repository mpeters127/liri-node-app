require("dotenv").config();
let keys = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let axios = require("axios");
let moment = require("moment");
let fs = require("fs");
let args = process.argv;
let command = args[2];
let title = args[3];

console.log("You're command: " + command);
console.log("You're chosen title: " + title);

switch (command) {
  case "concert-this":
    concertThis(title);
    break;
  case "spotify-this-song":
    spotifyThis(title);
    break;
  case "movie-this":
    movieThis(title);
    break;
  case "do-what-it-says":
    fs.readFile("./random.txt", "utf8", function (error, data) {
      if (error) {
        return console.log(error)
      }
      let textCommand = data.split(",");
      let fCommand = textCommand[0];
      let fTitle;

      if (textCommand[1] !== undefined) {
        // Removes double quotes from title in text file
        fTitle = textCommand[1].replace(/['"]+/g, '');
      }
      console.log("Text Command: " + fCommand);
      console.log("Text Title: " + fTitle);

      switch (fCommand) {
        case 'concert-this':
          concertThis(fTitle);
          break;
        case 'spotify-this-song':
          spotifyThis(fTitle);
          break;
        case 'movie-this':
          movieThis(fTitle);
          break;
        case 'do-what-it-says':
          console.log("We don't want any loops now...");
          break;
        default:
          console.log("Unknown command: " + fCommand);
      }
    });
    break;
  case 'help':
    console.log("COMMANDS:");
    console.log("concert-this '<band>': Shows concert info for a given band");
    console.log("spotify-this-song '<song-name>': Shows song information from Spotify");
    console.log("movie-this '<movie-title>': Shows movie information for the given title");
    console.log("do-what-it-says: Executes command in the 'random.txt' file (format: <command>,\"<title>\")");
    break;
  default:
    console.log("Unknown command (type 'help' for list of commands)");
}

function concertThis(artist) {
  if (artist !== undefined) {
    let query = artist.split(" ").join("+").split(".").join("");
    console.log("Query: " + query);
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
      .then(function (res) {
        let concerts = res.data;

        console.log("Type of concerts: " + typeof concerts);
        if (typeof concerts === "object") {
          if (concerts.length > 0) {
            console.log("Concerts ==============");
            concerts.forEach(function (concert, i) {
              let venue = concert.venue;
              console.log("CONCERT " + i + ":");
              console.log("Venue: " + venue.name);
              console.log("Location: " + venue.city + ", " + venue.region);
              console.log("Date: " + moment(concert.datetime).format("MM/DD/YYYY"));
            });
          } else {
            console.log("No concerts found.");
          }
        } else {
          console.log("Artist not found...");
        }
        console.log("--------------------------------");
      });
  } else {
    console.log("Please enter an artist.")
  }
}

function spotifyThis(title) {
  if (title === undefined) {
    title = 'the sign ace of base';
  }
  spotify.search({ type: 'track', query: title }, function (error, data) {
    if (error) {
      return console.log("Error occurred: " + error);
    }

    if (data.tracks.items.length > 0) {
      let track = data.tracks.items[0];

      let artistsObj = track.artists;
      let artists = [];
      artistsObj.forEach(function (artist) {
        if (artist.type === "artist") {
          artists.push(artist.name);
        }
      });

      let song = track.name;
      let preview = track.preview_url;
      let album = track.album.name;

      console.log("Artists: " + artists.join(", "));
      console.log("Song Name: " + song);
      console.log("Preview Link: " + preview);
      console.log("Album: " + album);
      console.log("-----------------------");
    } else {
      console.log("Song not found");
    }

  });
}

function movieThis(title) {
  if (title === undefined) {
    title = 'Mr. Nobody';
  }
  let query = title.split(" ").join("+").split('.').join("");
  axios.get("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy").
    then(function (response) {

      if (response.data.Error) {
        return console.log(response.data.Error);
      } else {
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);

        let ratings = response.data.Ratings
        let tomatoRating = "N/A";
        if (typeof ratings === "object") {
          for (key in ratings) {
            let source = ratings[key].Source;
            if (source === "Rotten Tomatoes") {
              tomatoRating = ratings[key].Value;
            }
          }
        }

        console.log("Rotten Tomatoes Rating: " + tomatoRating);
        console.log("Country: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
      }
      console.log("--------------------------------");
    });
}