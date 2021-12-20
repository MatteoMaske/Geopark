

//INIZIALIZZO PAGINA CON LOGO E DIV PRINCIPALE
const app = document.getElementById('root');

const logo = document.createElement('img');
logo.setAttribute('class', 'foto');
logo.setAttribute('align', 'center');
logo.src = '../Image/logo.png';
logo.onclick = () => {
  initialize();
};

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(logo);

app.appendChild(container);

//INIZIALIZZO LA PAGINA PRINCIPALE CON L'ELENCO PARCHI
initialize();

function initialize() {

  while (container.firstChild) container.removeChild(container.firstChild);
  while (app.firstChild) app.removeChild(app.firstChild);

  app.appendChild(logo);
  app.appendChild(container);

  const list = document.createElement('ul');
  list.setAttribute('class', 'list-group');

  container.appendChild(list);

  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:49146/api/parchi', true);
  request.onload = function () {


    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      data.forEach(parco => {

        if (parco.Preferiti) {
          
          //LI CON NOME PARCO
          let item = document.createElement('li');
          item.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center ');
          item.textContent = (parco.Nome);
          item.onclick = () => {
            changeContainerPointsPage2(parco.Id);
            disabledEventPropagation(this);
          }
          
          //SPAN CON STELLINA PER PREFERITI
          let span = document.createElement('span');
          span.setAttribute('class', 'badge bg-primary rounded-pill');
          span.textContent = ('★');
          span.onclick = () => {
            let star = span.textContent;
            changeStar(star, parco.Id);
            disabledEventPropagation(this);

          }

          item.appendChild(span);
          list.appendChild(item);
        }
      });

      data.forEach(parco => {

        if (!(parco.Preferiti)) {

          let item = document.createElement('li');
          item.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
          item.textContent = (parco.Nome);
          item.onclick = () => {
            changeContainerPointsPage2(parco.Id);
            disabledEventPropagation(this);
          }

          let span = document.createElement('span');
          span.setAttribute('class', 'badge bg-primary rounded-pill');
          span.textContent = ('☆');
          span.onclick = () => {
            let star = span.textContent;
            changeStar(star, parco.Id);
            disabledEventPropagation(this);

          }

          item.appendChild(span);
          list.appendChild(item);
        }
      });

    }
  }

  request.send();
}

// GESTIONE DELLA SECONDA PAGINA AL CLICK DEL PARCO
function changeContainerPointsPage2(ID) {
  while (container.firstChild) container.removeChild(container.firstChild);
  while (app.firstChild) app.removeChild(app.firstChild);

  app.appendChild(logo);
  app.appendChild(generateDropDown(ID));

  //creo div per mappa
  const mapDiv = document.createElement('div');
  mapDiv.setAttribute('id', 'map');
  app.appendChild(mapDiv);
  app.appendChild(container);


  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:49146/api/punti?id=' + ID, true);
  request.onload = function () {

    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {

      //centro mappa nel parco

      let long = data[0].CoordinateParco.Long;
      let lat = data[0].CoordinateParco.Lat;
      const map = createMap(long, lat);

      //aggiungo nome del parco
      let nomeParco = data[0].Nome;
      addTitle(nomeParco);

      // stampo card punti interesse
      data[0].Punti.forEach(punto => {

        let affluenza = changeAffluenza();

        if (punto.Interesse) createMarker(punto.Coordinate.Long, punto.Coordinate.Lat, map, punto.Immagine, punto.NomePunto, affluenza);
        else createMarker(punto.Coordinate.Long, punto.Coordinate.Lat, map, punto.Immagine, punto.NomePunto, affluenza);

        //card principale
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('style', 'width: 15rem;');
        //immagine
        const image = document.createElement('img');
        image.setAttribute('src', punto.Immagine);
        image.setAttribute('class', "card-img-top");
        card.appendChild(image);

        //titolo e info parco
        const cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card-body');

        //nome parco
        let title = document.createElement('h5');
        title.setAttribute('class', 'card-title')
        title.textContent = (punto.NomePunto);
        cardBody.appendChild(title);

        //sottotitolo coordinate
        title = document.createElement('h6');
        title.setAttribute('class', 'card-title');
        if (!punto.Interesse) {
          title.textContent = ('Ristoro');
        } else title.textContent = ('Attrazione');

        //affluenza
        let p = document.createElement('p');
        p.textContent = ("Affluenza corrente ");
        let font = document.createElement('font');
        if (affluenza < 30) font.setAttribute('color', 'green');
        else if (affluenza >= 30 && affluenza < 60) font.setAttribute('color', '#d9cf0d');
        else font.setAttribute('color', 'red');
        font.textContent = (affluenza + '%');
        p.appendChild(font);

        cardBody.appendChild(title);
        cardBody.appendChild(p);
        card.appendChild(cardBody);

        container.appendChild(card);
      });
    }
  }

  request.send();
}

