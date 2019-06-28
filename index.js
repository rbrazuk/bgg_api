var express = require('express');
var app = express();
var router = express.Router();

const axios = require('axios');
var parseString = require('xml2js').parseString;

const bggApiBaseUrl = "https://www.boardgamegeek.com/xmlapi2";

var Game = require('./models/game');

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
                const rawGame = result.items.item[0];
                
                var gameName = "";

                for (var i = 0; i < rawGame.name.length; i++) {
                    if (rawGame.name[i].$.type == "primary") {
                        gameName = rawGame.name[i].$.value;
                        break;
                    }
                }
                
                var game = new Game(
                    rawGame.$.id, 
                    gameName, 
                    rawGame.yearpublished[0].$.value,
                    rawGame.description[0]
                );

                game.playerCount.min = rawGame.minplayers[0].$.value;
                game.playerCount.max = rawGame.maxplayers[0].$.value;
                game.playtime.min = rawGame.minplaytime[0].$.value;
                game.playtime.max = rawGame.maxplaytime[0].$.value;

                for (let item of rawGame.link) {
                    switch (item.$.type) {
                        case "boardgamecategory":
                            populateLink(item.$, game.links.categories);
                            break;
                        case "boardgamemechanic":
                            populateLink(item.$, game.links.mechanics);
                            break;
                        case "boardgamefamily":
                            populateLink(item.$, game.links.families);
                            break;
                        case "boardgameexpansion":
                            populateLink(item.$, game.links.expansions);
                            break;
                        case "boardgamedesigner":
                            populateLink(item.$, game.links.designers);
                            break;
                        case "boardgameartist":
                            populateLink(item.$, game.links.artists);
                            break;
                        case "boardgamepublisher":
                            populateLink(item.$, game.links.publishers);
                            break;
                    }
                }
                res.json(game);
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