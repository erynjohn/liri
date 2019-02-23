require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});
exports.spotify = spotify;
var query = process.argv;
var type = process.argv[2];
var array = [];

for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+")
}
array.splice(-1);
var SearchTerm = array.join(""); 
exports.SearchTerm = SearchTerm;

switch (type) {
    case 'concert-this':
        concertThis()
        break;
    case 'spotify-this-song':
        spotifyThisSong()
        break;
    case 'movie-this':
        movieThis()
        break;
    case 'random-file':
        RandomFile()
        break;
    default:
        console.log("Error");
}
function spotifyThisSong() {
    if (SearchTerm === "") {
        SearchTerm = "ace+of+base+the+sign";
    }
    spotify.search({
        type: 'artist,track',
        query: SearchTerm
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log('\n');
        var currData = `\n
    Artist: ${data.tracks.items[0].artists[0].name}
    Track: ${data.tracks.items[0].name}
    Preview: ${data.tracks.items[0].preview_url}
    Album: ${data.tracks.items[0].album.name}
            `;
        console.log(currData);
        logData(currData);
    });
}
function concertThis() {
    if (SearchTerm === "") {
        console.log("No Artist entered. Please enter an Artist");
    }
    else {
        axios.get(`https://rest.bandsintown.com/artists/${SearchTerm}/events?app_id=codingbootcamp`).then(function (response) {
            if (response.data.length <= 0) {
                console.log("No info");
            }
            else {
                for (var i = 0; i < response.data.length; i++) {
                    var info = `\n
    Venue: ${response.data[i].venue.name}
    Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
    Date: ${moment(response.data[i].datetime).format('LL')}
            `;
                    console.log(info);
                }
            }
            logData(info);
        });
    }
}


function movieThis() {

    if (SearchTerm === "") {
        SearchTerm = "mr+nobody"
    }

    axios.get(`http://www.omdbapi.com/?t=${SearchTerm}&y=&plot=short&apikey=trilogy`).then(
        function (response) {
        
            var dataInfo = `\n
    Title: ${response.data.Title}
    Released: ${response.data.Year}
    IMDB Rating: ${response.data.imdbRating}
    Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
    Country: ${response.data.Country}
    Language: ${response.data.Language}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
            `
            logData(dataInfo)
        }
    );
}
function RandomFile() {
    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
          console.log(error);
        }

        var dataArr = data.split(",");
      
        SearchTerm = dataArr[1];
        spotifyThisSong()
      });
}
var logThis = query.splice(0,2)
logThis =  "\n" + query.join(" ") + "\n"

fs.appendFile("log.txt", logThis, function(err) {

    if (err) {
      console.log(err);
    } else {
      console.log("Logged");
    }
  
  });
function logData(data) {
    fs.appendFile("log.txt", data, function(err) {

        if (err) {
          console.log(err);
        } else {
          console.log("Logged");
        }
      
      });
  }
exports.logData = logData;
