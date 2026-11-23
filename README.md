# Project 8.E

Zac Schimpf

CSC 121-9

Project X8.E

Nov 24, 2026

&nbsp;
## Source

- [Computer Science: Concepts & Explorations, 3rd ed.](https://freecsc.com/X8.html), David Reed, 2025.

- [CSC121](https://blueline.instructure.com/courses/1212692/assignments/6781543)  (Computers and Scientific Thinking): Project 8.E

- [FRLG - Basic Rules](https://bulbapedia.bulbagarden.net/wiki/Slot_machine#Generation_I_and_FireRed_and_LeafGreen) (Game Corner Slot Machines), Bulbapedia, 2026.

- [FRLG - Underlying Logic](https://game8.co/games/Pokemon-FireRed-LeafGreen/archives/584800) (How to Win at Slots in the Casino), Game8, 2026.

&nbsp;
## Parameters

- [X] Name file `slots.html`
- [X] Three horizontal slots
- [X] Four total possibilites
- [X] Button below to initiate
- [X] `YOU WON!` in large, red font
- [X] Display no message on loss
- [X] Track tokens with global var
- [X] Start game with 20 tokens
- [X] Each spin costs 1 token
- [X] Track token loss and gain
- [X] Validate tokens >0, else warnings

&nbsp;
## Rules

| Symbol        | Quantity  | Matches   | Reward    |
| :---          | ---:      | ---:      | ---:      |
| Seven.png     | 1         | 3         | 300       |
| Rocket.png    | 3         | 3         | 100       |
| Pickachu.png  | 3         | 3         | 15        |
| Slowpoke.png  | 3         | 3         | 15        |
| Magnemite.png | 3         | 3         | 8         |
| Staryu.png    | 4         | 3         | 8         |
| Cherry.png    | 4         | 2         | 6         |
| Cherry.png    | 4         | 1         | 2         |

&nbsp;
## Todo

- [ ] Modularize into functions
- [ ] Add JSDocs to functions
- [ ] Add array null validation
- [ ] Add option to use <=3 tokens
- [ ] Add three rows of slots
- [ ] Add three slot stops
- [ ] Add rotation animation
- [ ] Add rotation delay and slip
- [ ] Add celadon background
- [ ] Add payout and credits section
- [ ] Add Team Rocket Pokemon shop
