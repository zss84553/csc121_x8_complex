const imgDir = "assets/images/";
const ext = ".png";

const choices = [
    Array(21).fill(null),
    Array(22).fill(null),
    Array(21).fill(null)
];

const slotCoordinates = {
    "Seven": [
        [0, 0], [0, 8], [0, 15],
        [1, 0], [1, 12],
        [2, 0]
    ],
    "Slowpoke": [
        [0, 1], [0, 10],
        [1, 3], [1, 7], [1, 11], [1, 17], [1, 20],
        [2, 1], [2, 5], [2, 9], [2, 13], [2, 17]
    ],
    "Cherry": [
        [0, 2], [0, 12],
        [1, 2], [1, 6], [1, 10], [1, 15], [1, 21]
    ],
    "Rocket": [
        [0, 3], [0, 11], [0, 18],
        [1, 4], [1, 16],
        [2, 20]
    ],
    "Pikachu": [
        [0, 4], [0, 6], [0, 13], [0, 17], [0, 20],
        [1, 8], [1, 13],
        [2, 4], [2, 8], [2, 12], [2, 16]
    ],
    "Staryu": [
        [0, 5], [0, 9], [0, 14], [0, 19],
        [1, 18],
        [2, 2], [2, 6], [2, 11], [2, 15], [2, 19]
    ],
    "Magnemite": [
        [0, 7], [0, 16],
        [1, 1], [1, 5], [1, 9], [1, 14], [1, 19],
        [2, 3], [2, 7], [2, 10], [2, 14], [2, 18]
    ]
};

let tokens = 20;

init();

/**
 * Initializes choices[] from slotCoordinates{} provided by Game8
 * @returns {null}
 */
function init () {
    for (let currentChoice in slotCoordinates) {
        for (let rowIndex = 0;
                 rowIndex < slotCoordinates[currentChoice].length;
                 rowIndex++)
        {
            let row = slotCoordinates[currentChoice][rowIndex][0];
            let column = slotCoordinates[currentChoice][rowIndex][1];

            choices[row][column] = currentChoice;
        }
    }

    for (let row = 0; row < choices.length; row++) {
        for (let column = 0; column < choices[row].length; column++) {
            if (choices[row][column] == null) {
                console.error(`Error assigning choices[${row.toString()}][${column.toString()}].`);
            }
        }
    }
}

/**
 * Main logic that randomizes results, calculates payout, and updates total tokens
 * @returns {null}
 */
function spin() {
    let wager = getWager();

    if (!Number.isInteger(wager) || wager < 1 || wager > 3) {
        returnMsg.innerHTML = "Please enter a wager between 1 and 3.";
    } else if (tokens < wager) {
        returnMsg.innerHTML = "WARNING - insufficient tokens.";
    } else {
        updateLights(wager);
        tokens -= wager;

        let results = getResults();
        updateWheel(results);

        let tokensWon = getTotalPayout(wager, results);
        tokens += tokensWon;

        if (tokensWon > 0) {
            returnMsg.textContent = `You win ${tokensWon} tokens!`;
        } else if (tokens === 0) {
            returnMsg.textContent = "WARNING - no tokens left.";
        } else {
            returnMsg.textContent = "No winning combination.";
        }
        tokenCount.textContent = `Tokens remaining: ${tokens}`;
    }
}

/**
 * Converts wager string entered on the HTML element ID
 * @returns {int} Resulting value, greater than 0 and less than 4
 */
function getWager() {
    let wagerInt = wager.valueAsNumber;
    if (Number.isInteger(wagerInt) &&
        wagerInt > 0 &&
        wagerInt <= 3
    ) {
        // pass
    } else {
        console.error(`Error assigning wager of "${wagerInt}".`)
        wagerInt = -1;
    }
    return wagerInt;
}

/**
 * Updates HTML numeric light images, based on getWager()
 * @param {int} wager - Token value provided via HTML element ID
 * @returns {null}
 */
