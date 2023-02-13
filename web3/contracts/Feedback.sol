// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Feedback {
    constructor() {
        console.log("This is a smart contract");
    }

    struct IFeedback {
        address sender;
        string message;
        uint256 timestamp;
    }

    IFeedback[] public feedbacks;

    function addFeedback(string memory _message) public {
        IFeedback memory newFeedback = IFeedback({
            sender: msg.sender,
            message: _message,
            timestamp: block.timestamp
        });
        feedbacks.push(newFeedback);
    }

    function getAllFeedback() public view returns (IFeedback[] memory) {
        return feedbacks;
    }
}
