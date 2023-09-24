// SPDX-License-Identifier: MIT
pragma solidity ^ 0.8.17;

import "./chessMint.sol";

contract chessToken is chessMint{ 

    address private owner;
    uint256 public bonus;
    mapping(address => bool) isRegistered;
    mapping(address => uint256) userBalance;
    mapping (address => uint256[]) ListOfUserGameIds;
    uint256 public counter  = 1;
    constructor(uint256 _bonus) {
        owner = msg.sender;
        bonus = _bonus;
    }

    struct gameData {
        address addr1;
        address addr2;
        uint256 gameId;
        string[] movesList;
        address winner;
        uint256 gameStake;
    }

    mapping(uint256 => gameData) datamap;

    //mint bonus tokens for new users
    function newUser(address _addr) public {
        require(!isRegistered[_addr], "user not unique");
        isRegistered[_addr] = true;
        mintTokens(_addr, bonus);
        userBalance[_addr] += bonus;
    }

    function buyTokens(address _addr, uint256 _amount) public {
        require(_amount>0, "enter some amount");
        mintTokens(_addr, _amount);
        userBalance[_addr] += _amount;
    }

    // function getBalance(address _addr) public view returns (uint) 
    // {
    //     return balanceOf[_addr];
    // }

    function mintTokens(address _addr, uint256 _amount) public {
        _transfer(owner, _addr, _amount*1e18); 
    }

    function burnTokens(address _addr, uint256 _amount) public {
        _transfer(_addr, owner, _amount*1e18); 
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }

    function destroy(address payable _addr) external payable onlyOwner{
        selfdestruct(_addr);
    }

    function startGame(address _addr1, address _addr2, uint256 stake) public {
        require(userBalance[_addr1] >= stake, "not enough balance");
        require(userBalance[_addr2] >= stake, "not enough balance");
        
        datamap[counter].addr1 = _addr1;
        datamap[counter].addr2 = _addr2;
        datamap[counter].gameStake = 2*stake;
        datamap[counter].gameId = counter;
        ListOfUserGameIds[_addr1].push(counter);
        ListOfUserGameIds[_addr2].push(counter);
        if(stake != 0){
        burnTokens(_addr1, stake);
        userBalance[_addr1] -= stake;
        burnTokens(_addr2, stake);
        userBalance[_addr2] -= stake;
        }
        
        counter++;
    }
    
    function endGame(address creatorAddress, string[] memory _movesList, uint256 winnerColor) public {
        uint gameId = ListOfUserGameIds[creatorAddress][ListOfUserGameIds[creatorAddress].length - 1];
        address _winner;
        if(winnerColor == 0){
            _winner = datamap[gameId].addr1;
        }
        else {
            _winner = datamap[gameId].addr2;
        }
        mintTokens(_winner, datamap[gameId].gameStake);
        userBalance[_winner] += datamap[gameId].gameStake; 
        datamap[counter].movesList = _movesList;
    }

    // function getGameId(address _winner)

    function getUserGameIds (address _addr) public view returns(uint256[] memory) {
        return ListOfUserGameIds[_addr];
    }

    function getCurrentGameIdCreatorAddress (address _addr) public view returns (address) {
        uint256 gameId =  ListOfUserGameIds[_addr][ListOfUserGameIds[_addr].length - 1];
        return datamap[gameId].addr1;
    }

    function getBalance(address _addr) public view returns(uint256){
        return userBalance[_addr];
    }

}