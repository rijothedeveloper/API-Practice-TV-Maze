/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

// Base url for api
const BASE_URL = "http://api.tvmaze.com/";

async function searchShows(query) {
  // end point for search
  const end_point = "search/shows"
  const res = await axios.get(BASE_URL+end_point, {params: {"q": query}});
  const shows = [];
  
  for (item of res.data) {
    const show = {};
    show.id = item.show.id;
    show.name = item.show.name;
    show.summary = item.show.summary;
    try {
      show.image = item.show.image.medium;
    } catch {
      show.image = "https://tinyurl.com/tv-missing";
    }
      
    shows.push(show);
  }
  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <a href="#" class="btn btn-primary">Episodes</a>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
    $(".card-body").click(async function(evt) {
      const id = evt.target.closest(".card").dataset.showId;
      const episodes = await getEpisodes(id);
      populateEpisodes(episodes);
    })
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const endUrl = `shows/${id}/episodes`;
  const res = await axios.get(BASE_URL+endUrl);
  const episodes = [];
  for(item of res.data) {
    const {id, name, season, number} = item;
    episodes.push({
      id, 
      name, 
      season, 
      number
    })
  }
  return episodes;
}

/** Populate episodes list:
 *     - given list of episodes, add spisodes to DOM and unhide episode area
 */

function populateEpisodes(episodes) {
  const episodesArea = $("#episodes-area");
  const episodeList = $("#episodes-list");
  episodeList.empty();
  for (let episode of episodes) {
    const li = document.createElement("li");
    li.innerText = `(${episode.name}, season ${episode.season}, number ${episode.number})`;
    episodeList.append(li);
  }
  episodesArea.append(episodeList);
  episodesArea.show();
}
