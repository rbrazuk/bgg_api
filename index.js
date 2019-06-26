var express = require('express');
var app = express();
var router = express.Router();

const axios = require('axios');
var parseString = require('xml2js').parseString;

router.use(function(req, res, next) {
    console.log('Request made');
    next(); 
});

app.get('/', function(req, res) {
    
    axios.get("https://www.boardgamegeek.com/xmlapi2/collection?username=indoorsy")
        .then(result => {
            var xml = result.data;
            parseString(xml, (err, result) => {
                //console.log(JSON.stringify(result));

                var object = result.items.item.map(game => {
                    //objects.push(game.name._);
                    //console.log(game.name._);
                    return {
                        bggId: game.$.objectid,
                        objectType: game.$.objecttype,
                        subtype: game.$.subtype,
                        name: game.name[0]._,
                        yearPublished: game.yearpublished[0],
                        image: game.image[0],
                        thumbnail: game.thumbnail[0],
                        status: game.status.$,
                    };
                })
                
                res.send(object);
                //res.send(result.items.item);
            })
        })
        .catch(err => {
            console.log(err);
        })
});

router.get('/collection/:username', (req, res) => {
    console.log(req.params);
    res.send(req.params.username);
});

app.use('/api', router);

app.listen(3000);