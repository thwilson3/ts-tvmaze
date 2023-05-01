import axios from "axios";
import * as $ from 'jquery';

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesBtn = $(".Show-getEpisodes");

const BASE_URL = "https://api.tvmaze.com/search/shows";

interface ShowInterface {
  id: number,
  name: string,
  summary: string,
  image: string
}

interface EpisodeInterface {
  id: number,
  name: string,
  season: number,
  number: number
}


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term: string) : Promise<ShowInterface[]> {

  const shows = await axios.get(`${BASE_URL}?q=${term}`)

  console.log("shows in getshowsbyterm", shows);


  return shows.data.map(show => {
      return {id: show.show.id,
      name: show.show.name,
      summary: show.show.summary,
      image: show.show.image?.medium}
  })
};


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: ShowInterface[]) : void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt="Bletchly Circle San Francisco"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() : Promise<void> {
  const term = $("#searchForm-term").val() as string;
  console.log("term", term);

  const shows = await getShowsByTerm(term);
  console.log("shows", shows);


  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt: JQuery.SubmitEvent) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number): Promise<EpisodeInterface[]> {
  const response = await axios.get(`${BASE_URL}/${id}/episodes`);

  return response.data.map(episode => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    };

  });

 }

/** Write a clear docstring for this function... */

function populateEpisodes(episodes: EpisodeInterface[]): void {
  $episodesArea.empty();

  for (let episode of episodes) {
    const $episode = $(`<li>${episode.name} (Season ${episode.season}, episode ${episode.number}</li>`);

    $episodesArea.append($episode);

  }

 }