import { fetchImages } from './fetch-images';
import { getTotalHits } from './fetch-images';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const buttonRef = document.querySelector('.button');
const loadMoreRef = document.querySelector('.load-more');

let pack;
let page = 1;

loadMoreRef.style.display = 'none';

const onInput = async event => {
  event.preventDefault();
  try {
    let value = formRef.elements.searchQuery.value;
    page = 1;
    pack = await fetchImages(value, page);
    const total = await getTotalHits(value);
    loadMoreRef.style.display = 'none';
    if (pack.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.info(`Hooray! We found ${total.totalHits}  images.`);
    }
  } catch (error) {
    throw Error(error);
  }
};

const onLoadMore = async () => {
  try {
    page++;
    const value = formRef.elements.searchQuery.value;
    const newPack = await fetchImages(value, page);
    const arrayImg = newPack.map(img => createImg(img)).join('');
    const total = await getTotalHits(value);
    galleryRef.insertAdjacentHTML('beforeend', arrayImg);
    if (page * 40 >= total.totalHits) {
      loadMoreRef.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    throw Error(error);
  }
};

const onSearch = event => {
  event.preventDefault();
  try {
    const arrayImg = pack.map(img => createImg(img)).join('');
    galleryRef.insertAdjacentHTML('afterbegin', arrayImg);
    galleryRef.innerHTML = arrayImg;
    loadMoreRef.style.display = 'block';
  } catch (error) {
    throw Error(error);
  }
};

function createImg(img) {
  return `<div class="photo-card">
  <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" width="330" height="250" />
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
formRef.addEventListener('input', debounce(onInput, 500));
buttonRef.addEventListener('click', onSearch);
loadMoreRef.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
});
