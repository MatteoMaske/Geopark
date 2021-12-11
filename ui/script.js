//INIZIALIZZO PAGINA CON LOGO E DIV PRINCIPALE
const app = document.getElementById('root');

const logo = document.createElement('img');
logo.setAttribute('class','foto');
logo.setAttribute('align','center');
logo.src = '../logo.png';
/*logo.onclick=()=>{
    initialize();
};*/

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
    //  console.log(data);
        if (request.status >= 200 && request.status < 400) {
            data[0].Punti.forEach(punto => {
            console.log(punto);
            let item=document.createElement('li');
            item.textContent=(punto.NomePunto);

            prova2.appendChild(item);
            item=document.createElement('li');
            item.textContent=(punto.Coordinate.Lat);
            
            prova2.appendChild(item);
            item=document.createElement('li');
            item.textContent=(punto.Coordinate.Long);

            prova2.appendChild(item);
            });
        }
    }

    request.send();
    container.appendChild(prova2);
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


function disabledEventPropagation(event)
{
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
}
