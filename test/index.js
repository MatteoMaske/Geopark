'use strict';

var test = require('tape');
var request = require('supertest');
var app = require('../api/index');

test('TEST1: GET dei parchi', function (assert) {
    request(app)
        .get('/api/parchi')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            var num_parchi = res.body.length;
            console.log(res.body.length);
            var result = false;

            if(num_parchi == 0) {
                result = true;
            }
            assert.error(err, 'No error');
            assert.notEqual(true, result, 'Parchi presi correttamente');
            assert.end();
        });
});

test('TEST2: Post per inserimento', function (assert) {
    request(app)
        .post('/api/parco')
        .send({
            "Nome": "Povoland"
        })
        .end((err, res) => {

            if (err) {
                reject(new Error('An error occured with the employee Adding API, err: ' + err))
            }

            assert.error(err, 'No error');
            assert.isEqual("Parco aggiunto correttamente", res.body, "Parco inserito correttamente")
            assert.end();
        });
});

test('TEST3: Put aggiornamento', function (assert) {
    request(app)
        .put('/api/parco/preferiti')
        .send({
            "ID": 7,
            "preferito": true
        })
        .end((err, res) => {

            if (err) {
                reject(new Error('An error occured with the employee Adding API, err: ' + err))
            }
            console.log(res.body);

            assert.error(err, 'No error');
            assert.isEqual("Update succesfully", res.body, "Aggiornamento effettutato correttamente")
            assert.end();
        });
});

test('TEST4: Elimina parco ', function (assert) {
    request(app)
        .del('/api/parco/7')
        .end((err, res) => {

            if (err) {
                reject(new Error('An error occured with the employee Adding API, err: ' + err))
            }
            assert.error(err, 'No error');
            assert.isEqual("Deleted successfully park", res.body, "Parco eliminato con successo");
            assert.end();
        });
});