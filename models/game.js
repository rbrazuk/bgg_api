class Game {
    constructor(id, name, yearPublished, description, playerCount, playtime, links) {
        this.id = id;
        this.name = name;
        this.yearPublished = yearPublished;
        this.description = description;
        this.playerCount = {};
        this.playtime = {};
        this.links = {};
    }
}