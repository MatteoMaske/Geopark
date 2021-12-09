const Express = require("express");
const app = Express();


var fs = require('fs');

var cors = require('cors')
app.use(cors())

// module to parse the API body request
var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var MongoClient=require("mongodb").MongoClient;
const { response } = require("express");

var CONNECTION_STRING="mongodb+srv://marina:marina@cluster0.xlbi6.mongodb.net/test";

var DATABASE="testDB";
var database;


app.listen(49146, () => {
    console.log("APIs Running");

      //Mongo DB Connection
  MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true, 
    useUnifiedTopology: true}, (error, client) =>{
      if(error){
        console.log("Error connecting at the MongoDB: "+error);
      }
      else{
        database=client.db(DATABASE);
        console.log("Mongo DB Connection Successfull");
      }
    })

});


/**
 * @swagger
 * /api/prodotti:
 *   get:
 *     summary: Retrieve a list of products.
 *     description: Retrieve a list of produdct from the Server.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Name:
 *                         type: integer
 *                         description: The product Name.
 *                         example: Antonio
 *                       Price:
 *                         type: string
 *                         description: The product's price.
 *                         example: 20.0
 *                       Location:
 *                          type: string
 *                          description: The product's location
 *                          example: Refrigerated foods
 */
app.get('/api/prodotti', (request, response) => {
    var data = fs.readFileSync('prodotti.json');
    var myObject = JSON.parse(data);

    response.send(myObject);

})

/**
 * @swagger
 * /api/prodotti:
 *   post:
 *     summary: Create a product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                  type: integer
 *                  description: The product Name.
 *                  example: Antonio
 *               Price:
 *                  type: string
 *                  description: The product's price.
 *                  example: 20.0
 *               Location:
 *                  type: string
 *                  description: The product's location
 *                  example: Refrigerated foods
 *     responses:
 *       201:
 *         description: successful executed
*/
app.post('/api/prodotti', (request, response) => {

    // lettura file json e estrazione dati
    var data = fs.readFileSync('prodotti.json');
    var myObject = JSON.parse(data);


    // creazione nuovo elemento da inserire da Request Parameter
    let newProduct = {
        "Name": request.body['Name'],
        "Price": request.body['Price'],
        "Location": request.body['Location']
    };

    //aggiunta nuovo elemento
    myObject.products.push(newProduct);

    //aggiornamento file json con il nuovo elemento
    var newData = JSON.stringify(myObject);
    fs.writeFile('prodotti.json', newData, err => {
        // error checking
        if (err) throw err;

    });

    response.json("Prodotto Aggiunto Correttamente: (" + myObject.products.length + ")");
})



/**
 * @swagger
 * /api/prodotti/{name}:
 *   delete:
 *     summary: Delete a product.
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: the product name
 *     responses:
 *       200:
 *         description: the product was deleted
 *       404:
 *         description: the product was not found
*/
app.delete('/api/prodotti/:name', (request, response) => {
    var data = fs.readFileSync('prodotti.json');
    var myObject = JSON.parse(data);
    for (let [i, product] of myObject.products.entries()) {

        if (product.Name == request.params.name) {
            myObject.products.splice(i, 1);
        }
    }
    //memorizzo il nuovo JSON dopo la cancellazione
    var newData = JSON.stringify(myObject);
    fs.writeFile('prodotti.json', newData, err => {
        // error checking
        if (err) throw err;
    });
    response.json("Deleted Successfully: " + myObject.products.length);
})


//ricerca info di un parco dopo click su di esso
app.get('/api/parco',(request,response)=>{
    const id = request.query.id;

    database.collection("Parchi").find({Id:parseInt(id)}).toArray((error, result) =>{
        console.log("Cerco info su parco " + id);
        //mostriamo punti di quel parco
        response.send(result);
    })
})

//richesta dei parchi nel database per pagina principale
app.get('/api/parchi', (request, response) => {
   database.collection("Parchi").find({}).toArray((error, result) =>{
    //console.log(result);
    response.send(result);
    })
  })

  app.get('/api/parchi/pref', (request, response) => {
    database.collection("Parchi preferiti").find({}).toArray((error, result) =>{
     console.log(result);
     response.send(result);
     })
   })

//aggiunta di un parco
app.post('/api/parco', (request,response) =>{
    database.collection("Parchi").count({},function(error,newId){
        if(error){
            console.log(error);
        }

    database.collection("Parchi").insertOne({
        Id: newId+1,
        Nome: request.body['Nome parco']
    });

    response.json("Parco aggiunto " + (newId+1));
    })
})

//eliminazione parco da id
app.delete('/api/parco/:id',(request,response)=>{
    database.collection("Parchi").deleteOne({
        Id: parseInt(request.params.id)
    });

    response.json("Deleted successfully park " + request.params.id);
    
})

