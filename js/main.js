

class MovieAPI {

  constructor(APIName){
    this.APIName = APIName;
    
    if (this.APIName=="themoviedb") {
      this.rootURL="https://api.themoviedb.org/3/movie/";
      this.token ="6c6774fdc0da477c7a3f3f7c03048117";
      this.language = "&language=en-US";
    }
  }

  getPopularMovies(callback){
    this.getData('popular', function(results) {
      callback(results);
    });
  }

  getRecentMovies(callback){
    this.getData('now_playing', function(results) {
      callback(results);
    });
  }

  getComedyMovies(callback){//getter becomes an attribute when you an instance
    this.getData('upcoming', function(results) {
      callback(results);
    });
  }

  getActorName(callback, movieId){//getter becomes an attribute when you an instance
    this.getActorData(movieId +'/credits', function(actorResults) {
      callback(actorResults);
    });
  }

  getMovieTrailer(callback, movieId){//getter becomes an attribute when you an instance
    this.getMovieTrailerData(movieId + '/videos', function(trailerResults) {
      callback(trailerResults);
    });
  }

  // getActorName(callback){//getter becomes an attribute when you an instance
  //   this.getData('movie_id', function(results) {
  //     callback(results);
  //   });
  // }


  getData(queryCategory, callback){//callback is a parameter that is a function that is used whenever getData is called
    let AJAX = new XMLHttpRequest();
    AJAX.open("GET", this.rootURL + queryCategory + '?api_key=' + this.token);
    // AJAX.setRequestHeader("x-access-token", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OGExN2FiNjk1ODFhYzcwMmM0YmM4ZjciLCJnbG9iYWxhZG1pbiI6ZmFsc2UsImFkbWluIjpmYWxzZSwiYWN0aXZlIjp0cnVlLCJmdWxsbmFtZSI6Ikp1ZHkgTmplcnUiLCJlbWFpbCI6Im5qZXJ1anVkeTg3QHltYWlsLmNvbSIsInVzZXJuYW1lIjoianVkeV9uamVydSIsInBhc3N3b3JkIjoiJDJhJDA4JGNpbVlsY3V3WHViaEI0T2c3Q3BQRmVFMVJjaENBOGdSQ2tLNWszZDFHUkx6YkVsYXF3WjdDIiwiZG9tYWluIjoidmVmc2tvbGkuaXMiLCJtZXNzYWdlIjoic3R1ZHkgcHJvamVjdFxyXG5cclxuIiwiaWF0IjoxNDg3MDg3Nzg5LCJleHAiOjE0ODcxNzQxODl9.uejVEAYnZGQurhnztGLwdkonAP_YEenVraevyaGeTpc");
    
    AJAX.onreadystatechange = function(){

      if(AJAX.readyState != 4 || AJAX.status != 200){
        return;
      }

      let results = JSON.parse(AJAX.responseText).results;
        callback(results);
    };
    AJAX.send();
  }

  getActorData(queryCategory, callback) {
    let AJAX = new XMLHttpRequest();
      AJAX.open("GET", this.rootURL  + queryCategory + '?api_key=' + this.token);
      AJAX.onreadystatechange = function() {
        if (AJAX.readyState != 4 || AJAX.status != 200) {
         return;
        }
        let actorResults = JSON.parse(AJAX.responseText).cast;
        // let crewResults = JSON.parse(AJAX.responseText).crew
        callback(actorResults);
      };
      AJAX.send();
  }

  getMovieTrailerData(queryCategory, callback) {
    let AJAX = new XMLHttpRequest();
      AJAX.open("GET", this.rootURL  + queryCategory + '?api_key=' + this.token + this.language);
      AJAX.onreadystatechange = function() {
        if (AJAX.readyState != 4 || AJAX.status != 200) {
         return;
        }
        let trailerResults = JSON.parse(AJAX.responseText).results;
        callback(trailerResults);
      };
      AJAX.send();

  }
}



const image_path = "http://image.tmdb.org/t/p/original";
let theMovieDBInstance = new MovieAPI('themoviedb');

//....................RENDER THE FRONT PAGE................//


