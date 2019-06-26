var express = require('express');
var app = express();
var router = express.Router();

const axios = require('axios');
var parseString = require('xml2js').parseString;

const bggApiBaseUrl = "https://www.boardgamegeek.com/xmlapi2";

router.use(function(req, res, next) {
    console.log('Request made');
    next(); 
});

router.get('/collection/:username', (req, res) => {
    axios.get(`${bggApiBaseUrl}/collection?username=${req.params.username}`)
        .then(result => {
            var xml = result.data;
            parseString(xml, (err, result) => {
                if (!result.items) {
                    res.json({message: "bgg user not found"});
                }
                
                var object = result.items.item.map(game => {
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
                });          
                res.json(object);
            });
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/api', router);

app.listen(3000);