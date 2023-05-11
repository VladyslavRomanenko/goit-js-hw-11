import { fetchImages } from './fetch-images';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreRef = document.querySelector('.load-more');

let page = 1;

loadMoreRef.style.display = 'none';

const onInput = debounce(async () => {
  try {
    const value = formRef.elements.searchQuery.value;
    page = 1;
    const packs = await fetchImages(value, page);
    const pack = packs.hits;
    loadMoreRef.style.display = 'none';
    const arrayImg = pack.map(img => createImg(img)).join('');
    galleryRef.insertAdjacentHTML('afterbegin', arrayImg);
    loadMoreRef.style.display = 'block';
    if (pack.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${packs.totalHits}  images.`);
    }
  } catch (error) {
    throw Error(error);
  }
}, 500);

const onLoadMore = async () => {
  try {
    page++;
    const value = formRef.elements.searchQuery.value;
    const newPacks = await fetchImages(value, page);
    const newPack = newPacks.hits;
    const markup = newPack.map(img => createImg(img)).join('');
    galleryRef.insertAdjacentHTML('beforeend', markup);
    if (page * 40 >= newPacks.totalHits) {
      loadMoreRef.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    throw Error(error);
  }
};

formRef.addEventListener('submit', event => {
  event.preventDefault();
  onInput();
});
loadMoreRef.addEventListener('click', onLoadMore);

function createImg(img) {
  return `<div class="photo-card">
  <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes <br>${img.likes}</br></b>
    </p>
    <p class="info-item">
      <b>Views <br>${img.views}</b></b>
    </p>
    <p class="info-item">
      <b>Comments <br>${img.comments}</br></b>
    </p>
    <p class="info-item">
      <b>Downloads <br>${img.downloads}</br></b>
    </p>
  </div>
</div>`;
}