//AGGIORNA PAGINA PUNTI D'INTERESSE AL CLICK DEL FILTRO
function AttractionFilter(filtro, ID) {

  // svuoto container
  while (container.firstChild) container.removeChild(container.firstChild);
  while (app.firstChild) app.removeChild(app.firstChild);

  app.appendChild(logo);
  app.appendChild(generateDropDown(ID));

  //creo div per mappa
  const mapDiv = document.createElement('div');
  mapDiv.setAttribute('id', 'map');
  app.appendChild(mapDiv);
  app.appendChild(container);

  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:49146/api/punti?id=' + ID, true);
  request.onload = function () {


    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {

      const map = createMap(data[0].CoordinateParco.Long, data[0].CoordinateParco.Lat);
      //aggiungo nome del parco
      let nomeParco = data[0].Nome;
      addTitle(nomeParco);

      data[0].Punti.forEach(punto => {

        if (punto.Interesse == filtro) {

          let affluenza = changeAffluenza();

          if (punto.Interesse) createMarker(punto.Coordinate.Long, punto.Coordinate.Lat, map, punto.Immagine, punto.NomePunto, affluenza, punto.Interesse);
          else createMarker(punto.Coordinate.Long, punto.Coordinate.Lat, map, punto.Immagine, punto.NomePunto, affluenza, punto.Interesse);

          //card principale
          const card = document.createElement('div');
          card.setAttribute('class', 'card');
          card.setAttribute('style', 'width: 15rem;');
          //immagine
          const image = document.createElement('img');
          image.setAttribute('src', punto.Immagine);
          image.setAttribute('class', "card-img-top");
          card.appendChild(image);

          //titolo e info parco
          const cardBody = document.createElement('div');
          cardBody.setAttribute('class', 'card-body');

          //nome parco
          let title = document.createElement('h5');
          title.setAttribute('class', 'card-title')
          title.textContent = (punto.NomePunto);
          cardBody.appendChild(title);

          //tipo di punto d'interesse
          title = document.createElement('h6');
          title.setAttribute('class', 'card-title');
          title.textContent = ('Ristoro');

          //affluenza

          let p = document.createElement('p');
          p.textContent = ("Affluenza corrente ");
          let font = document.createElement('font');
          if (affluenza < 30) font.setAttribute('color', 'green');
          else if (affluenza >= 30 && affluenza < 60) font.setAttribute('color', '#d9cf0d');
          else font.setAttribute('color', 'red');
          font.textContent = (affluenza + '%');
          p.appendChild(font);


          cardBody.appendChild(title);
          cardBody.appendChild(p);
          card.appendChild(cardBody);

          container.appendChild(card);
        }
      });
    }
  }
  request.send();
}

//AL CLICK DELLA STELLA SI ESEGUE L'UPDATE DEI PREFERITI SUL DB
function changeStar(star, id) {

  if (star == '☆') {
    updateFavourites(id, true);
    initialize();
    initialize();
  } else if (star == '★') {
    updateFavourites(id, false);
    initialize();
    initialize();
  }
}

//FUNZIONE PER L'UPDATE DEL CAMPO PREFERITI DEL PARCO
function updateFavourites(id, value) {

  let idInt = parseInt(id);

  const data = {
    "ID": idInt,
    "preferito": value
  };

  //CHIAMO API PUT PER AGGIORNAMENTO
  fetch('http://localhost:49146/api/parco/preferiti', {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network says error');
      }
    }).catch((error) => {
      console.error("Error: ", error);
    });

}

