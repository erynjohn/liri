require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});
var query = process.argv;
var type = process.argv[2];
var array = [];
for (var i = 3; i < query.length; i++) {
    array.push(query[i]);
    array.push("+");
}
array.splice(-1);
var searchTerm = array.join("");

switch (type) {
    case 'concert-this':
        concertFunc();
        break;
    case 'spotify-this-song':
        SpotifyFunc();
        break;
    case 'movie-this':
        movieFunc();
        break;
    case 'do-what-it-says':
        randomFunc();
        break;
    default:
        console.log("Error");
}
function concertFunc() {
    if (searchTerm != "") {
        axios.get(`https://rest.bandsintown.com/artists/${searchTerm}/events?app_id=${process.env.concertKey}`).then(
            function (response) {
                if (response.data.length <= 0) {
                    console.log("No artist info")
                } else {
                    for (var i = 0; i < response.data.length; i++) {
                        var info = `\n
        Venue: ${response.data[i].venue.name}
        Location: ${response.data[i].venue.city + ", " + response.data[0].venue.region}
        Event Date: ${moment(response.data[i].datetime).format('LL')}`
                        console.log(info);
                    }
                }
                $data(info);
            }
        );
    } else {
        console.log("No info entered");
    }
}
function SpotifyFunc() {
    if (searchTerm != "") {
        spotify.search({
            type: 'artist,track',
            query: searchTerm
        }, function (err, data) {
            if (err) {
                throw err;
            }
            var info = `\n
        Artist: ${data.tracks.items[0].artists[0].name}
        Track: ${data.tracks.items[0].name}
        Preview: ${data.tracks.items[0].preview_url}
        Album: ${data.tracks.items[0].album.name}`
            console.log(info);
            $data(info);
        });
    } else {
        searchTerm = "ace+of+base+the+sign";
    }
}
function movieFunc() {
    if (searchTerm != "") {
        axios.get(`http://www.omdbapi.com/?t=${searchTerm}&y=&plot=short&apikey=${process.env.bCampKey}`).then(function (response) {
            var info = `\n
        Title: ${response.data.Title}
        Released: ${response.data.Year}
        IMDB Rating: ${response.data.imdbRating}
        Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
        Country: ${response.data.Country}
        Language: ${response.data.Language}
        Plot: ${response.data.Plot}
        Actors: ${response.data.Actors}`
            console.log(info);
            $data(info);
        }
        );
    } else {
        searchTerm = "mr+nobody"
    }
}
function randomFunc() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            throw err
        }
        var dataArr = data.split(",");
        searchTerm = dataArr[1];
        SpotifyFunc()
    });
}
var qLog = query.splice(0, 2)
qLog = "\n" + query.join(" ") + "\n"
console.log(qLog)
fs.appendFile("log.txt", qLog, function (err) {
    if (err) {
        throw err;
    } else {
        console.log("Logged");
    }
});
function $data(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) {
            throw err;
        } else {
            console.log("Logged");
        }
    });
}