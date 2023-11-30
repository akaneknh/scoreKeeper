
/**
 * Static GameUtils class - allows us to package up utility functions and values that we can use in our game
 * 
 * Note: we're using 'static' alot here because we don't need to create instances of GameUtils to make it work
 * All we want to do his is group values and functions together under a namespace (GameUtils) for use in our app
 */
class GameUtils {

    // default values - useful when we need to reset
    static BTN_CLASSES = ['button', 'is-primary', 'card-footer-item', 'is-large']
    static SUCCESS = 'has-text-success';
    static FAIL = 'has-text-danger';
    static WINNING_SCORE = 3;
    static ANNOUNCER_TEXT = 'Begin Game 🙂'

    // allows us to load all the elements whenever we want. Important to do this after the dom is loaded
    static loadElements() {
        this.resetButton = document.querySelector("#reset");
        this.winningScoreSelect = document.querySelector("#playto");
        this.btnFooter = document.querySelector('#btn-footer');
        this.announcer = document.querySelector('#announcer');
    }

    /**
     * get the defaults. Useful when resetting the game
     * @returns our default values in an object
     */
    static getDefaults() {
        return {
            BTN_CLASSES: this.BTN_CLASSES,
            SUCCESS: this.SUCCESS,
            FAIL: this.FAIL,
            WINNING_SCORE: this.WINNING_SCORE,
            ANNOUNCER_TEXT: this.ANNOUNCER_TEXT
        };
    }

    /**
     * creates a button element and binds text content and event handler before returning
     * @param {*} the buttons text content 
     * @param {*} the buttons click event handler  
     * @returns the button element itself
     */
    static generateButton(text, eventHandler) {
        const btnElement = document.createElement('button')

        btnElement.classList.add(...this.BTN_CLASSES)
        btnElement.textContent = text

        btnElement.addEventListener('click', eventHandler )

        return btnElement;
    }
}

/**
 * The Player class has all the methods and properties needed for a player in the game
 */
class Player {

    name = '';
    score = 0;

    //each player will have their own button for adding scores in the game
    button = null;

    /**
     * The constructor of a class is called when we create an instance of the class 
     * @example
     * const conor = new Player('Conor')
     * const akane = new Player('Akane')
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * A special static convenience method that we can use to generate Player instances quickly
     * @param array of strings representing each player name
     * @returns new instances of players that have the name provided
     */
    static CreateMultiple(names) {
        return names.map(name => new Player(name));
    }

    addScore() {
        this.score++;
    }   

    assignPlayerButton(button) {
        this.button = button;
    }

    reset() {
        this.score = 0;
        this.button.disabled = false;
    }
}

/**
 * The Game class orchestrates everything related to the Game. It is the main class in this progam
 */
class Game {
    gameOver = false;
    winningScore = GameUtils.WINNING_SCORE;
    players = [];

    /**
     * Players are passed to the Game whenever a new game is created
     * @param an array of Player instances 
     */
    constructor(players) {
        this.players = players
        this.generateGame();
    }

    /**
     * Load all elements and set up the game. 
     * 
     * notice how we dynamically generate each player button based on the number of players we have
     */
    generateGame() {
        GameUtils.loadElements()

        for(let player of this.players) {
            const button = GameUtils.generateButton(player.name, () => this.addPlayerScore(player));

            player.assignPlayerButton(button)
            GameUtils.btnFooter.appendChild(button)
        }

        GameUtils.announcer.textContent = GameUtils.ANNOUNCER_TEXT
        GameUtils.resetButton.addEventListener('click', () => this.resetGame())

        GameUtils.winningScoreSelect.addEventListener('change', (e) => this.setWinningScore(Number(e.target.value)))
    }


    addPlayerScore(currentPlayer) {
        currentPlayer.addScore();
        currentPlayer.button.textContent = `${currentPlayer.name} ${currentPlayer.score}`
        this.checkForWinningScore(currentPlayer)
    }

    /**
     * Check if the player has reached the winning score 
     * if they have - notify all players about winners / losers
     * @param currentPlayer - instance of Player that clicked the button
     */
    checkForWinningScore(currentPlayer) {
        if(currentPlayer.score === this.winningScore) {
            this.gameOver = true;
            this.disableAllPlayerButtons();

            this.notifyWinningPlayer(currentPlayer)
            this.notifyLosingPlayers(currentPlayer)
        }
    }

    setWinningScore(numberOfGames) {
        this.winningScore = numberOfGames
    }

    disableAllPlayerButtons() {
        this.players.forEach(player => player.button.disabled = true)
    }

    notifyLosingPlayers(winningPlayer) {
        /**
         * the filter method gets all players that match the condition
         * 
         * in this case it gets all players that are not the winning player
         */ 
        const otherPlayers = this.players.filter(player => player !== winningPlayer)
        otherPlayers.forEach(player => player.button.classList.add(GameUtils.FAIL))
    }

    notifyWinningPlayer(winningPlayer) {
        announcer.textContent = `${winningPlayer.name} Wins 🏆`
        announcer.classList.add(GameUtils.SUCCESS)
    }

    /**
     * Reset the game (elements and properties) using the defaults that we stored in GameUtils
     */
    resetGame() {
        /**
         * Here we're using a special syntax called destructring to get all properties on the object returned by the GameUtils.getDefaults() function
         * 
         * it works for both arrays and objects and makes code a bit cleaner
         * 
         * @link https://javascript.info/destructuring-assignment#object-destructuring
         */
        const {SUCCESS, FAIL, WINNING_SCORE, ANNOUNCER_TEXT} = GameUtils.getDefaults()

        /**
         * We can also destructure off GameUtils itself to get our elements
         */
        const {announcer, winningScoreSelect} = GameUtils

        this.gameOver = false
        this.players.forEach(player =>{ 
            player.reset()
            player.button.classList.remove(FAIL, SUCCESS)
            player.button.textContent = player.name
        })

        announcer.classList.remove(SUCCESS)
        announcer.textContent = ANNOUNCER_TEXT
        
        this.winningScore = WINNING_SCORE
        winningScoreSelect.value = WINNING_SCORE
    }
 
}
//create our game players using our static CreateMultiple convenience method
const players = Player.CreateMultiple(['Conor', 'Akane', 'Nate'])
const game = new Game(players)

/**
 * We can create as many players as we want and the game can handle it.
 * 
 * Comment the code above and uncomment the code below to see it in action
 * 
 * Note: has some CSS width issues on the card ;-) 
 */
//const players = Player.CreateMultiple(['Conor', 'Akane', 'Nate', 'Sara', 'Hugh', 'Paddy'])
//const game = new Game(players)

