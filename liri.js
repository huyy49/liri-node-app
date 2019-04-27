require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var inquirer = require("inquirer");

var moment = require("moment");

var fs = require("fs");

var method = "";
var word = "";

var MUSIC = function () {
  var divider = "\n------------------------------------------------------------";

  this.concertThis = function (singer) {
    var url = "https://rest.bandsintown.com/artists/" + singer + "/events?app_id=codingbootcamp";
    axios.get(url).then(function (response) {
      var jsonData = response.data;
      // console.log(jsonData);
      for (var i = 0; i < jsonData.length; i++) {
        var concertData = [
          "Venue: " + jsonData[i].venue.name,
          "Location: " + jsonData[i].venue.city + ", " + jsonData[i].venue.region + ", " + jsonData[i].venue.country,
          "Date of Event: " + moment(jsonData[i].datetime).format("L"),
        ].join("\n\n");
        console.log(concertData + divider);
        // console.log(jsonData[i].venue.name);
        // console.log(jsonData[i].venue.city + ", " + jsonData[i].venue.region + ", " + jsonData[i].venue.country);
        // console.log(moment(jsonData[i].datetime).format("L"));
      };
    });
  };
  this.spotifyThisSong = function (song) {
    spotify.search({ type: "track", query: song }, function (err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      };
      var songItems = data.tracks.items[0];
      // console.log(songItems);
      // console.log(songItems.name);
      // console.log(songItems.artists[0].name);
      // console.log(songItems.external_urls.spotify);
      // console.log(songItems.album.name);
      var songData = [
        "Name: " + songItems.name,
        "Artists: " + songItems.artists[0].name,
        "Spotify URLs: " + songItems.external_urls.spotify,
        "Album: " + songItems.album.name,
      ].join("\n\n");
      console.log(songData + divider);
    });
  };
  this.movieThis = function (movie) {
    var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
    axios.get(url).then(function (response) {
      var jsonData = response.data;

      var movieData = [
        "Title: " + jsonData.Title,
        "Year: " + jsonData.Year,
        "IMDB Rating: " + jsonData.Ratings[0].Value,
        "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
        "Country: " + jsonData.Country,
        "Language: " + jsonData.Language,
        "Plot: " + jsonData.Plot,
        "Actors: " + jsonData.Actors,
      ].join("\n\n");
      console.log(movieData + divider);
    });
  };
  this.doWhatItSays = function(method, term) {
    fs.readFile("random.txt", "utf8", function (error, data) {
      if (error) {
        return console.log(error);
      }
      console.log(data);
      var dataArr = data.split(",");
      console.log(dataArr);
      method = dataArr[0];
      word = dataArr[1];
    });
  };
  this.method = method;
  this.word = word;
};

var search = process.argv[2];
var term = process.argv.slice(3).join(" ");
// console.log(search);
// console.log(term);

var music = new MUSIC();

// if (!search) {
//   search = "Concert-This";
// }

// // By default, if no search term is provided, search for "Andy Griffith"
// if (!term) {
//   term = "Backstreet Boyes";
// };

var final = function(final){
  switch (final) {
    case "Concert-This":
      console.log("Searching for Concerts: " + term);
      music.concertThis(term);
      break;
    case "Spotify-This-Song":
      console.log("Searching for Song: " + term);
      music.spotifyThisSong(term);
      break;
    case "Movie-This":
      console.log("Searching for Movie: " + term);
      music.movieThis(term);
      break;
    case "do-what-it-says":
      console.log("Do what it says: ");
      music.doWhatItSays();
      // var method = music.doWhatItSays().method;
      // var word = music.doWhatItSays().word;
      music.method(word);
      break;
    default:
      console.log("Searching for Concerts for: Backstreet Boys");
      music.concertThis("Backstreet Boys");
      break;
  };
};

final(search);