theMovieDBInstance.getPopularMovies(function(results) {
  console.log(results);
  let actorNames = [] ;
  let genres = [];
  let genreString = "";
  for( let i=0; i< results.length; i++){
    genres = APIS.genres.filter(function(genre){
      return results[i].genre_ids.indexOf(genre.id) > -1; 
    });
    
    genreString = "<h4>";
    genres.forEach(function(genre){
      genreString += genre.name +", " ;
    });
      genreString += "</h4>";

    let title = results[i].title;
    let image = results[i].poster_path;
    let rating = results[i].vote_average;
    let movieId = results[i].id;

    theMovieDBInstance.getActorName(function(actorResults) {
      actorNames.push({actors:actorResults, movieId: movieId});
        for(let i=0; i<3; i++){
          document.getElementById("A" + movieId).innerHTML += actorResults[i].name + " | ";
        }//close for loop
    },movieId);//close getActorName function

    let movieTitle = '<div class="skew slide-single columns small-12 large-5 medium-5">\
                        <img class="image" id="'+movieId+'"src="'+image_path + image+'"/> <div id="rogue">\
                        <h2>'+title+'</h2><h3 id="A'+ movieId +'" class="movie-actors"></h3>\
                        <h4>'+genreString+'</h4></div>\
                        <div id="floating-button">\
                          <h2>'+rating+'</h2>\
                        </div>\
                      </div>'

    let wrapper = document.getElementById('popularwrapper');
    wrapper.innerHTML += movieTitle;

  }//close main for loop
 $('.sliderr').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });



