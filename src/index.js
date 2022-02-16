import './sass/main.scss';
import { makesRequest } from './js/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import itemsTemplate from './template/index.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadButton: document.querySelector('.load-more'),
};

let pageAmount = 1;
let inputText = '';
let pageLength = 0;

refs.form.addEventListener('submit', onSearchElement);
refs.loadButton.addEventListener('click', onLoadMore);

async function onSearchElement(e) {
  e.preventDefault();
  clearList();

  inputText = e.currentTarget.elements.searchQuery.value.trim();

  if (inputText === '') {
    clearList();
    refs.loadButton.classList.add('visually-hidden');
    return;
  }
  pageAmount = 1;
  pageLength = 40;
  refs.loadButton.classList.add('visually-hidden');

  try {
    const responce = await makesRequest(inputText, pageAmount);

    if (responce.totalHits === 0) {
      clearList();
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      refs.loadButton.classList.add('visually-hidden');
      return;
    }

    Notify.success(`Hooray! We found ${responce.totalHits} images.`);
    createGalleryList(responce.hits);

    if (responce.totalHits > 40) {
      refs.loadButton.classList.remove('visually-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    pageAmount += 1;
    const responce = await makesRequest(inputText, pageAmount);

    createGalleryList(responce.hits);
    smoothScroll();

    pageLength += responce.hits.length;

    if (pageLength >= responce.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.loadButton.classList.add('visually-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

function createGalleryList(elements) {
  const markup = itemsTemplate(elements);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox();
}

function clearList() {
  refs.gallery.innerHTML = '';
}

function lightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
    captionDelay: 250,
    enableKeyboard: true,
    doubleTapZoom: 5,
  });
  lightbox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
