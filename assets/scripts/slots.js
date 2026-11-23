let tokens = 20;

function spin() {
    const cwd = "assets/images/";
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

    console.log("test");

    for (row in choices) {
        for (column in row) {
            if (choices[row][column] == null) {
                console.error("Error assigning choices[" + row.toString() + "][" + column.toString() + "]; see line 66.");
            }
        }
    }

    if (tokens > 0) {
        tokens--;
        let winCon = false;
        let computerPick = -1;

        results = [0, 1, 2];

        for (let result = 0;
                 result < results.length;
                 result++
        ) {
            let currentIndex = results[result];

            computerPick = RandomInt(
                0,
                (choices[currentIndex].length - 1)
            );

            results[result] = choices[currentIndex][computerPick];
        }

        slot0.src = cwd + results[0] + ext;
        slot1.src = cwd + results[1] + ext;
        slot2.src = cwd + results[2] + ext;


        let tokensAdded = 0;
        // Wincons
        if (results.includes('Cherry') &&
            results.indexOf('Cherry') !== results.lastIndexOf('Cherry')
        ) {
        // Two cherries
            tokensAdded += 4;
        } else if (results.includes('Cherry')
        ) {
        // One cherry
            tokensAdded += 2;
        } else if (results[0] == results[1] &&
                   results[1] == results[2] &&
                   results[2] == results[0]
        ) {
        // Three matches
            switch (results[0]) {
                case "Seven":
                    tokensAdded += 300;
                    break;
                case "Rocket":
                    tokensAdded += 100;
                    break;
                case "Pikachu":
                case "Slowpoke":
                    tokensAdded += 15;
                    break;
                case "Magnemite:":
                case "Staryu":
                    tokensAdded += 8;
                    break;
                default:
                    console.log("Wincon switch failed; see line 113");
            }
        }
        if (tokensAdded > 0) {
            winCon = true;
        }

        if (winCon) {
            returnMsg.innerHTML = "<span style='color: red; font-size: 32px;'>You win " + tokensAdded.toString() + " tokens!</span>";
            tokens += tokensAdded;
        } else if (tokens == 0) {
            returnMsg.innerHTML = "<span style='color: red; font-size: 32px;'>WARNING - no tokens left.</span>";
        } else {
            returnMsg.innerHTML = ""
        }
        tokenCount.innerHTML = "Tokens remaining: " + tokens.toString();
    } else {
        slotButton.hidden = true;
    }
}