// RENDER ABOUT-MOVIE PAGE
  $('.image').click(function() {
    let AJAX = new XMLHttpRequest();
    AJAX.open("GET", 'https://api.themoviedb.org/3/movie/'+ this.id +'?api_key=6c6774fdc0da477c7a3f3f7c03048117&language=en-US');
    AJAX.onreadystatechange = function(){
      if(AJAX.readyState != 4 || AJAX.status != 200){
        return;
      }
      let results = JSON.parse(AJAX.responseText);
      let movieId = results.id;

      const thisMovieActors = actorNames.filter(function(actorName){
        return actorName.movieId == results.id;
      })[0];
        console.log(thisMovieActors );

      let actors = '<div class="row ">';
      let mobileActors = '<div class="row ">';
      
      thisMovieActors.actors.forEach(function(actor, i){
        if( i < 4){
          let actorImage = image_path + actor.profile_path;
            actors += `<div class="small-3 columns image-padding-1">
                        <img src="${actorImage}">
                        <div class="row labelrow">
                            <div class="small-12 columns cast-name">${actor.name}</div>
                        </div>
                      </div>` ;

            mobileActors += `<div class="small-3 columns image-padding">
                              <img src="${actorImage}">
                              <div class="row labelrow">
                                  <div class="small-12 columns cast-name">${actor.name}</div>
                              </div>
                            </div>` ;
        }//end if statement
      });// end thisMovieActors function
          actors += '</div>'
          mobileActors += '</div>'

       
      let title = results.title;
      let image = results.poster_path;
      let rating = results.vote_average;
      let year = results.release_date;
      let duration = results.runtime;
      let plot = results.tagline;
      let storyline = results.overview;
       

      let movieDetails = 
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Movie Info</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,700" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700|Roboto:400,700" rel="stylesheet">
          <link rel="stylesheet" type="text/css" href="css/foundation.min.css">
          <link rel="stylesheet" type="text/css" href="css/styles.css">
        </head>
        <body>
        <header id="header" class=" zindex movieinfo-header img-bg"><img id ="trailer-image" class="image" src="${image_path + image}" style="background-image"/>
            <div class="top-bar ">
                <div class="top-barleft small-1">
                  <ul class="menu">
                      <li class="menu-text">
                        <a href="#">
                          <img class="header-logo" src="images/Moviebox-logo.png">
                        </a>
                      </li>
                  </ul>
                </div>
              <div class="top-barright small-1">
                  <ul class="menu">
                      <li>
                        <img class="search-icon" src="images/search.png">
                      </li>
                  </ul>
              </div>
            </div><!--close top-bar-->
        </header>     
        <div class="skeww"></div>

        <div class="rating small-3 medium-2 large-4">
          <p id="rate-number">${rating}</p>
            <p id="out-of">out of 10</p>
        </div><!--close rating-->
        <div class="row movie-poster small-5 medium-6 large-6 "><img class="image" src="${image_path + image}"/></div>
        <div class="mobile-year small-6">
            <div class="row">
              <h3 class="column small-6">Year</h3>
              <h3 class="column small-6">Duration</h3>
          </div>
          <div class="row ">
              <h4 class="column small-6">${year}</h4>
              <h4 class="column small-6">${duration}</h4>
          </div>
        </div><!--close mobile-year-->
        <div class="info">
            <div class="wrapper small-6 medium-6 large-6">
                <div class="row">
                  <h1 class="font">
                    <span class="bold">${title}</span>
                    <span class="bold"></span>
                  </h1>
                </div>
              <div class="row">
                <h2> ${year}</h2>
              </div>
              <div class="row">
                <h3>
                  <span class="bold-title">Director:</span>
                  <span class="regular-name">Gareth Edwards</span>
                </h3>
              </div>
              <div class="row writers">
                <h3>
                  <span class="bold-title">Writers:</span>
                  <span class="regular-name">Chris Weitz and Tony Gilroy</span>
                </h3>
              </div>
            </div><!--wrapper-->
        </div><!--close info-->
        <div class="more-info-wrapper">
            <div class="row">
              <h3 class="column small-6"><span class="bold-font">Duration: </span><span class="regular-font">${duration}</span></h3>
            </div>
            <div class="row">
              <h3 class="column small-6"><span class="bold-font">Genre: </span><span class="regular-font">${genreString}</span></h3>
            </div>
        </div><!--close more-info-wrapper-->
        <!---
        class mobile-storyline  and mobile-main-cast is only displayed in mobile devices
        -->
        <div class="mobile-storyline">
          <div class="row">
              <h3 class="column small-6">Storyline</h3>
          </div>
          <div class="row">
              <div class="column small-12"">
                  <div class="mobile-storyline-info">${storyline}</div> 
              </div>
          </div>
        </div><!--close mobile-storyline-->
        <div class="mobile-main-cast">
          <div class="row">
              <h3 class="column small-6">Cast</h3>
          </div>
          ${mobileActors}
          
        </div> <!--close mobile-main-cast-->
        <div class="movie-summary">
          <div class="row">
              <h3 class="column small-6">Stills</h3>
              <h3 class="column small-6 plot-heading">Plot</h3>
          </div>
          <div class="row">
              <div class="small-12 medium-6 large-6 columns movie-stills">
                  <img class="small-6 columns" src="${image_path + image}">
                  <img class="small-6 columns" src="${image_path + image}">
              </div>
              <div class="small-12 medium-6 large-6 columns">
                  <div class="plot">${plot}</div> 
                  <h3 class="storyline">Storyline</h3>
              </div>
          </div>
        </div><!--close movie-summary-->
        <div class="movie-summary-2">
          <div class="row">
              <div class="small-6 columns movie-stills-2">
                  <img class="small-3 columns" src="${image_path + image}">
                  <img class="small-3 columns" src="${image_path + image}">
              </div>
              <div class="small-6 columns">
                  <div class="storyline-info">
                  ${storyline}
                  </div>   
              </div>
          </div>
        </div><!--close movie-summary-2-->
        <div class="main-cast">
          <div class="row">
              <h3 class="column small-6">Cast</h3>
          </div>
          ${actors}
        </div><!--close main-cast-->
          <div id="myId">
            
          </div>
          </div>
        <footer>
          <div class="row align-center">
            <img class="footer-logo" src="images/Moviebox-logo.png">
          </div>
          <div class="row align-center">
            <div class="columns large-2 medium-2 small-12">
              <h4>About</h4>
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Term of Use</h4> 
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>FAQ</h4>
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Privacy</h4> 
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Contact Us</h4> 
            </div>
          </div>
        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        </footer>
        </body>
        </html>`

        document.body.innerHTML = movieDetails;
        document.getElementById("header").style.backgroundImage="url('"+image_path + image +"')";

      };//close AJAX function
      AJAX.send();
    });//close .image function
});
 // close popular movies function





//.............RENDER RECENT MOVIES..........\\ 

theMovieDBInstance.getRecentMovies(function(results) {

    let actorNames = [] ;
    let genres = [];
    let genreString = "";

    for( let i=0; i< results.length; i++){
      genres = APIS.genres.filter(function(genre){
        return results[i].genre_ids.indexOf(genre.id) > -1; 
      });
      
      genreString = "<h4>";
      genres.forEach(function(genre){
        genreString += genre.name +", " ;
      });
        genreString += "</h4>";

      let title = results[i].title;
      let image = results[i].poster_path;
      let rating = results[i].vote_average;
      let movieId = results[i].id;

      theMovieDBInstance.getActorName(function(actorResults) {
        console.log(actorResults);
        actorNames.push({actors:actorResults, movieId: movieId});
    
        for(let i=0; i<3; i++){
          document.getElementById("B" + movieId).innerHTML += actorResults[i].name + " | ";
        
        }//close for loop
      },movieId);//close getActorName function
       
      let movieTitle = '<div class="skew slide-single columns small-12 large-5 medium-5">\
                          <img class="image" id="'+movieId+'"src="'+image_path + image+'"/> <div id="rogue">\
                          <h2>'+title+'</h2><h3 id="B'+ movieId +'" class="movie-actors"></h3>\
                          <h4>'+genreString+'</h4></div>\
                          <div id="floating-button">\
                            <h2>'+rating+'</h2>\
                          </div>\
                        </div>'

      let wrapper = document.getElementById('recentmovieswrapper');
      wrapper.innerHTML += movieTitle;
       
    }//close for loop
 $('.sliderr1').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });
  // RENDER ABOUT-MOVIE PAGE
  $('.image').click(function() {
    let AJAX = new XMLHttpRequest();
    AJAX.open("GET", 'https://api.themoviedb.org/3/movie/'+ this.id +'?api_key=6c6774fdc0da477c7a3f3f7c03048117&language=en-US');
    AJAX.onreadystatechange = function(){
      if(AJAX.readyState != 4 || AJAX.status != 200){
        return;
      }
      let results = JSON.parse(AJAX.responseText);
      let movieId = results.id;

      const thisMovieActors = actorNames.filter(function(actorName){
        return actorName.movieId == results.id;
      })[0];
        console.log(thisMovieActors );

      let actors = '<div class="row ">';
      let mobileActors = '<div class="row ">';
      
      thisMovieActors.actors.forEach(function(actor, i){
        if( i < 4){
          let actorImage = image_path + actor.profile_path;
            actors += `<div class="small-3 columns image-padding-1">
                        <img src="${actorImage}">
                        <div class="row labelrow">
                            <div class="small-12 columns cast-name">${actor.name}</div>
                        </div>
                      </div>` ;

            mobileActors += `<div class="small-3 columns image-padding">
                              <img src="${actorImage}">
                              <div class="row labelrow">
                                  <div class="small-12 columns cast-name">${actor.name}</div>
                              </div>
                            </div>` ;
        }//end if statement
      });// end thisMovieActors function
          actors += '</div>'
          mobileActors += '</div>'

       
      let title = results.title;
      let image = results.poster_path;
      let rating = results.vote_average;
      let year = results.release_date;
      let duration = results.runtime;
      let plot = results.tagline;
      let storyline = results.overview;
       

      let movieDetails = 
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Movie Info</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,700" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700|Roboto:400,700" rel="stylesheet">
          <link rel="stylesheet" type="text/css" href="css/foundation.min.css">
          <link rel="stylesheet" type="text/css" href="css/styles.css">
        </head>
        <body>
        <header id="header" class=" zindex movieinfo-header img-bg"><img id ="trailer-image" class="image" src="${image_path + image}" style="background-image"/>
            <div class="top-bar ">
                <div class="top-barleft small-1">
                  <ul class="menu">
                      <li class="menu-text">
                        <a href="#">
                          <img class="header-logo" src="images/Moviebox-logo.png">
                        </a>
                      </li>
                  </ul>
                </div>
              <div class="top-barright small-1">
                  <ul class="menu">
                      <li>
                        <img class="search-icon" src="images/search.png">
                      </li>
                  </ul>
              </div>
            </div><!--close top-bar-->
        </header>     
        <div class="skeww"></div>

        <div class="rating small-3 medium-2 large-4">
          <p id="rate-number">${rating}</p>
            <p id="out-of">out of 10</p>
        </div><!--close rating-->
        <div class="row movie-poster small-5 medium-6 large-6 "><img class="image" src="${image_path + image}"/></div>
        <div class="mobile-year small-6">
            <div class="row">
              <h3 class="column small-6">Year</h3>
              <h3 class="column small-6">Duration</h3>
          </div>
          <div class="row ">
              <h4 class="column small-6">${year}</h4>
              <h4 class="column small-6">${duration}</h4>
          </div>
        </div><!--close mobile-year-->
        <div class="info">
            <div class="wrapper small-6 medium-6 large-6">
                <div class="row">
                  <h1 class="font">
                    <span class="bold">${title}</span>
                    <span class="bold"></span>
                  </h1>
                </div>
              <div class="row">
                <h2> ${year}</h2>
              </div>
              <div class="row">
                <h3>
                  <span class="bold-title">Director:</span>
                  <span class="regular-name">Gareth Edwards</span>
                </h3>
              </div>
              <div class="row writers">
                <h3>
                  <span class="bold-title">Writers:</span>
                  <span class="regular-name">Chris Weitz and Tony Gilroy</span>
                </h3>
              </div>
            </div><!--wrapper-->
        </div><!--close info-->
        <div class="more-info-wrapper">
            <div class="row">
              <h3 class="column small-6"><span class="bold-font">Duration: </span><span class="regular-font">${duration}</span></h3>
            </div>
            <div class="row">
              <h3 class="column small-6"><span class="bold-font">Genre: </span><span class="regular-font">${genreString}</span></h3>
            </div>
        </div><!--close more-info-wrapper-->
        <!---
        class mobile-storyline  and mobile-main-cast is only displayed in mobile devices
        -->
        <div class="mobile-storyline">
          <div class="row">
              <h3 class="column small-6">Storyline</h3>
          </div>
          <div class="row">
              <div class="column small-12"">
                  <div class="mobile-storyline-info">${storyline}</div> 
              </div>
          </div>
        </div><!--close mobile-storyline-->
        <div class="mobile-main-cast">
          <div class="row">
              <h3 class="column small-6">Cast</h3>
          </div>
          ${mobileActors}
          
        </div> <!--close mobile-main-cast-->
        <div class="movie-summary">
          <div class="row">
              <h3 class="column small-6">Stills</h3>
              <h3 class="column small-6 plot-heading">Plot</h3>
          </div>
          <div class="row">
              <div class="small-12 medium-6 large-6 columns movie-stills">
                  <img class="small-6 columns" src="${image_path + image}">
                  <img class="small-6 columns" src="${image_path + image}">
              </div>
              <div class="small-12 medium-6 large-6 columns">
                  <div class="plot">${plot}</div> 
                  <h3 class="storyline">Storyline</h3>
              </div>
          </div>
        </div><!--close movie-summary-->
        <div class="movie-summary-2">
          <div class="row">
              <div class="small-6 columns movie-stills-2">
                  <img class="small-3 columns" src="${image_path + image}">
                  <img class="small-3 columns" src="${image_path + image}">
              </div>
              <div class="small-6 columns">
                  <div class="storyline-info">
                  ${storyline}
                  </div>   
              </div>
          </div>
        </div><!--close movie-summary-2-->
        <div class="main-cast">
          <div class="row">
              <h3 class="column small-6">Cast</h3>
          </div>
          ${actors}
        </div><!--close main-cast-->
          <div id="myId">
            
          </div>
        <footer>
          <div class="row align-center">
            <img class="footer-logo" src="images/Moviebox-logo.png">
          </div>
          <div class="row align-center">
            <div class="columns large-2 medium-2 small-12">
              <h4>About</h4>
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Term of Use</h4> 
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>FAQ</h4>
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Privacy</h4> 
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Contact Us</h4> 
            </div>
          </div>
        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        </footer>
        </body>
        </html>`

        document.body.innerHTML = movieDetails;
        document.getElementById("header").style.backgroundImage="url('"+image_path + image +"')";

      };//close AJAX function
      AJAX.send();
    });//close .image function
});



