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

const list = document.createElement('ul');
list.setAttribute('class', 'list-group');

container.appendChild(list);
const prova=document.createElement("ul");

//initialize();

function changeContainer(ID){
    container.removeChild(list);

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

            item.onclick=()=>{
                changeContainer2(ID, punto.NomePunto);         
            }

            prova.appendChild(item);
            });
        }
    }

    request.send();
    container.appendChild(prova);
}

function changeContainer2(ID, NOMEP){
    container.removeChild(prova);
    const prova2=document.createElement("ul");

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

/*function initialize(){

    const list = document.createElement('ul');
    list.setAttribute('class', 'list-group');
    //container.removeChild(list);

    container.appendChild(list);*/

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:49146/api/parchi', true);
    request.onload = function () {


        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
    //  console.log(data);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(parco => {
            // console.log(parco.Nome);
            
                
                const item = document.createElement('li');
                item.textContent = parco.Nome;
                item.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');

                const span=document.createElement('span');
                span.setAttribute('class','badge bg-primary rounded-pill');
                span.textContent='☆';
                

                item.onclick=()=>{
                    changeContainer(parco.Id);         
                }

                span.onclick=()=>{
                    if(span.textContent == '☆') {
                        span.textContent='★';
                    }
                    else {
                        span.textContent='☆';
                    }
                    disabledEventPropagation(this);
                }

                
                
                list.appendChild(item);
                item.appendChild(span);

            });
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = `THE API IS NOT WORKING!`;
            app.appendChild(errorMessage);
        }
    }
    function disabledEventPropagation(event){
        if (event.stopPropagation){
            event.stopPropagation();
        }
        else if(window.event){
            window.event.cancelBubble=true;
        }
    }
    request.send();
//}