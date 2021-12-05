const app = document.getElementById('root');

const logo = document.createElement('img');
logo.setAttribute=('class','foto');
logo.src = 'logo.png';


const container = document.createElement('div');
container.setAttribute('class', 'container');

/*const ancora = document.createElement('a');
            ancora.setAttribute('href','sto.com');
            ancora.textContent = 'sto cazzo';
            app.appendChild(ancora);*/-

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
  //  console.log(data);
    if (request.status >= 200 && request.status < 400) {
        data.forEach(parco => {
           // console.log(parco.Nome);
        
            
            const item = document.createElement('li');
            item.textContent = parco.Nome;
            item.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
            item.setAttribute('onclick', 'http://localhost:49146/api/prodotto?id=');

            const span=document.createElement('span');
            span.setAttribute('class','badge bg-primary rounded-pill');
            var star='\#9734'
            span.textContent='☆';
            

            item.onclick=()=>{
                console.log("dc");
                window.location='http://localhost:49146/api/parco?id=' + parco.Id;
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

request.send();