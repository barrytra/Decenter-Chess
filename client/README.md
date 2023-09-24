# Decenter Chess

  

### demo video
https://www.loom.com/share/a254c73f5c634649847529fcba3308f7?sid=7ec1be39-db48-4e93-9271-2b3a0fe1f928
  

## Idea

The idea is to create a decentralised chess game platfrom where users can play chess with their friends by staking cryptocurrencies. All the data of every game is stored on ethereum testnet(Goerli) blockchain.

  

## What it Does

A decentralised multiplayer Chess game platform. It has two modes to play:

1. Unrated Mode: It is a friendly mode where you can play without staking any tokens.

2. Rated Mode: Here users can stake CHS tokens and the winner will get all the reward. In case of a draw users will get their tokens back.

**Reward System :**
 Users connect via metamask account. As you connect we get two options create game or join game. One user creates the game by entering a game ID of his choice. User also get option to choose the stake amount for the game. The other user on his server joins the game by entering the same game ID entered by his friends. Once they join and sign the contract, game starts. At the end of the game winner gets a metamask popup to sign his winning contract. And the winner will be rewarded all the staked coins.

**Moves data :**  At the end of game when the user signs the contract, All of the data of moves played in the game gets stored in the blockchain.

**About CHS Tokens :** CHS tokens are custom ERC20 tokens that i have used for the game. Users can buy tokens by signing the contract which will take Goerli ETH(testnet Token) as the gas fee.  

  

## How it is built
 **Frontend** is built on ReactJS. for the chess board making I took assistance from a github repository https://github.com/felerticia/chess . 
 **Server** part is accomplished through socket.io . which helps to users to connect and share data accross.
 **backend** is built with solidity. I made two smart contracts. chessMint.sol contract is for creating the token and all of its functionalities are defined in the contract. Second contract is chessGame.sol. Here is all the logic behind the dApp. creating a game, ending the game, providing CHS tokens to users and more...
  

## Challenges I ran into
I am already familier with solidity smart contracts. Creating a game board with all functionalities was a new learning as i got to know many more uses in React. I haven't got time to fix code to flip the board for the user with black pieces. Also working with socket.io as server was something i haven't done before. Integrating everything with server was a huge task. But the sense of satisfaction after getting rod of those errors and bugs is next level :)
  

## what's next for Decenter Chess

 - creating a CPU mode.
 - integrating NFTs. which will be customised pieces which users will be able to buy with CHS tokens.  and these pieces will be displayed on their board while they play.