function updateLights(wager) {
    let lights = [["MiddleLeft", "MiddleRight"],
                  ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
                  ["TopLeft", "TopRight", "BottomLeft", "BottomRight"]
    ];

    for (let lightIndex = 0; lightIndex < lights.length; lightIndex++) {
        for (let nameIndex = 0; nameIndex < lights[lightIndex].length; nameIndex++) {
            let lightState = "unlit";
            if (lightIndex + 1 <= wager) {
                lightState = "lit";
            }
            let targetImg = `${imgDir}${lightIndex + 1}_${lightState}${ext}`;
            window[`${lightIndex + 1}Light${lights[lightIndex][nameIndex]}`].src = targetImg;
        }
    }
}

/**
 * Randomizes all nine slot values based on Dave Reeds' random.js
 * @returns {List} Containing the three-dimensional array of image names from choices
 *  format: [
 *              ["TopLeft",    "TopCenter",    "TopRight"   ],
 *              ["MiddleLeft", "MiddleCenter", "MiddleRight"],
 *              ["BottomLeft", "BottomCenter", "BottomRight"]
 *          ]
 */
function getResults() {
    let results = [[],[],[]];

    for (let column = 0; column < results.length; column++) {
        maxLength = choices[column].length - 1;
        let rows = Array(3).fill(null);

        rows[1] = RandomInt(0, maxLength);

        // Maintain reel order
        rows[0] = rows[1] - 1;
        rows[2] = rows[1] + 1;

        // Check for array bounds
        if (rows[0] == -1) {
            rows[0] = maxLength;
        }
        if (rows[2] > maxLength) {
            rows[2] = 0;
        }

        results[0][column] = choices[column][rows[0]];
        results[1][column] = choices[column][rows[1]];
        results[2][column] = choices[column][rows[2]];
    }
    return results;
}

/**
 * Updates HTML slot images, based on the provided 3x3 array of image files.
 * @param {List} results - Three-dimensional array of image names from getResults
 * @returns {null}
 */
function updateWheel(results) {
    // slotRowColumn, row=Top/Middle/Bottom, column=Left/Center/Right
    const tableTemplate = [["TopLeft",    "TopCenter",    "TopRight"   ],
                           ["MiddleLeft", "MiddleCenter", "MiddleRight"],
                           ["BottomLeft", "BottomCenter", "BottomRight"]
    ];
    for (let row = 0; row < tableTemplate.length; row++){
        for (let column in tableTemplate[row]) {
            let targetImg = imgDir + results[row][column] + ext;
            window[`slot${tableTemplate[row][column]}`].src = targetImg;
        }
    }
}

/**
 * Calls getLinePayout, based on wager and results
 * @param {int} wager - Token value provided via HTML element ID
 * @param {List} results - Three-dimensional array of image names from getResults
 * @returns {int} Tokens to indicate win or loss; addend for tokens global var
 */
function getTotalPayout(wager, results) {
    let tokensWon = 0;

    if (wager == 1) {
        return getLinePayout(results[1]);
    } else if (wager > 1) {
        for (let row = 0; row < results.length; row++) {
            tokensWon += getLinePayout(results[row]);
        }
    }
    if (wager == 3) {
        let diagonalTopLeft = [
            results[0][0],
            results[1][1],
            results[2][2]
        ];

        let diagonalTopRight = [
            results[0][2],
            results[1][1],
            results[2][0]
        ];

        tokensWon += getLinePayout(diagonalTopLeft);
        tokensWon += getLinePayout(diagonalTopRight);
    }
    return tokensWon;
}

/**
 * Calculates payout based on global rules, regardless of directionality
 * @param {List} line - Horizontal or diagonal triplets to check matches against
 * @returns {int} Tokens to indicate win or loss; addend for tokens global var
 */
function getLinePayout(line) {
    let cherryCount = 0;

    for (let currentIndex = 0; currentIndex < line.length; currentIndex++) {
        if (line[currentIndex] == "Cherry") {
            cherryCount++;
        }
    }

    if (cherryCount >= 2) {
        return 4;
    } else if (cherryCount == 1) {
        return 2;
    }

    if (line[0] == line[1] && line[1] == line[2]) {
        switch (line[0]) {
            case "Seven":
                return 300;
            case "Rocket":
                return 100;
            case "Pikachu":
            case "Slowpoke":
                return 15;
            case "Magnemite":
            case "Staryu":
                return 8;
            default:
                console.error(`Wincon switch failed to parse "${line[0]}".`);
        }
    }
    return 0;
}
