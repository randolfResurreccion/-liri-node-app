var request = require("request");
var key = require("./key.js")
var Twitter = require('twitter');
var client = new Twitter(key.twitterKeys);
var spotify = require('spotify');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(key.spotifyKeys);
var fs = require("fs")
var action = process.argv[2];
var value = process.argv[3];
var log = process.argv;
var logArr = [];

for (var i = 2; i < log.length; i++) {
  logArr.push(log[i]);
}
fs.appendFileSync("log.txt", logArr + "\n", "UTF-8", { 'flags': 'a+' });



if (action === "spotify-this-song") {
  var song = value;
  // console.log(value.length)
  if (typeof song !== "undefined") {
    mySpotify(song)
  } else {
    mySpotify("Hello");

  }
}


if (action === "movie-this") {
  var movie = value;
  if (typeof movie !== "undefined") {
    myMovie(movie);

  } else {
    myMovie("Mr.Nobody");
  }
}

if (action === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);
    var dataArr = data.split(",")
    console.log(dataArr);    
    mySpotify(dataArr[1]);
  });
}


if (action === "my-tweets") {

  var params = { screen_name: 'barackobama'};
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      
      for (var i = 0; i < 10; i++ ) {
        console.log(tweets[i].created_at);
        console.log(tweets[i].text + "\n");
        
      }
    }
    writeToFile(tweets[i].created_at);    
    writeToFile(tweets[i].text + "\n");
  });
}



//set all functions down here 
function mySpotify(song) {
  spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(JSON.stringify(data, null, 1));
    console.log("=========================================================================");
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Song: " + data.tracks.items[0].name);
    console.log("Link: " + data.tracks.items[0].external_urls.spotify);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("==========================================================================");
    // log data to our txt file
   
    writeToFile("Artist: " + data.tracks.items[0].artists[0].name);
    writeToFile("Song: " + data.tracks.items[0].name);
    writeToFile("Link: " + data.tracks.items[0].external_urls.spotify);
    writeToFile("Album: " + data.tracks.items[0].album.name);

    
  });
}

function myMovie(movie) {
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(response);
      // console.log(JSON.parse(body));
      console.log("=========================================================================");
      console.log("Title of the movie: " + JSON.parse(body).Title);
      console.log("Year the movie came out: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Rotten Tomatoes Rating:" + JSON.parse(body).Ratings[1].Value);
      console.log("Country where the movie was produced: " + JSON.parse(body).Country);
      console.log("Language of the movie: " + JSON.parse(body).Language);
      console.log("\nPlot of the movie: " + JSON.parse(body).Plot);
      console.log("\nActors in the movie: " + JSON.parse(body).Actors);
      console.log("=========================================================================");
      writeToFile(body);
    }
  });
}

function writeToFile(data)  {
  var objToString = JSON.stringify(data, null, 2);
  fs.appendFile("log.txt", objToString, function(err){
    if(err) {
      return console.log(err);
    } else {
      // console.log("Wrote to file");
    }
  });
}