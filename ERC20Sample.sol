// contracts/ERC20_Token_test.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20.sol";

contract ERC20Sample is ERC20 {
    constructor(uint256 initialSupply) ERC20("SampleToken", "ST") {
        _mint(msg.sender, initialSupply);
    }
}

// ERC20 template
// https://docs.binance.org/smart-chain/developer/issue-BEP20.html
