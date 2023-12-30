// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./NFT.sol";
import "./NFT1155.sol";
import "./ReentrancyGuard.sol";
import "./Counters.sol";
import "./ERC1155.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter public _marketNftIds;
    Counters.Counter public _market1155Ids;

    address public _owner;

    address payable public _marketOwner;

    uint256 public listingNFTFee = 0.045 ether;

    uint256 public listing1155Fee = 0.00045 ether;

    mapping(uint256 => MarketNftItem) public _NftIDtoMarketNftItem;

    mapping(uint256 => Market1155Item) public _1155IDtoMarketNftItem;

    mapping(address => mapping(address => bool)) public listingPermit;

    struct MarketNftItem {
        uint256 marketNftId;
        address nftContractAddress;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;
        bool canceled;
    }

    struct Market1155Item {
        uint256 market1155Id;
        address nftContractAddress;
        uint256 tokenId;
        uint256 amount;
        address payable seller;
        uint256 priceEachItem; // price of each amount of tokenID
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
            msg.sender == address(0x7268bEe5516b3159E2125De548eDfcA42f0C73CB),
            ""
        );
        _owner = address(0x7268bEe5516b3159E2125De548eDfcA42f0C73CB);
    }

    function setUpListingNFTFee(uint256 a) public onlyOwner {
        listingNFTFee = a;
    }

    function getListingNFTFee() public view returns (uint256) {
        return listingNFTFee;
    }

    function setUpListing1155Fee(uint256 a) public onlyOwner {
        listing1155Fee = a;
    }

    function getListing1155Fee() public view returns (uint256) {
        return listing1155Fee;
    }

    // Many nftContractAddress for different catagories
    // Only One Market Place
    function listNftToMarket(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant returns (uint256) {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingNFTFee,
            "Price must be equal to listing price"
        );
        _marketNftIds.increment();
        uint256 marketNftId = _marketNftIds.current();

        _NftIDtoMarketNftItem[marketNftId] = MarketNftItem(
            marketNftId,
            nftContractAddress,
            tokenId,
            payable(msg.sender), // seller
            price,
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
            false
        );

        return marketNftId;
    }

    function listBatchNftToMarket(
        address nftContractAddress,
        uint256[] memory tokenId,
        uint256[] memory price
    ) public payable nonReentrant returns (uint256) {
        require(tokenId.length == price.length, "Not correct length");
        require(
            msg.value == listingNFTFee * tokenId.length,
            "Price must be equal to listing price * number of tokenID in a batch"
        );
        for (uint i = 0; i < tokenId.length; i++) {
            _marketNftIds.increment();
            uint256 marketNftId = _marketNftIds.current();

            _NftIDtoMarketNftItem[marketNftId] = MarketNftItem(
                marketNftId,
                nftContractAddress,
                tokenId[i],
                payable(msg.sender), // seller
                price[i],
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
                false
            );
        }
        return _marketNftIds.current();
    }

    function cancelNftItem(
        address nftContractAddress,
        uint256 marketNftId
    ) public payable nonReentrant {
        MarketNftItem memory temp = _NftIDtoMarketNftItem[marketNftId];
        uint256 tokenId = temp.tokenId;
        require(tokenId > 0, "Market item has to exist");

        require(temp.seller == msg.sender, "You are not the seller");

        // return NFT to seller
        IERC721(nftContractAddress).transferFrom(
            address(this),
            temp.seller,
            tokenId
        );

        temp.canceled = true;

        payable(msg.sender).transfer((listingNFTFee * 90) / 100); // get 90% of listing fee

        emit NftItemEvent(
            marketNftId,
            nftContractAddress,
            tokenId,
            payable(address(0)),
            payable(address(0)),
            0,
            true
        );
    }

    function list1155ToMarket(
        address ERC1155ContractAddress,
        uint256 tokenId,
        uint256 amount,
        uint256 priceEachItem, // price for each item (not total amount)
        bytes memory data
    ) public payable nonReentrant returns (uint256) {
        require(priceEachItem > 0, "Price must be at least 1 wei");
        require(
            msg.value == listing1155Fee,
            "Price must be equal to listing price"
        );
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
            false
        );

        return market1155Ids;
    }

    function listBatch1155ToMarket(
        address ERC1155ContractAddress,
        uint256[] memory tokenId,
        uint256[] memory amount,
        uint256[] memory priceEachItem,
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

        require(
            msg.value == listing1155Fee * tokenId.length,
            "Price must be equal to listing priceEachItem mul Listing Fee"
        );
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
                false
            );
        }
        return _market1155Ids.current();
    }

    function cancel1155Item(
        address ERC1155ContractAddress,
        uint256 market1155Id,
        bytes memory data
    ) public payable nonReentrant {
        Market1155Item memory temp = _1155IDtoMarketNftItem[market1155Id];
        uint256 tokenId = temp.tokenId;
        require(tokenId > 0, "Market item has to exist");
        require(temp.seller == msg.sender, "You are not the seller");

        // return ERC1155 to seller
        IERC1155(ERC1155ContractAddress).safeTransferFrom(
            address(this),
            temp.seller,
            tokenId,
            temp.amount,
            data
        );

        temp.canceled = true;
        payable(msg.sender).transfer((listing1155Fee * 90) / 100); // get 90% of listing fee

        emit ERC1155ItemEvent(
            market1155Id,
            ERC1155ContractAddress,
            tokenId,
            0,
            payable(address(0)),
            payable(address(0)),
            0,
            true
        );
    }

    /**
     * @dev Creates a market sale by transfering msg.sender money to the seller and NFT token from the
     * marketplace to the msg.sender. It also sends the listingNFTFee to the marketplace owner.
     */
    function purchaseNft(
        address nftContractAddress,
        uint256 marketNftId
    ) public payable nonReentrant {
        uint256 price = _NftIDtoMarketNftItem[marketNftId].price;
        uint256 tokenId = _NftIDtoMarketNftItem[marketNftId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to continue"
        );

        _NftIDtoMarketNftItem[marketNftId].sold = true;

        _NftIDtoMarketNftItem[marketNftId].seller.transfer(msg.value);
        IERC721(nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        payable(_marketOwner).transfer(listingNFTFee);

        emit NftItemEvent(
            marketNftId,
            nftContractAddress,
            tokenId,
            payable(address(0)),
            msg.sender,
            price,
            false
        );
    }

    function purchase1155(
        address ERC1155ContractAddress,
        uint256 market1155Id,
        uint256 _amount,
        bytes memory data
    ) public payable nonReentrant {
        uint256 priceTemp = _1155IDtoMarketNftItem[market1155Id].priceEachItem;
        uint256 tokenId = _1155IDtoMarketNftItem[market1155Id].tokenId;
        uint256 amountTemp = _1155IDtoMarketNftItem[market1155Id].amount;
        address payable seller = _1155IDtoMarketNftItem[market1155Id].seller;
        require(_amount <= amountTemp, "More than ERC1155 amount");
        require(
            msg.value == priceTemp * _amount,
            "Please submit the asking price in order to continue"
        );
        seller.transfer(msg.value);
        IERC1155(ERC1155ContractAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            _amount,
            data
        );

        amountTemp -= _amount;
        payable(_marketOwner).transfer(listing1155Fee * _amount);

        emit ERC1155ItemEvent(
            market1155Id,
            ERC1155ContractAddress,
            tokenId,
            _amount,
            payable(address(0)),
            payable(msg.sender),
            priceTemp,
            false
        );
    }
}
