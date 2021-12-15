//import Axios from "axios";

//INIZIALIZZO PAGINA CON LOGO E DIV PRINCIPALE
const app = document.getElementById('root');

const logo = document.createElement('img');
logo.setAttribute('class','foto');
logo.setAttribute('align','center');
logo.src = '../Image/logo.png';
logo.onclick=()=>{
    initialize();
};

const container = document.createElement('div');
container.setAttribute('class', 'container');

app.appendChild(logo);

app.appendChild(container);

//INIZIALIZZO LA PAGINA
initialize();

function initialize(){

    while(container.firstChild)container.removeChild(container.firstChild);
    while(app.firstChild)app.removeChild(app.firstChild);

    app.appendChild(logo);
    app.appendChild(container);

    const list = document.createElement('ul');
    list.setAttribute('class', 'list-group');
    //container.removeChild(list);

    container.appendChild(list);

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:49146/api/parchi', true);
    request.onload = function () {


        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(parco => {

              console.log(parco);

              if(parco.Preferiti){

            let item=document.createElement('li');
            item.setAttribute('class','list-group-item d-flex justify-content-between align-items-center');
            item.textContent=(parco.Nome);
            item.onclick=()=>{
                changeContainerPointsPage2(parco.Id);
                disabledEventPropagation(this);
            }

            let span=document.createElement('span');
            span.setAttribute('class','badge bg-primary rounded-pill');
            span.textContent=('☆');
            span.onclick=()=>{
                let star = span.textContent;
                changeStar(star,span,parco.Id);
                disabledEventPropagation(this);

            }
            
            item.appendChild(span);
            list.appendChild(item);
          }
            });
          
            data.forEach(parco => {

              if(!(parco.Preferiti)){

            let item=document.createElement('li');
            item.setAttribute('class','list-group-item d-flex justify-content-between align-items-center');
            item.textContent=(parco.Nome);
            item.onclick=()=>{
                changeContainerPointsPage2(parco.Id);
                disabledEventPropagation(this);
            }

            let span=document.createElement('span');
            span.setAttribute('class','badge bg-primary rounded-pill');
            span.textContent=('☆');
            span.onclick=()=>{
                let star = span.textContent;
                changeStar(star,span,parco.Id);
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

function changeContainerPointsPage2(ID){
    while(container.firstChild)container.removeChild(container.firstChild);
    while(app.firstChild)app.removeChild(app.firstChild);

    app.appendChild(logo);
    app.appendChild(generateDropDown(ID));

    //creo div per mappa
    const mapDiv=document.createElement('div');
    mapDiv.setAttribute('id','map');
    app.appendChild(mapDiv);
    app.appendChild(container);

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:49146/api/punti?id='+ID, true);
    request.onload = function () {


        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        
        if (request.status >= 200 && request.status < 400) {

          //centro mappa nel parco
            console.log(data[0].CoordinateParco);
            let long = data[0].CoordinateParco.Long;
            let lat = data[0].CoordinateParco.Lat;
            createMap(long,lat);

          // stampo card punti interesse
            data[0].Punti.forEach(punto => {
            
            //card principale
            const card=document.createElement('div');
            card.setAttribute('class','card');
            card.setAttribute('style','width: 15rem;');
            //immagine
            const image=document.createElement('img');
            image.setAttribute('src',punto.Immagine);
            image.setAttribute('class',"card-img-top");
            card.appendChild(image);

            //titolo e info parco
            const cardBody=document.createElement('div');
            cardBody.setAttribute('class','card-body');
                        
            //nome parco
            let title=document.createElement('h5');
            title.setAttribute('class','card-title')
            title.textContent=(punto.NomePunto);
            cardBody.appendChild(title);
            
            //sottotolo coordinate
            title=document.createElement('h6');
            title.setAttribute('class','card-title')
            title.textContent=('Coordinate punto:');
            cardBody.appendChild(title);

           //latitudine
            let item=document.createElement('p');
            item.textContent=('Lat: '+punto.Coordinate.Lat);
            cardBody.appendChild(item);            
        
          //longitudine
            item=document.createElement('p');
            item.textContent=('Long: '+punto.Coordinate.Long);
            cardBody.appendChild(item);

            card.appendChild(cardBody);
            container.appendChild(card);
            });
        }
    }

    request.send();
}

function changeStar(star,span,id){
    
    var preferito;
    if(star=='☆'){
      span.textContent=('★');
      updateFavourites(id,"true");
    }else{
      span.textContent=('☆');
      updateFavourites(id,"false");
    }
}

function updateFavourites(id,value){

    console.log("trying to update park " + id + " with " + value);

    let idInt = parseInt(id);

    let requestOptions={
      method:'PUT',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: {
        "ID":idInt,
        "preferito": value
      }
    };

    fetch('http://localhost:49146/api/parco/preferiti',requestOptions)
    .then((response)=>{
      if(!response.ok){
        throw new Error('Network says dc');
      }
    }).catch((error)=>{
      console.error("Error: ", error);
    });

}

function generateDropDown(ID){
    var dropdown=document.createElement('div');
    dropdown.setAttribute('class',"dropdown")
  
    let button = document.createElement('button');
    button.setAttribute('class','btn btn-secondary dropdown-toggle');
    button.setAttribute('type','button');
    button.setAttribute('id','dropdownMenuButton2');
    button.setAttribute('data-bs-toggle','dropdown');
    button.setAttribute('aria-expanded','false');
    button.textContent=('Filtro');
    dropdown.appendChild(button);

    let list = document.createElement('ul');
    list.setAttribute('class','dropdown-menu');
    list.setAttribute('aria-labelledby',"dropdownMenuButton2");

      let item = document.createElement('li');
        ancora = document.createElement('a');
        ancora.setAttribute('class',"dropdown-item" );
        ancora.textContent=("Punti d'interesse");
        item.appendChild(ancora);
        item.onclick=()=>{
          console.log("filtro per interesse");
          AttractionFilter(true,ID);
        }
      list.appendChild(item);
        
        

      item = document.createElement('li');
        ancora = document.createElement('a');
        ancora.setAttribute('class',"dropdown-item" );
        ancora.textContent=("Punti ristoro");
      item.appendChild(ancora);
      item.onclick=()=>{
        console.log("filtro per ristori");
        AttractionFilter(false,ID);
      }
      list.appendChild(item);

      item = document.createElement('li');
        let hr = document.createElement('hr');
        hr.setAttribute('class','dropdown-divider');
        item.appendChild(hr);
      list.appendChild(item);
      

      item = document.createElement('li');
        ancora = document.createElement('a');
        ancora.setAttribute('class',"dropdown-item" );
        ancora.textContent=("Tutti");
        item.appendChild(ancora);
        item.onclick=()=>{
          console.log("filtro per ristori");
          changeContainerPointsPage2(ID);
        }
      list.appendChild(item);

    dropdown.appendChild(list);

  return(dropdown);

}

function AttractionFilter(filtro,ID){

    // svuoto container
    while(container.firstChild)container.removeChild(container.firstChild);

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:49146/api/punti?id='+ID, true);
    request.onload = function () {


        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            data[0].Punti.forEach(punto => {
            if(punto.Interesse==filtro){
            //card principale
            const card=document.createElement('div');
            card.setAttribute('class','card');
            card.setAttribute('style','width: 15rem;');
            //immagine
            const image=document.createElement('img');
            image.setAttribute('src',punto.Immagine);
            image.setAttribute('class',"card-img-top");
            card.appendChild(image);

            //titolo e info parco
            const cardBody=document.createElement('div');
            cardBody.setAttribute('class','card-body');
                        
            //nome parco
            let title=document.createElement('h5');
            title.setAttribute('class','card-title')
            title.textContent=(punto.NomePunto);
            cardBody.appendChild(title);
            
            //sottotolo coordinate
            title=document.createElement('h6');
            title.setAttribute('class','card-title')
            title.textContent=('Coordinate punto:');
            cardBody.appendChild(title);

           //latitudine
            let item=document.createElement('p');
            item.textContent=('Lat: '+punto.Coordinate.Lat);
            cardBody.appendChild(item);            
        
          //longitudine
            item=document.createElement('p');
            item.textContent=('Long: '+punto.Coordinate.Long);
            cardBody.appendChild(item);

            card.appendChild(cardBody);
            container.appendChild(card);
            }
            });
        }
    }
    request.send();
}

function createMap(long,lat){
      mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dGVvbWFza2UiLCJhIjoiY2t4NmxvYnZpMWZ1aTJ1cWsyNGM3NmJsZCJ9.VBSdjKXJpcyUVZgaFatxfw';
      const map = new mapboxgl.Map({
          container: 'map', // container ID
          style: 'mapbox://styles/mapbox/streets-v11', // style URL
          center: [long, lat], // starting position [lng, lat]
          zoom: 15 // starting zoom
      }); 
}

function disabledEventPropagation(event)
{
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
}
