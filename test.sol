// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./NFT.sol";
import "./NFT1155.sol";
import "./ReentrancyGuard.sol";
import "./Counters.sol";
import "./ERC1155.sol";
import "./IERC20.sol";
import "./IERC1155Receiver.sol";

contract Test is ReentrancyGuard {
    uint256 public commissionNFT = 2; // 2%

    mapping(bytes32 => address) public currency;

    function setUpCurrency(bytes32 _currency, address _address) public {
        currency[_currency] = _address;
    }

    function payInvoice(
        uint256 amountToPay,
        bytes32 _currency,
        uint256 tokenID,
        address nftContractAddress,
        address _seller,
        address _marketOwner
    ) public payable nonReentrant {
        bool sentSeller;
        bool sentMarketOwner;
        if (_currency == "ETH") {
            (sentSeller, ) = _seller.call{
                value: (amountToPay * (100 - commissionNFT)) / 100
            }("");
            (sentMarketOwner, ) = _marketOwner.call{
                value: (amountToPay * commissionNFT) / 100
            }("");
        } else {
            require(
                currency[_currency] != address(0x0),
                "No Currency Support Yet"
            );
            require(
                IERC20(currency[_currency]).transferFrom(
                    msg.sender,
                    address(this),
                    amountToPay
                ),
                "transfer Failed"
            );
            sentSeller = IERC20(currency[_currency]).transfer(
                _seller,
                (amountToPay * (100 - commissionNFT)) / 100
            );
            sentMarketOwner = IERC20(currency[_currency]).transfer(
                _marketOwner,
                (amountToPay * commissionNFT) / 100
            );
        }
        require(
            sentSeller && sentMarketOwner,
            "Cannot transfer fee to Seller & MarketOwner"
        );
        IERC721(nftContractAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenID
        );
    }
}