//RENDER COMEDY MOVIES
theMovieDBInstance.getComedyMovies(function(results) {
    console.log(results);
    let actorNames = [] ;
    let genres = [];
    let genreString = "";
    for( let i=0; i< results.length; i++){
        genres = APIS.genres.filter(function(genre){
          return results[i].genre_ids.indexOf(genre.id) > -1; 
        });
      
        genreString = "<h4>";
        genres.forEach(function(genre){
          genreString += genre.name +", " ;
        });
        genreString += "</h4>";

      let title = results[i].title;
      let image = results[i].poster_path;
      let rating = results[i].vote_average;
      let movieId = results[i].id;

      theMovieDBInstance.getActorName(function(actorResults) {
        console.log(actorResults);
        actorNames.push({actors:actorResults, movieId: movieId});
    
        for(let i=0; i<3; i++){
          document.getElementById("C" + movieId).innerHTML += actorResults[i].name + " | ";
        
        }//close for loop
      },movieId);//close getActorName function
       

        let movieTitle = '<div class="skew slide-single columns small-12 large-5 medium-5">\
                          <img class="image" id="'+movieId+'"src="'+image_path + image+'"/> <div id="rogue">\
                          <h2>'+title+'</h2><h3 id="C'+ movieId +'" class="movie-actors"></h3>\
                          <h4>'+genreString+'</h4></div>\
                          <div id="floating-button">\
                            <h2>'+rating+'</h2>\
                          </div>\
                        </div>'


      let wrapper = document.getElementById('comedywrapper');
      wrapper.innerHTML += movieTitle;
    }
     $('.sliderr2').slick({
    centerMode: true,
    centerPadding: '60px',
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '40px',
          slidesToShow: 1
        }
      }
    ]
  });

