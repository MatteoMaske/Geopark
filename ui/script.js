//INIZIALIZZO PAGINA CON LOGO E DIV PRINCIPALE
const app = document.getElementById('root');

const logo = document.createElement('img');
logo.setAttribute('class','foto');
logo.setAttribute('align','center');
logo.src = '../logo.png';
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

    const list = document.createElement('ul');
    list.setAttribute('class', 'list-group');
    //container.removeChild(list);

    container.appendChild(list);

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:49146/api/parchi', true);
    request.onload = function () {


        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        console.log(data);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(parco => {
            console.log(parco);

            let item=document.createElement('li');
            item.setAttribute('class','list-group-item d-flex justify-content-between align-items-center');
            item.textContent=(parco.Nome);
            item.onclick=()=>{
               // e.stopPropagation;
                changeContainer2(parco.Id);
            }

            let span=document.createElement('span');
            span.setAttribute('class','badge bg-primary rounded-pill');
            span.textContent=('☆');
            span.onclick=()=>{
               // e.stopPropagation;
                console.log(e.target);
                let star = span.textContent;
                console.log(star);
                changeStar(star,this);
            }
            
            item.appendChild(span);
            list.appendChild(item);

            });
        }
    }

    request.send();
}

//FUNZIONE CEH AL CLICK SUL PARCO VISUALIZZA PUNTI D'INTERESSE
function changeContainer(ID){
    while(container.firstChild)container.removeChild(container.firstChild);
    const prova=document.createElement("ul");

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:49146/api/punti?id='+ID, true);
    request.onload = function () {


        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
    //  console.log(data);
        if (request.status >= 200 && request.status < 400) {
            data[0].Punti.forEach(punto => {
            console.log(punto);
            let item=document.createElement('li');
            item.textContent=(punto.NomePunto);

            prova.appendChild(item);
            });
        }
    }

    request.send();
    container.appendChild(prova);
}

function changeContainer2(ID, NOMEP){
    while(container.firstChild)container.removeChild(container.firstChild);

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:49146/api/punti?id='+ID, true);
    request.onload = function () {


        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
    //  console.log(data);
        if (request.status >= 200 && request.status < 400) {
            data[0].Punti.forEach(punto => {
            console.log(punto);
            
            //card principale
            const card=document.createElement('div');
            card.setAttribute('class','card');
            card.setAttribute('style','width: 18rem;');
            //immagine
            const image=document.createElement('img');
            image.setAttribute('src','../logo.png');
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
            item.textContent=('Lat: '+punto.Coordinate.Lat + "\n"+punto.Coordinate.Long);
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

function changeStar(star,span){
    if(star=='☆')span.textContent=('★');
    else span.textContent=('☆');

    disabledEventPropagation(span);
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
