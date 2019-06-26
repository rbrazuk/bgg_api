var express = require('express');
var app = express();
var router = express.Router();

const axios = require('axios');
var parseString = require('xml2js').parseString;

router.get('/collection/:username', (req, res) => {
    res.send(username);
});

app.use('/api', router);

app.listen(3000);