//CREA FILTRO E TASTO HOMEPAGE PER LA SECONDA PAGINA
function generateDropDown(ID) {

  //crea div principale
  const div = document.createElement('div');
  div.setAttribute('class', 'navbar');
  div.setAttribute('id', 'navbar');

  //crea tasto indietro
  var homepage = document.createElement('div');
  homepage.setAttribute('id', 'homepage');
  homepage.setAttribute('class', 'btn-group');
  homepage.setAttribute('role', 'group');
  homepage.setAttribute('aria-labelled', 'Basic checkbox toggle button group');
  homepage.onclick = () => {
    initialize();
  }

  let input = document.createElement('input');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('class', 'btn-check');
  input.setAttribute('id', 'btncheck1');
  input.setAttribute('autocomplete', 'off');

  let label = document.createElement('label');
  label.setAttribute('class', 'btn btn-outline-primary');
  label.setAttribute('for', 'btncheck1');
  let strong = document.createElement('strong');
  label.textContent = ('< Homepage');
  label.appendChild(strong);

  homepage.appendChild(input);
  homepage.appendChild(label);

  div.appendChild(homepage);

  //crea filtro
  var dropdown = document.createElement('div');
  dropdown.setAttribute('class', "dropdown");
  dropdown.id = ('dropdown');

  let button = document.createElement('button');
  button.setAttribute('class', 'btn btn-secondary dropdown-toggle');
  button.setAttribute('type', 'button');
  button.setAttribute('id', 'dropdownMenuButton2');
  button.setAttribute('data-bs-toggle', 'dropdown');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = ('Filtro');
  dropdown.appendChild(button);

  let list = document.createElement('ul');
  list.setAttribute('class', 'dropdown-menu dropdown-menu-end');
  list.setAttribute('aria-labelledby', "dropdownMenuButton2");

  let item = document.createElement('li');
  ancora = document.createElement('a');
  ancora.setAttribute('class', "dropdown-item");
  ancora.textContent = ("Attrazioni");
  item.appendChild(ancora);
  item.onclick = () => {
    AttractionFilter(true, ID);
  }
  list.appendChild(item);



  item = document.createElement('li');
  ancora = document.createElement('a');
  ancora.setAttribute('class', "dropdown-item");
  ancora.textContent = ("Punti ristoro");
  item.appendChild(ancora);
  item.onclick = () => {
    AttractionFilter(false, ID);
  }
  list.appendChild(item);

  item = document.createElement('li');
  let hr = document.createElement('hr');
  hr.setAttribute('class', 'dropdown-divider');
  item.appendChild(hr);
  list.appendChild(item);


  item = document.createElement('li');
  ancora = document.createElement('a');
  ancora.setAttribute('class', "dropdown-item");
  ancora.textContent = ("Tutti");
  item.appendChild(ancora);
  item.onclick = () => {
    changeContainerPointsPage2(ID);
  }
  list.appendChild(item);

  dropdown.appendChild(list);
  div.appendChild(dropdown);

  return (div);

}

//AGGIUNGE NOME PARCO NELLA SECONDA PAGINA
function addTitle(nomeParco) {
  const navbar = document.getElementById('navbar');

  const div = document.createElement('div');
  div.id = ('header');
  const header = document.createElement('strong');
  header.className = ('titolo');
  header.textContent = (nomeParco);
  div.appendChild(header);

  navbar.appendChild(div);

}

//CREA MAPPA E LA CENTRA NEL PARCO

function createMap(long, lat) {
  mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGVvbWFza2UiLCJhIjoiY2t4NmxvYnZpMWZ1aTJ1cWsyNGM3NmJsZCJ9.VBSdjKXJpcyUVZgaFatxfw';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [long, lat], // starting position [lng, lat]
    zoom: 15 // starting zoom
  });
  return map;
}

//AGGIUNGE MARKER SULLA MAPPA CON IL POPUP ASSOCIATO
function createMarker(lng, lat, map, immagine, testo, affluenza) {

  // let div = document.createElement('div');
  // div.className = 'marker';
  // div.style.backgroundImage = 'url('+immagine+')';
  // div.style.backgroundSize = '100%';
  let color;

  if (affluenza < 30) color = "green";
  else if (affluenza >= 30 && affluenza < 70) color = "yellow";
  else color = "red";

  const popup = new mapboxgl.Popup({ offset: 30 }).setHTML(
    '<h6>' + testo + '</h6><img class="popup" src="' + immagine + '">');

  const marker1 = new mapboxgl.Marker({ color: color })
    .setLngLat([lng, lat])
    .setPopup(popup)
    .addTo(map);

}

//GENERA UNA PERCENTUALE DI AFFLUENZA CASUALE
function changeAffluenza() {
  return Math.floor(Math.random() * 100);
}

//FERMA PROPAGAZIONE EVENTO DI CLICK PER SPAN IN LI NELLA LISTA DEI PARCHI DELLA PAGINA PRINCIPALE
function disabledEventPropagation(event) {
  if (event.stopPropagation) {
    event.stopPropagation();
  }
  else if (window.event) {
    window.event.cancelBubble = true;
  }
}
