import SlimSelect from 'slim-select';

const API_KEY =
  'live_AOMLy9FQP2AprBRZa9P6LO4OfKZc4cmmqUhSZ0GmjQ7NKuwTOUk1hRB1ZkJ4WpJR';

const select = document.querySelector('.js-select');
select.addEventListener('change', onSelect);
const catInfoBox = document.querySelector('.js-cat-info');
const loader = document.querySelector('.loader');
const errorEl = document.querySelector('.error');

errorEl.style.visibility = 'hidden';
loader.style.visibility = 'hidden';

function onSelect(event) {
  const id = event.currentTarget.value;

  fetchCatByBreed(id)
    .then(data => {
      errorEl.style.visibility = 'hidden';
      loader.style.visibility = 'hidden';

      catInfoMarkup(data);
    })
    .catch(error => {
      console.log(error);
      loader.style.visibility = 'hidden';
      errorEl.style.visibility = 'visible';
    });
}

function startFetch() {
  return fetch('https://api.thecatapi.com/v1/breeds').then(resp => {
    errorEl.style.visibility = 'hidden';
    loader.style.visibility = 'visible';

    if (!resp.ok) {
      throw new Error(resp.StatusText);
    }
    return resp.json();
  });
}

startFetch()
  .then(data => {
    selectMarkup(data);
    loader.style.visibility = 'hidden';
  })
  .catch(error => {
    loader.style.visibility = 'hidden';
    errorEl.style.visibility = 'visible';
    console.log(error);
  });

function selectMarkup(data) {
  const markup = data
    .map(({ id, name }, i) => {
      return `<option value = '${id}'>${name}</option>`;
    })
    .join('');
  select.insertAdjacentHTML('beforeend', markup);

  new SlimSelect({
    select: '#single',
  });
}

function fetchCatByBreed(breedId) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&api_key=${API_KEY}`
  ).then(resp => {
    errorEl.style.visibility = 'hidden';
    loader.style.visibility = 'visible';

    if (!resp.ok) {
      throw Error(resp.StatusText);
    }
    return resp.json();
  });
}

function catInfoMarkup(cats) {
  catInfoBox.innerHTML = '';
  const markup = cats
    .map(
      ({
        url,
        breeds: {
          0: { description, name, temperament },
        },
      }) => {
        return `<div style="height: 300px;"><img height="300px" src="${url}" alt="${name}"></div>
    <div>
    <h2>${name}</h2>
    <p>${description}</p>
    <p><span class='js-temperament'>Temperament: </span> ${temperament}</p>
    </div>`;
      }
    )
    .join();
  catInfoBox.insertAdjacentHTML('beforeend', markup);
}
