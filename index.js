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

router.get('/game/:id', (req, res) => {
    axios.get(`${bggApiBaseUrl}/thing?id=${req.params.id}`)
        .then(result => {
            var xml = result.data;

            parseString(xml, (err, result) => {
                if (err) {
                    res.send(error);
                }
                var rawGame = result.items.item[0];
                //res.json(rawGame);
                var object = {
                    categories: [],
                    mechanics: [],
                    families: [], 
                    expansions: [],
                    designers: [],
                    artists: [],
                    publishers: []
                };
                object.id = rawGame.$.id;

                for (var i = 0; i < rawGame.name.length; i++) {
                    if (rawGame.name[i].$.type == "primary") {
                        object.name = rawGame.name[i].$.value;
                        break;
                    }
                }
                object.yearPublished = rawGame.yearpublished[0].$.value;
                object.description = result.items.item[0].description[0];

                
                for (let item of rawGame.link) {
                    switch (item.$.type) {
                        case "boardgamecategory":
                            populateLink(item.$, object.categories);
                            break;
                        case "boardgamemechanic":
                            populateLink(item.$, object.mechanics);
                            break;
                        case "boardgamefamily":
                            populateLink(item.$, object.families);
                            break;
                        case "boardgameexpansion":
                            populateLink(item.$, object.expansions);
                            break;
                        case "boardgamedesigner":
                            populateLink(item.$, object.designers);
                            break;
                        case "boardgameartist":
                            populateLink(item.$, object.artists);
                            break;
                        case "boardgamepublisher":
                            populateLink(item.$, object.publishers);
                            break;
                    }
                }

                
                console.log(object);
                res.json(object);
            });
            
        })
        .catch(err => {
            console.log(err);
        });
});

var populateLink = (link, linksArray) => {
    linksArray.push({
        id: link.id,
        value: link.value
    });
}

app.use('/api', router);

app.listen(3000);