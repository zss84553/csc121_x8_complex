let tokens = 20;

function spin() {
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
                tokens = -1;  // Invalidate session
            }
        }
    }

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

    let lights = [["MiddleLeft", "MiddleRight"],
                  ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
                  ["TopLeft", "TopRight", "BottomLeft", "BottomRight"]
    ];

    for (let lightIndex = 0; lightIndex < lights.length; lightIndex++) {
        for (let nameIndex = 0; nameIndex < lights[lightIndex].length; nameIndex++) {
            let lightState = "unlit";
            if (lightIndex + 1 <= wagerInt) {
                lightState = "lit";
            }
            let targetImg = `${imgDir}${lightIndex + 1}_${lightState}${ext}`;
            window[`${lightIndex + 1}Light${lights[lightIndex][nameIndex]}`].src = targetImg;
        }
    }

    if (tokens > 0 && tokens >= wagerInt && wagerInt > 0) {
        tokens -= wagerInt;
        let winCon = false;
        let computerPick = -1;

        let results = [[0, 1, 2],
                       [0, 1, 2],
                       [0, 1, 2]
        ];

        for (let row = 0; row < results.length; row++) {
            for (let column = 0; column < results[row].length; column++) {
                computerPick = RandomInt(
                    0,
                    choices[column].length - 1
                );
                results[row][column] = choices[column][computerPick];
            }
        }

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

        let tokensWon = 0;
        // Wincons
        if (wagerInt > 1) {
            // Horizontal checks
            for (let row = 0; row < results.length; row++) {
                // Two cherries
                if (results[row].includes('Cherry') &&
                    results[row].indexOf('Cherry') !== results[row].lastIndexOf('Cherry')
                ) {
                    tokensWon += 4;
                // One cherry
                } else if (results[row].includes('Cherry')
                ) {
                    tokensWon += 2;
                // Three matches
                } else if (results[row][0] == results[row][1] &&
                           results[row][1] == results[row][2] &&
                           results[row][2] == results[row][0]
                ) {
                    switch (results[row][1]) {
                        case "Seven":
                            tokensWon += 300;
                            break;
                        case "Rocket":
                            tokensWon += 100;
                            break;
                        case "Pikachu":
                        case "Slowpoke":
                            tokensWon += 15;
                            break;
                        case "Magnemite":
                        case "Staryu":
                            tokensWon += 8;
                            break;
                        default:
                            console.error(`Wincon switch failed to parse "${results[1][0]}" from "${results.toString()}".`);
                    }
                }
            }
            // Diagonal checks
            if (wagerInt == 3) {
                let rowDiagonalTopLeft = [results[0][0], results[1][1], results[2][2]]
                let rowDiagonalTopRight = [results[0][2], results[1][1], results[2][0]]
                const rows = [rowDiagonalTopLeft, rowDiagonalTopRight]

                for (let column = 0; column < rows.length; column++) {
                    // Two cherries
                    if (rows[column].includes('Cherry') &&
                        rows[column].indexOf('Cherry') !== rows[column].lastIndexOf('Cherry')
                    ) {
                        tokensWon += 4;
                    // One cherry
                    } else if (rows[column].includes('Cherry')
                    ) {
                        tokensWon += 2;
                    } else {
                        // Three matches
                        if (rows[column][0] == rows[column][1] &&
                            rows[column][1] == rows[column][2] &&
                            rows[column][2] == rows[column][0]
                        ) {
                            switch (rows[column][1]) {
                                case "Seven":
                                    tokensWon += 300;
                                    break;
                                case "Rocket":
                                    tokensWon += 100;
                                    break;
                                case "Pikachu":
                                case "Slowpoke":
                                    tokensWon += 15;
                                    break;
                                case "Magnemite":
                                case "Staryu":
                                    tokensWon += 8;
                                    break;
                                default:
                                    console.error(`Wincon switch failed to parse "${results[1][0]}" from "${results.toString()}".`);
                            }
                        }
                    }
                }
            }
        } else {
        // Only check center row


            if (results[1].includes('Cherry') &&
                results[1].indexOf('Cherry') !== results[1].lastIndexOf('Cherry')
            ) {
                // Two cherries
                tokensWon += 4;
            } else if (results[1].includes('Cherry')
            ) {
                // One cherry
                tokensWon += 2;
            } else if (results[1][0] == results[1][1] &&
                results[1][1] == results[1][2] &&
                results[1][2] == results[1][0]
            ) {
                // Three matches
                switch (results[1][0]) {
                    case "Seven":
                        tokensWon += 300;
                        break;
                    case "Rocket":
                        tokensWon += 100;
                        break;
                    case "Pikachu":
                    case "Slowpoke":
                        tokensWon += 15;
                        break;
                    case "Magnemite":
                    case "Staryu":
                        tokensWon += 8;
                        break;
                    default:
                        console.error(`Wincon switch failed to parse "${results[1][0]}" from "${results.toString()}".`);
                }
            }
        }
        if (tokensWon > 0) {
            winCon = true;
        }

        if (winCon) {
            returnMsg.innerHTML = `<span style='color: red; font-size: 32px;'>You win ${tokensWon.toString()} tokens!</span>`;
            tokens += tokensWon;
            tokensWon = 0;
        } else if (tokens == 0) {
            returnMsg.innerHTML = `<span style='color: red; font-size: 32px;'>WARNING - no tokens left.</span>`;
        } else {
            returnMsg.innerHTML = ``
        }
        tokenCount.innerHTML = `Tokens remaining: ${tokens.toString()}`;
    } else {
        returnMsg.innerHTML = `<span style='color: red; font-size: 32px;'>WARNING - insufficient tokens.</span>`;
    }
}
