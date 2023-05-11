import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const MY_KEY = '36218076-8e9a49d554f80cd792785c055';

export const fetchImages = async (name, page) => {
  const { data } = await axios.get(
    `?key=${MY_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return data.hits;
};

export const getTotalHits = async name => {
  const { data } = await axios.get(
    `?key=${MY_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  return data;
  
};
