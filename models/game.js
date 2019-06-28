class Game {
    constructor(id, name, yearPublished, description) {
        this.id = id;
        this.name = name;
        this.yearPublished = yearPublished;
        this.description = description;
        this.playerCount = {
            min: null,
            max: null
        };
        this.playtime = {
            min: null,
            max: null
        };
        this.links = {
            categories: [],
            mechanics: [],
            families: [],
            expansions: [],
            designers: [],
            artists: [],
            publishers: []
        };
    }
}

module.exports = Game;