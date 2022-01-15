import axios from 'axios';
// const server = axios.create({
//   baseURL: `https://pixabay.com/api/?key=25261319-41493d7d09d351884ef55fa82&q=${search}&image_type=photo&orientation=horizontal&safesearch=true`,
// });

function makesRequest(search) {
  let pageAmount = 1;
  return axios
    .get(
      `https://pixabay.com/api/?key=25261319-41493d7d09d351884ef55fa82&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageAmount}`,
    )
    .then(responce => responce.data);
}

export { makesRequest };
