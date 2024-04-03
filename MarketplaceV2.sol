// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./NFT.sol";
import "./NFT1155.sol";
import "./ReentrancyGuard.sol";
import "./Counters.sol";
import "./ERC1155.sol";
import "./IERC20.sol";

contract MarketplaceV2 is ReentrancyGuard {
    // currency in bytes (CAPITAL)
    // ETH: 0x4554480000000000000000000000000000000000000000000000000000000000
    // USDT: 0x5553445400000000000000000000000000000000000000000000000000000000
    // USDC: 0x5553444300000000000000000000000000000000000000000000000000000000
    // FIAT: 0x4649415400000000000000000000000000000000000000000000000000000000

    using Counters for Counters.Counter;

    Counters.Counter public _marketNftIds;
    Counters.Counter public _market1155Ids;

    address public _owner;

    address payable public _marketOwner;

    uint256 public commissionNFT = 2; // 2%

    uint256 public commission1155 = 1; // 0.1%

    mapping(uint256 => MarketNftItem) public _NftIDtoMarketNftItem;

    mapping(uint256 => Market1155Item) public _1155IDtoMarketNftItem;

    mapping(address => mapping(address => bool)) public listingPermit;

    mapping(bytes32 => address) public currency;

    struct MarketNftItem {
        uint256 marketNftId;
        address nftContractAddress;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bytes32 currency;
        bool sold;
        bool canceled;
    }

    struct Market1155Item {
        uint256 market1155Id;
        address ERC1155ContractAddress;
        uint256 tokenId;
        uint256 amount;
        address payable seller;
        uint256 priceEachItem; // price of each amount of tokenID
        bytes32 currency;
        bool soldOut;
        bool canceled;
    }

    event NftItemEvent(
        uint256 indexed marketNftId,
        address indexed nftContract,
        uint256 indexed tokenNftId,
        address seller,
        address buyer,
        uint256 price,
        bytes32 currency,
        bool canceled
    );

    event ERC1155ItemEvent(
        uint256 indexed market1155Id,
        address indexed ERC1155Contract,
        uint256 indexed token1155Id,
        uint256 amount,
        address seller,
        address buyer,
        uint256 priceEachItem,
        bytes32 currency,
        bool canceled
    );

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        _marketOwner = payable(msg.sender);
    }

    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert();
        }
        _;
    }

    error OwnableInvalidOwner(address owner);

    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    function setUpInitialOwner() public {
        require(
            msg.sender == address(0x7268bEe5516b3159E2125De548eDfcA42f0C73CB), // replace by real owner before deploying
            ""
        );
        _owner = address(0x7268bEe5516b3159E2125De548eDfcA42f0C73CB); // replace by real owner before deploying
    }

    function setUpCurrency(
        bytes32 _currency,
        address _address
    ) public onlyOwner {
        currency[_currency] = _address;
    }

    function setUpCommissionNFT(uint256 a) public onlyOwner {
        commissionNFT = a;
    }

    function getCommissionNFT() public view returns (uint256) {
        return commissionNFT;
    }

    function setUpCommission1155(uint256 a) public onlyOwner {
        commission1155 = a;
    }

    function getCommission1155() public view returns (uint256) {
        return commission1155;
    }

    // Many nftContractAddress for different catagories
    // Only One Market Place
    function listNftToMarket(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price,
        bytes32 _currency
    ) public payable nonReentrant returns (uint256) {
        require(price > 0, "Price must be at least 1");
        _marketNftIds.increment();
        uint256 marketNftId = _marketNftIds.current();

        _NftIDtoMarketNftItem[marketNftId] = MarketNftItem(
            marketNftId,
            nftContractAddress,
            tokenId,
            payable(msg.sender), // seller
            price,
            _currency,
            false,
            false
        );

        IERC721(nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        emit NftItemEvent(
            marketNftId,
            nftContractAddress,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            _currency,
            false
        );

        return marketNftId;
    }

    function listBatchNftToMarket(
        address nftContractAddress,
        uint256[] memory tokenId,
        uint256[] memory price,
        bytes32 _currency
    ) public payable nonReentrant returns (uint256) {
        require(tokenId.length == price.length, "Not correct length");
        for (uint i = 0; i < tokenId.length; i++) {
            _marketNftIds.increment();
            uint256 marketNftId = _marketNftIds.current();

            _NftIDtoMarketNftItem[marketNftId] = MarketNftItem(
                marketNftId,
                nftContractAddress,
                tokenId[i],
                payable(msg.sender), // seller
                price[i],
                _currency,
                false,
                false
            );

            IERC721(nftContractAddress).transferFrom(
                msg.sender,
                address(this),
                tokenId[i]
            );

            emit NftItemEvent(
                marketNftId,
                nftContractAddress,
                tokenId[i],
                payable(msg.sender),
                payable(address(0)),
                price[i],
                _currency,
                false
            );
        }
        return _marketNftIds.current();
    }

    function adjustNftItem(
        uint256 marketNftId,
        uint256 adjustPrice
    ) public nonReentrant {
        MarketNftItem memory temp = _NftIDtoMarketNftItem[marketNftId];
        uint256 tokenId = temp.tokenId;
        require(tokenId > 0, "Market item has to exist");
        require(temp.seller == msg.sender, "You are not the seller");
        _NftIDtoMarketNftItem[marketNftId].price = adjustPrice;
        emit NftItemEvent(
            marketNftId,
            temp.nftContractAddress,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            adjustPrice,
            temp.currency,
            false
        );
    }

    function cancelNftItem(
        address nftContractAddress,
        uint256 marketNftId
    ) public payable nonReentrant {
        MarketNftItem memory temp = _NftIDtoMarketNftItem[marketNftId];
        uint256 tokenId = temp.tokenId;
        require(tokenId > 0, "Market item has to exist");
        require(temp.canceled == false, "Need to be canceled");
        require(temp.seller == msg.sender, "You are not the seller");

        // return NFT to seller
        IERC721(nftContractAddress).transferFrom(
            address(this),
            temp.seller,
            tokenId
        );

        _NftIDtoMarketNftItem[marketNftId].canceled = true;

        emit NftItemEvent(
            marketNftId,
            nftContractAddress,
            tokenId,
            payable(address(0)),
            payable(address(0)),
            0,
            temp.currency,
            true
        );
    }

    function list1155ToMarket(
        address ERC1155ContractAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 priceEachItem, // price for each item (not total amount)
        bytes32 _currency,
        bytes memory data
    ) public payable nonReentrant returns (uint256) {
        require(priceEachItem > 0, "Price must be at least 1 wei");
        require(
            NFT1155(ERC1155ContractAddress).balanceOf(msg.sender, tokenId) > 0,
            "Not Allow"
        );
        _market1155Ids.increment();
        uint256 market1155Ids = _market1155Ids.current();

        _1155IDtoMarketNftItem[market1155Ids] = Market1155Item(
            market1155Ids,
            ERC1155ContractAddress,
            tokenId,
            amount,
            payable(msg.sender), // seller
            priceEachItem,
            _currency,
            false,
            false
        );

        IERC1155(ERC1155ContractAddress).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount, // if amount > total available amount of tokenID of that ERC1155ContractAddress => revert
            data
        );

        emit ERC1155ItemEvent(
            market1155Ids,
            ERC1155ContractAddress,
            tokenId,
            amount,
            payable(msg.sender),
            payable(address(0)),
            priceEachItem,
            _currency,
            false
        );

        return market1155Ids;
    }

    function listBatch1155ToMarket(
        address ERC1155ContractAddress,
        uint256[] memory tokenId,
        uint256[] memory amount,
        uint256[] memory priceEachItem,
        bytes32 _currency,
        bytes memory data
    ) public payable nonReentrant returns (uint256) {
        require(
            tokenId.length == priceEachItem.length &&
                tokenId.length == amount.length,
            "Not correct length"
        );
        uint256 i;
        for (i = 0; i < tokenId.length; i++) {
            require(priceEachItem[i] > 0, "Price must be at least 1 wei");
        }

        address[] memory tempAccount = new address[](tokenId.length);

        for (i = 0; i < tokenId.length; i++) {
            tempAccount[i] = msg.sender;
        }

        uint256[] memory tempBalance = NFT1155(ERC1155ContractAddress)
            .balanceOfBatch(tempAccount, tokenId);

        for (i = 0; i < tokenId.length; i++) {
            require(tempBalance[i] > 0, "Not Allow");
        }

        for (i = 0; i < tokenId.length; i++) {
            _market1155Ids.increment();
            uint256 market1155Ids = _market1155Ids.current();

            _1155IDtoMarketNftItem[market1155Ids] = Market1155Item(
                market1155Ids,
                ERC1155ContractAddress,
                tokenId[i],
                amount[i],
                payable(msg.sender), // seller
                priceEachItem[i],
                _currency,
                false,
                false
            );

            IERC1155(ERC1155ContractAddress).safeTransferFrom(
                msg.sender,
                address(this),
                tokenId[i],
                amount[i], // if amount[i] > total available amount of tokenID of that ERC1155ContractAddress => revert
                data
            );

            emit ERC1155ItemEvent(
                market1155Ids,
                ERC1155ContractAddress,
                tokenId[i],
                amount[i],
                payable(msg.sender),
                payable(address(0)),
                priceEachItem[i],
                _currency,
                false
            );
        }
        return _market1155Ids.current();
    }

    function cancel1155Item(
        address ERC1155ContractAddress,
        uint256 market1155Id,
        bytes memory data // blank is default
    ) public payable nonReentrant {
        Market1155Item memory temp = _1155IDtoMarketNftItem[market1155Id];
        uint256 tokenId = temp.tokenId;
        require(tokenId > 0, "Market item has to exist");
        require(temp.canceled == false, "Need to be canceled");
        require(temp.seller == msg.sender, "You are not the seller");

        // return ERC1155 to seller
        IERC1155(ERC1155ContractAddress).safeTransferFrom(
            address(this),
            temp.seller,
            tokenId,
            temp.amount,
            data
        );

        _1155IDtoMarketNftItem[market1155Id].canceled = true;

        emit ERC1155ItemEvent(
            market1155Id,
            ERC1155ContractAddress,
            tokenId,
            0,
            payable(address(0)),
            payable(address(0)),
            0,
            temp.currency,
            true
        );
    }

    function adjust1155Item(
        uint256 market1155Id,
        uint256 adjustPriceEachItem,
        uint256 adjustAmt
    ) public nonReentrant {
        Market1155Item memory temp = _1155IDtoMarketNftItem[market1155Id];
        uint256 tokenId = temp.tokenId;
        require(tokenId > 0, "Market item has to exist");
        require(temp.seller == msg.sender, "You are not the seller");
        require(
            adjustPriceEachItem != temp.priceEachItem ||
                adjustAmt != temp.amount,
            "Not thing change"
        );
        _1155IDtoMarketNftItem[market1155Id]
            .priceEachItem = adjustPriceEachItem;
        _1155IDtoMarketNftItem[market1155Id].amount = adjustAmt;
        emit ERC1155ItemEvent(
            market1155Id,
            temp.ERC1155ContractAddress,
            tokenId,
            temp.amount - adjustAmt,
            payable(msg.sender),
            payable(address(0)),
            adjustPriceEachItem,
            temp.currency,
            false
        );
    }

    function purchaseNftFiat(
        address nftContractAddress,
        address _buyer,
        uint256 marketNftId
    ) public payable nonReentrant onlyOwner {
        MarketNftItem memory temp = _NftIDtoMarketNftItem[marketNftId];
        require(temp.currency == "FIAT", "not correct currency");
        IERC721(nftContractAddress).transferFrom(
            address(this),
            _buyer,
            temp.tokenId
        );
        _NftIDtoMarketNftItem[marketNftId].sold = true;

        emit NftItemEvent(
            marketNftId,
            nftContractAddress,
            temp.tokenId,
            payable(address(0)),
            _buyer,
            temp.price,
            "FIAT",
            false
        );
    }

    function purchaseNft(
        address nftContractAddress,
        uint256 marketNftId,
        bytes32 _currency
    ) public payable nonReentrant {
        MarketNftItem memory temp = _NftIDtoMarketNftItem[marketNftId];
        bool sentSeller;
        bool sentMarketOwner;
        if (_currency == "ETH") {
            require(
                msg.value == temp.price,
                "Please submit the asking price in order to continue"
            );
            sentSeller = temp.seller.send(
                (msg.value * (100 - commissionNFT)) / 100
            );
            sentMarketOwner = payable(_marketOwner).send(
                (msg.value * commissionNFT) / 100 - 10
            ); // minus 10 wei for safeMath
        } else {
            require(
                currency[_currency] != address(0x0),
                "No Currency Support Yet"
            );
            IERC20(currency[_currency]).transferFrom(
                msg.sender,
                address(this),
                temp.price
            );
            sentSeller = IERC20(currency[_currency]).transfer(
                temp.seller,
                (temp.price * (100 - commissionNFT)) / 100
            );
            sentMarketOwner = IERC20(currency[_currency]).transfer(
                _marketOwner,
                (temp.price * commissionNFT) / 100 - 10
            ); // minus 10 wei for safeMath
        }

        require(
            sentSeller && sentMarketOwner,
            "Cannot transfer fee to Seller & MarketOwner"
        );
        IERC721(nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            temp.tokenId
        );
        _NftIDtoMarketNftItem[marketNftId].sold = true;

        emit NftItemEvent(
            marketNftId,
            nftContractAddress,
            temp.tokenId,
            payable(address(0)),
            msg.sender,
            temp.price,
            _currency,
            false
        );
    }

    function purchase1155Fiat(
        address _ERC1155ContractAddress,
        address _buyer,
        uint256 market1155Id,
        uint256 _amount,
        bytes memory data
    ) public nonReentrant onlyOwner {
        Market1155Item memory temp = _1155IDtoMarketNftItem[market1155Id];
        uint256 amountTemp = _1155IDtoMarketNftItem[market1155Id].amount;
        IERC1155(_ERC1155ContractAddress).safeTransferFrom(
            address(this),
            _buyer,
            temp.tokenId,
            _amount,
            data
        );

        amountTemp -= _amount;

        if (amountTemp == 0) {
            _1155IDtoMarketNftItem[market1155Id].soldOut = true;
        }

        emit ERC1155ItemEvent(
            market1155Id,
            _ERC1155ContractAddress,
            temp.tokenId,
            _amount,
            payable(address(0)),
            _buyer,
            temp.priceEachItem,
            temp.currency,
            false
        );
    }

    function purchase1155(
        address _ERC1155ContractAddress,
        uint256 market1155Id,
        uint256 _amount,
        bytes32 _currency,
        bytes memory data
    ) public payable nonReentrant {
        Market1155Item memory temp = _1155IDtoMarketNftItem[market1155Id];
        uint256 amountTemp = _1155IDtoMarketNftItem[market1155Id].amount;
        bool sentSeller;
        bool sentMarketOwner;
        require(_amount <= amountTemp, "More than ERC1155 amount");
        if (_currency == "ETH") {
            require(
                msg.value == temp.priceEachItem * _amount,
                "Please submit the asking price in order to continue"
            );
            sentSeller = temp.seller.send(
                (msg.value * (1000 - commission1155)) / 1000
            );
            sentMarketOwner = payable(_marketOwner).send(
                (msg.value * commission1155) / 1000 - 10
            ); // minus 10 wei for safeMath
        } else {
            require(
                currency[_currency] != address(0x0),
                "No Currency Support Yet"
            );
            IERC20(currency[_currency]).transferFrom(
                msg.sender,
                address(this),
                temp.priceEachItem * _amount
            );
            sentSeller = IERC20(currency[_currency]).transfer(
                temp.seller,
                (temp.priceEachItem * _amount * (1000 - commission1155)) / 1000
            );
            sentMarketOwner = IERC20(currency[_currency]).transfer(
                _marketOwner,
                (temp.priceEachItem * _amount * commission1155) / 1000 - 10
            ); // minus 10 wei for safeMath
        }

        require(
            sentSeller && sentMarketOwner,
            "Cannot transfer fee to Seller & MarketOwner"
        );

        IERC1155(_ERC1155ContractAddress).safeTransferFrom(
            address(this),
            msg.sender,
            temp.tokenId,
            _amount,
            data
        );

        amountTemp -= _amount;

        if (amountTemp == 0) {
            _1155IDtoMarketNftItem[market1155Id].soldOut = true;
        }
        emit ERC1155ItemEvent(
            market1155Id,
            _ERC1155ContractAddress,
            temp.tokenId,
            _amount,
            payable(address(0)),
            payable(msg.sender),
            temp.priceEachItem,
            _currency,
            false
        );
    }

    function testForFun() public pure returns (uint256) {
        return 1;
    }
}