//close for loop
  // RENDER ABOUT-MOVIE PAGE
  $('.image').click(function() {
    let AJAX = new XMLHttpRequest();
    AJAX.open("GET", 'https://api.themoviedb.org/3/movie/'+ this.id +'?api_key=6c6774fdc0da477c7a3f3f7c03048117&language=en-US');
    AJAX.onreadystatechange = function(){
      if(AJAX.readyState != 4 || AJAX.status != 200){
        return;
      }
      let results = JSON.parse(AJAX.responseText);
      let movieId = results.id;

      const thisMovieActors = actorNames.filter(function(actorName){
        return actorName.movieId == results.id;
      })[0];
        console.log(thisMovieActors );

      let actors = '<div class="row ">';
      let mobileActors = '<div class="row ">';
      
      thisMovieActors.actors.forEach(function(actor, i){
        if( i < 4){
          let actorImage = image_path + actor.profile_path;
            actors += `<div class="small-3 columns image-padding-1">
                        <img src="${actorImage}">
                        <div class="row labelrow">
                            <div class="small-12 columns cast-name">${actor.name}</div>
                        </div>
                      </div>` ;

            mobileActors += `<div class="small-3 columns image-padding">
                              <img src="${actorImage}">
                              <div class="row labelrow">
                                  <div class="small-12 columns cast-name">${actor.name}</div>
                              </div>
                            </div>` ;
        }//end if statement
      });// end thisMovieActors function
          actors += '</div>'
          mobileActors += '</div>'

       
      let title = results.title;
      let image = results.poster_path;
      let rating = results.vote_average;
      let year = results.release_date;
      let duration = results.runtime;
      let plot = results.tagline;
      let storyline = results.overview;
       

      let movieDetails = 
        `<!DOCTYPE html>
        <html>
        <head>
          <title>Movie Info</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
            <link href="https://fonts.googleapis.com/css?family=Oswald:300,400,700" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,700|Roboto:400,700" rel="stylesheet">
          <link rel="stylesheet" type="text/css" href="css/foundation.min.css">
          <link rel="stylesheet" type="text/css" href="css/styles.css">
        </head>
        <body>
        <header id="header" class=" zindex movieinfo-header img-bg"><img id ="trailer-image" class="image" src="${image_path + image}" style="background-image"/>
            <div class="top-bar ">
                <div class="top-barleft small-1">
                  <ul class="menu">
                      <li class="menu-text">
                        <a href="#">
                          <img class="header-logo" src="images/Moviebox-logo.png">
                        </a>
                      </li>
                  </ul>
                </div>
              <div class="top-barright small-1">
                  <ul class="menu">
                      <li>
                        <img class="search-icon" src="images/search.png">
                      </li>
                  </ul>
              </div>
            </div><!--close top-bar-->
        </header>     
        <div class="skeww"></div>

        <div class="rating small-3 medium-2 large-4">
          <p id="rate-number">${rating}</p>
            <p id="out-of">out of 10</p>
        </div><!--close rating-->
        <div class="row movie-poster small-5 medium-6 large-6 "><img class="image" src="${image_path + image}"/></div>
        <div class="mobile-year small-6">
            <div class="row">
              <h3 class="column small-6">Year</h3>
              <h3 class="column small-6">Duration</h3>
          </div>
          <div class="row ">
              <h4 class="column small-6">${year}</h4>
              <h4 class="column small-6">${duration}</h4>
          </div>
        </div><!--close mobile-year-->
        <div class="info">
            <div class="wrapper small-6 medium-6 large-6">
                <div class="row">
                  <h1 class="font">
                    <span class="bold">${title}</span>
                    <span class="bold"></span>
                  </h1>
                </div>
              <div class="row">
                <h2> ${year}</h2>
              </div>
              <div class="row">
                <h3>
                  <span class="bold-title">Director:</span>
                  <span class="regular-name">Gareth Edwards</span>
                </h3>
              </div>
              <div class="row writers">
                <h3>
                  <span class="bold-title">Writers:</span>
                  <span class="regular-name">Chris Weitz and Tony Gilroy</span>
                </h3>
              </div>
            </div><!--wrapper-->
        </div><!--close info-->
        <div class="more-info-wrapper">
            <div class="row">
              <h3 class="column small-6"><span class="bold-font">Duration: </span><span class="regular-font">${duration}</span></h3>
            </div>
            <div class="row">
              <h3 class="column small-6"><span class="bold-font">Genre: </span><span class="regular-font">${genreString}</span></h3>
            </div>
        </div><!--close more-info-wrapper-->
        <!---
        class mobile-storyline  and mobile-main-cast is only displayed in mobile devices
        -->
        <div class="mobile-storyline">
          <div class="row">
              <h3 class="column small-6">Storyline</h3>
          </div>
          <div class="row">
              <div class="column small-12"">
                  <div class="mobile-storyline-info">${storyline}</div> 
              </div>
          </div>
        </div><!--close mobile-storyline-->
        <div class="mobile-main-cast">
          <div class="row">
              <h3 class="column small-6">Cast</h3>
          </div>
          ${mobileActors}
          
        </div> <!--close mobile-main-cast-->
        <div class="movie-summary">
          <div class="row">
              <h3 class="column small-6">Stills</h3>
              <h3 class="column small-6 plot-heading">Plot</h3>
          </div>
          <div class="row">
              <div class="small-12 medium-6 large-6 columns movie-stills">
                  <img class="small-6 columns" src="${image_path + image}">
                  <img class="small-6 columns" src="${image_path + image}">
              </div>
              <div class="small-12 medium-6 large-6 columns">
                  <div class="plot">${plot}</div> 
                  <h3 class="storyline">Storyline</h3>
              </div>
          </div>
        </div><!--close movie-summary-->
        <div class="movie-summary-2">
          <div class="row">
              <div class="small-6 columns movie-stills-2">
                  <img class="small-3 columns" src="${image_path + image}">
                  <img class="small-3 columns" src="${image_path + image}">
              </div>
              <div class="small-6 columns">
                  <div class="storyline-info">
                  ${storyline}
                  </div>   
              </div>
          </div>
        </div><!--close movie-summary-2-->
        <div class="main-cast">
          <div class="row">
              <h3 class="column small-6">Cast</h3>
          </div>
          ${actors}
        </div><!--close main-cast-->
          <div id="myId">
            
          </div>
        <footer>
          <div class="row align-center">
            <img class="footer-logo" src="images/Moviebox-logo.png">
          </div>
          <div class="row align-center">
            <div class="columns large-2 medium-2 small-12">
              <h4>About</h4>
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Term of Use</h4> 
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>FAQ</h4>
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Privacy</h4> 
            </div>
            <div class="columns large-2 medium-2 small-12">
              <h4>Contact Us</h4> 
            </div>
          </div>
        <script type="text/javascript" src="js/jquery.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        </footer>
        </body>
        </html>`

        document.body.innerHTML = movieDetails;
        document.getElementById("header").style.backgroundImage="url('"+image_path + image +"')";

      };//close AJAX function
      AJAX.send();
    });//close .image function
});








// Authenticate themoviedatabase with a key

// var AJAX = new XMLHttpRequest();
// AJAX.open("GET", "https://api.themoviedb.org/3/movie/550?api_key=6c6774fdc0da477c7a3f3f7c03048117");
// AJAX.onreadystatechange = function(){
//  if(AJAX.readyState != 4 || AJAX.status != 200){
//      return;
//  }
//  const response = JSON.parse(AJAX.responseText)
//  // data = AJAX.responseText;
//  console.log(response);
// }
// AJAX.send();



// Authenticate kvikmyndir with a key

// $.ajax({
//     url : 'http://api.kvikmyndir.is/authenticate',
//     type : 'POST',
//     data : {
//         username : "judy_njeru",
//         password : "1timberlake"
//     },
//     dataType : 'json',
//     success : function (response) {
//         console.log(response);
//     }
// });








        



   
                        
