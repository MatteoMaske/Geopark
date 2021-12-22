const Express = require("express");
const app = Express();

// modules to generate APIs documentation
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API for My Project',
            version: '1.0.0',
            description:
                'This is a REST API application made with Express.',
            license: {
                name: 'Licensed Under MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'G26',
                url: 'http://localhost:49146/',
            },
        },
        servers: [
            {
                url: 'http://localhost:49146/',
                description: 'Development server',
            },
        ],
    },
    apis: ["./api/index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
 * /api/parchi:
 *   get:
 *     summary: Elenco dei parchi.
 *     description: Ritorna un elenco dei parco presenti nel sistema.
 *     responses:
 *       200:
 *         description: Elenco dei parco.
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
 *                       Nome:
 *                         type: string
 *                         description: il nome del parco.
 *                         example: Gardaland                   
 */

//richesta dei parchi nel database per pagina principale
app.get('/api/parchi', (request, response) => {
    //Avvio qui connessione con il db per consentire testing corretto
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true ,useUnifiedTopology: true}, (error, client) => {
        database = client.db(DATABASE);
        console.log("Mongo DB Connection Successfull");
        if(error)console.error(error);
        database.collection("Parchi").find({}).toArray((err, result) =>{  
            if (err) {
                console.log(error);
            }
            response.send(result);
            })
    });

})

/**
 * @swagger
 * /api/punti:
 *   get:
 *     summary: Punti di interesse e ristoro di un parco.
 *     description: Ritorna le informazioni relative ai punti di interesse e ristoro di un parco presenti nel sistema.
 *     responses:
 *       200:
 *         description: Informazioni relative ai punti di interesse e ristoro.
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
 *                       NomePunto:
 *                         type: string
 *                         description: il nome del punto di interesse/ristoro presente nel parco.
 *                         example: Oblivion
 *                       Coordinate:
 *                         type: string
 *                         description: coordinate del punto.
 *                         example: Lat 45.45823, Long 10.71112
 *                       Immagine:
 *                         type: string
 *                         description: percorso dell'immagine relativa al punto interesse/ristoro.
 *                         example: ../Image/oblivion.jpg      
 *                       Interesse:
 *                         type: boolean
 *                         description: se uguale a true allora il punto è di interesse, se settato a false è un punto ristoro.
 *                         example: true               
 */

//recerca di punti interesse di un parco
app.get('/api/punti',(req,res)=>{
    
    const id=req.query.id;
    database.collection("Parchi").find({Id:parseInt(id)}).toArray((err, result) =>{
        
        if (err) console.log("ERRORE: " + error);

        res.send(result);
        });
})

/**
 * @swagger
 * /api/parco:
 *   post:
 *     summary: Aggiunta di un parco.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nome:
 *                  type: string
 *                  description: il nome di un parco.
 *                  example: Caneva
 *               Id:
 *                  type: integer
 *                  description: id del parco.
 *                  example: 8
 *     responses:
 *       201:
 *         description: Parco aggiunto + Id
*/

//aggiunta di un parco
app.post('/api/parco', (request,response) =>{
    database.collection("Parchi").count({},function(error,newId){
        if(error){
            console.log(error);
        }

    database.collection("Parchi").insertOne({
        "Id": newId+1,
        "Nome": request.body['Nome'],
        "Preferiti": false
    });

    response.json("Parco aggiunto correttamente");
    })
})

/**
 * @swagger
 * /api/parco/preferiti:
 *   put:
 *     summary: Aggiornamento dell'elenco dei parchi.
 *     description: Ritorna l'aggiornamento dell'elenco dei parchi.
 *     responses:
 *       200:
 *         description: Elendo dei parchi aggiornato.
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
 *                       Nome:
 *                         type: string
 *                         description: il nome del parco.
 *                         example: Gardaland
 *                       Preferiti:  
 *                         type: boolean
 *                         description: il parco è stato inserito tra i preferiti dall'utente.
 *                         example: true                  
 */

//aggiornamento preferiti
app.put('/api/parco/preferiti', (request,response) =>{
    database.collection("Parchi").updateOne(
    //filter
        {"Id":request.body['ID']},
    //update
        {
            $set:{
                "Preferiti": request.body['preferito']
            }
        }        
    );
    response.json("Update succesfully");
    
});

/**
 * @swagger
 * /api/parco/{id}:
 *   delete:
 *     summary: Eliminazione di un parco.
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *             type: string
 *         required: true
 *         description: nome del parco
 *     responses:
 *       200:
 *         description: il parco è stato eliminato
 *       404:
 *         description: il parco non è stato trovato
*/

//eliminazione parco da id
app.delete('/api/parco/:id',(request,response)=>{

    database.collection("Parchi").deleteOne({
        Id: parseInt(request.params.id)
    });

    response.json("Deleted successfully park");
    
})

module.exports=app;