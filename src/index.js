import './sass/main.scss';
import { makesRequest } from './js/api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import itemsTemplate from './template/index.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSearchElement);

function onSearchElement(e) {
  e.preventDefault();
  clearList();
  const inputText = e.currentTarget.elements.searchQuery.value.trim();

  if (inputText === '') {
    clearList();
    return;
  }

  makesRequest(inputText).then(responce => {
    console.log(responce.hits);
    createGalleryList(responce.hits);
  });
}

function createGalleryList(elements) {
  const markup = itemsTemplate(elements);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearList() {
  refs.gallery.innerHTML = '';
}

new SimpleLightbox('.photo-card a', {
  captionsData: `alt`,
  captionPosition: 'bottom',
  captionDelay: 250,
  enableKeyboard: true,
  doubleTapZoom: 5,
});
