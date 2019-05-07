require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var axios = require("axios");

var inquirer = require("inquirer");

var moment = require("moment");

var fs = require("fs");

// var method = "";
// var word = "";

var search = process.argv[2];
var termEntered = process.argv[3];
var term = process.argv.slice(3).join("");

var MUSIC = function () {
  var divider = "\n------------------------------------------------------------\n";

  this.concertThis = function (singer) {
    var url = "https://rest.bandsintown.com/artists/" + singer + "/events?app_id=codingbootcamp";
    axios.get(url).then(function (response) {
      var jsonData = response.data;
      // console.log("js: " + jsonData);
      if (jsonData.includes("warn=Not found")) {
        console.log("No concert is currently available. Please try a different band/musician.");
        // return false;
      } else {
        for (var i = 0; i < jsonData.length; i++) {
          var concertData = [
            "Venue: " + jsonData[i].venue.name,
            "Location: " + jsonData[i].venue.city + ", " + jsonData[i].venue.region + ", " + jsonData[i].venue.country,
            "Date of Event: " + moment(jsonData[i].datetime).format("L"),
          ].join("\n");
          console.log(concertData + divider);
          // console.log(jsonData[i].venue.name);
          // console.log(jsonData[i].venue.city + ", " + jsonData[i].venue.region + ", " + jsonData[i].venue.country);
          // console.log(moment(jsonData[i].datetime).format("L"));
          music.appendLog(concertData);
        };
      }
    });
  };
  this.spotifyThisSong = function (song) {
    spotify.search({ type: "track", query: song }, function (err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      };
      var songItems = data.tracks.items;
      if (songItems.length === 0) {
        console.log("No result. Please try a different song.");
      } else {
        for (var i = 0; i < songItems.length; i++) {
          var songData = [
            "Name: " + songItems[i].name,
            "Artists: " + songItems[i].artists[0].name,
            "Spotify URLs: " + songItems[i].external_urls.spotify,
            "Album: " + songItems[i].album.name,
          ].join("\n");
          console.log(songData + divider);
          music.appendLog(songData);
        }
      }
      // console.log(songItems);
      // console.log(songItems.name);
      // console.log(songItems.artists[0].name);
      // console.log(songItems.external_urls.spotify);
      // console.log(songItems.album.name);
    });
  };
  this.movieThis = function (movie) {
    var url = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
    axios.get(url).then(function (response) {
      var jsonData = response.data;
      if (jsonData.length === 0) {
        console.log("No result. Please try a different movie.");
      } else {
        var movieData = [
          "Title: " + jsonData.Title,
          "Year: " + jsonData.Year,
          "IMDB Rating: " + jsonData.Ratings[0].Value,
          "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
          "Country: " + jsonData.Country,
          "Language: " + jsonData.Language,
          "Plot: " + jsonData.Plot,
          "Actors: " + jsonData.Actors,
        ].join("\n");
        console.log(movieData + divider);
        music.appendLog(movieData);
      }
    });
  };
  this.doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
      if (error) {
        return console.log(error);
      }
      // console.log(data);
      var dataArr = data.split(",");
      // console.log(dataArr);
      var method = dataArr[0];
      var word = dataArr[1];
      console.log(method);
      console.log(word);

      // Callback functions
      switch (method) {
        case "concert-this":
          console.log("Searching for Concerts: " + word);
          music.concertThis(word);
          break;
        case "spotify-this-song":
          console.log("Searching for Song: " + word);
          music.spotifyThisSong(word);
          break;
        case "movie-this":
          console.log("Searching for Movie: " + word);
          music.movieThis(word);
          break;
      };
    })
  };
  this.appendLog = function (data) {
    fs.appendFile("log.txt", "Command: node liri.js " + search + " " + term + "\n" + data + divider, function (err) {
      if (err) throw err;
      console.log(data);
    });
  }
};
// console.log(search);
// console.log(term);

var music = new MUSIC();

var final = function (final) {
  switch (final) {
    case "concert-this":
      if (termEntered == undefined || termEntered == null) {
        console.log("Please enter an artist to search.")
      } else {
        console.log("Searching for Concerts: " + term);
        music.concertThis(term);
      };
      break;
    case "spotify-this-song":
      if (termEntered == undefined || termEntered == null) {
        term = "The Sign";
      };
      console.log("Searching for Song: " + term);
      music.spotifyThisSong(term);
      break;
    case "movie-this":
      if (termEntered == undefined || termEntered == null) {
        term = "Mr. Nobody";
      };
      console.log("Searching for Movie: " + term);
      music.movieThis(term);
      break;
    case "do-what-it-says":
      console.log("Do what it says: ");
      music.doWhatItSays();
      break;
    default:
      console.log("Searching for Concerts for: Backstreet Boys");
      music.concertThis("Backstreet Boys");
      break;
  };
};

final(search);
