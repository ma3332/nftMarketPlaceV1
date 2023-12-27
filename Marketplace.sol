// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./NFT.sol";
import "./ReentrancyGuard.sol";
import "./Counters.sol";

contract Marketplace is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter public _marketItemIds;
    Counters.Counter public _tokensSold;
    Counters.Counter public _tokensCanceled;

    address public _owner;

    address payable public _marketOwner;

    uint256 public listingFee = 0.045 ether;

    mapping(uint256 => MarketItem) public marketItemIdToMarketItem;

    mapping(address => mapping(address => bool)) public listingPermit;

    struct MarketItem {
        uint256 marketItemId;
        address nftContractAddress;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool canceled;
    }

    event MarketItemCreated(
        uint256 indexed marketItemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        bool sold,
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
        if (tx.origin != _owner) {
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

    function setUpListingFee(uint256 a) public onlyOwner {
        listingFee = a;
    }

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }

    // Creators of NFT allow seller to list their arts to marketplace on behalf of them
    function listingMarketPermission(address _seller) public {
        listingPermit[tx.origin][_seller] = true;
    }

    function listingMarketRevoke(address _seller) public {
        listingPermit[tx.origin][_seller] = false;
    }

    // Many nftContractAddress for different catagories
    // Only One Market Place
    function createMarketItem(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant returns (uint256) {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingFee,
            "Price must be equal to listing price"
        );
        _marketItemIds.increment();
        uint256 marketItemId = _marketItemIds.current();

        address creator = NFT(nftContractAddress).getTokenCreatorById(tokenId);

        require(
            creator == tx.origin || listingPermit[creator][tx.origin] == true,
            "Not Permit to list on Market"
        );

        marketItemIdToMarketItem[marketItemId] = MarketItem(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(creator), // creator
            payable(tx.origin), // seller
            payable(address(0)), // owner
            price,
            false,
            false
        );

        IERC721(nftContractAddress).transferFrom(
            tx.origin,
            address(this),
            tokenId
        );

        emit MarketItemCreated(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(creator),
            payable(tx.origin),
            payable(address(0)),
            price,
            false,
            false
        );

        return marketItemId;
    }

    function createBatchMarketItem(
        address nftContractAddress,
        uint256[] memory tokenId,
        uint256[] memory price
    ) public payable nonReentrant returns (uint256) {
        require(tokenId.length == price.length, "Not correct length");
        require(
            msg.value == listingFee * tokenId.length,
            "Price must be equal to listing price * number of tokenID in a batch"
        );
        for (uint i = 0; i < tokenId.length; i++) {
            _marketItemIds.increment();
            uint256 marketItemId = _marketItemIds.current();

            address creator = NFT(nftContractAddress).getTokenCreatorById(
                tokenId[i]
            );

            require(
                creator == tx.origin ||
                    listingPermit[creator][tx.origin] == true,
                "Not Permit to list on Market"
            );

            marketItemIdToMarketItem[marketItemId] = MarketItem(
                marketItemId,
                nftContractAddress,
                tokenId[i],
                payable(creator), // creator
                payable(tx.origin), // seller
                payable(address(0)), // owner
                price[i],
                false,
                false
            );

            IERC721(nftContractAddress).transferFrom(
                tx.origin,
                address(this),
                tokenId[i]
            );

            emit MarketItemCreated(
                marketItemId,
                nftContractAddress,
                tokenId[i],
                payable(creator),
                payable(tx.origin),
                payable(address(0)),
                price[i],
                false,
                false
            );
        }
        return _marketItemIds.current();
    }

    /**
     * @dev Cancel a market item, only seller can cancel market item (not creator, as some cases seller represent creator to list in market)
     */
    function cancelMarketItem(
        address nftContractAddress,
        uint256 marketItemId
    ) public payable nonReentrant {
        MarketItem memory temp = marketItemIdToMarketItem[marketItemId];
        uint256 tokenId = temp.tokenId;
        require(tokenId > 0, "Market item has to exist");

        require(temp.seller == tx.origin, "You are not the seller");

        // return NFT to creator
        IERC721(nftContractAddress).transferFrom(
            address(this),
            temp.creator,
            tokenId
        );

        temp.owner = temp.creator;
        temp.canceled = true;

        _tokensCanceled.increment();
        payable(tx.origin).transfer((listingFee * 90) / 100); // get 90% of listing fee
    }

    /**
     * @dev Get Latest Market Item by the token id
     */
    function getLatestMarketItemByTokenId(
        uint256 tokenId
    ) public view returns (MarketItem memory, bool) {
        uint256 itemsCount = _marketItemIds.current();

        for (uint256 i = itemsCount; i > 0; i--) {
            MarketItem memory item = marketItemIdToMarketItem[i];
            if (item.tokenId != tokenId) continue;
            return (item, true);
        }

        // What is the best practice for returning a "null" value in solidity?
        // Reverting does't seem to be the best approach as it would throw an error on frontend
        MarketItem memory emptyMarketItem;
        return (emptyMarketItem, false);
    }

    /**
     * @dev Creates a market sale by transfering tx.origin money to the seller and NFT token from the
     * marketplace to the tx.origin. It also sends the listingFee to the marketplace owner.
     */
    function createMarketSale(
        address nftContractAddress,
        uint256 marketItemId
    ) public payable nonReentrant {
        uint256 price = marketItemIdToMarketItem[marketItemId].price;
        uint256 tokenId = marketItemIdToMarketItem[marketItemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to continue"
        );

        marketItemIdToMarketItem[marketItemId].owner = payable(tx.origin);
        marketItemIdToMarketItem[marketItemId].sold = true;

        marketItemIdToMarketItem[marketItemId].seller.transfer(msg.value);
        IERC721(nftContractAddress).transferFrom(
            address(this),
            tx.origin,
            tokenId
        );

        _tokensSold.increment();

        payable(_marketOwner).transfer(listingFee);
    }

    /**
     * @dev Fetch non sold and non canceled market items
     */
    function fetchAvailableMarketItems()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 itemsCount = _marketItemIds.current();
        uint256 soldItemsCount = _tokensSold.current();
        uint256 canceledItemsCount = _tokensCanceled.current();
        uint256 availableItemsCount = itemsCount -
            soldItemsCount -
            canceledItemsCount;
        MarketItem[] memory marketItems = new MarketItem[](availableItemsCount);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < itemsCount; i++) {
            // https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/blob/main/contracts/Market.sol#L111
            MarketItem memory item = marketItemIdToMarketItem[i + 1];
            if (item.owner != address(0)) continue;
            marketItems[currentIndex] = item;
            currentIndex += 1;
        }
        return marketItems;
    }

    /**
     * @dev This seems to be the best way to compare strings in Solidity
     */
    function compareStrings(
        string memory a,
        string memory b
    ) public pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    /**
     * @dev Since we can't access structs properties dinamically, this function selects the address
     * we're looking for between "owner" and "seller"
     */
    function getMarketItemAddressByProperty(
        MarketItem memory item,
        string memory property
    ) public pure returns (address) {
        require(
            compareStrings(property, "seller") ||
                compareStrings(property, "owner"),
            "Parameter must be 'seller' or 'owner'"
        );

        return compareStrings(property, "seller") ? item.seller : item.owner;
    }

    /**
     * @dev Fetch market items that are being listed by the tx.origin
     */
    function fetchSellingMarketItems()
        public
        view
        returns (MarketItem[] memory)
    {
        return fetchMarketItemsByAddressProperty("seller");
    }

    /**
     * @dev Fetch market items that are owned by the tx.origin
     */
    function fetchOwnedMarketItems() public view returns (MarketItem[] memory) {
        return fetchMarketItemsByAddressProperty("owner");
    }

    /**
     * @dev Fetches market items according to the its requested address property that
     * can be "owner" or "seller". The original implementations were two functions that were
     * almost the same, changing only a property access. This refactored version requires an
     * addional auxiliary function, but avoids repeating code.
     * See original: https://github.com/dabit3/polygon-ethereum-nextjs-marketplace/blob/main/contracts/Market.sol#L121
     */
    function fetchMarketItemsByAddressProperty(
        string memory _addressProperty
    ) public view returns (MarketItem[] memory) {
        require(
            compareStrings(_addressProperty, "seller") ||
                compareStrings(_addressProperty, "owner"),
            "Parameter must be 'seller' or 'owner'"
        );
        uint256 totalItemsCount = _marketItemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemsCount; i++) {
            MarketItem memory item = marketItemIdToMarketItem[i + 1];
            address addressPropertyValue = getMarketItemAddressByProperty(
                item,
                _addressProperty
            );
            if (addressPropertyValue != tx.origin) continue;
            itemCount += 1;
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemsCount; i++) {
            MarketItem memory item = marketItemIdToMarketItem[i + 1];
            address addressPropertyValue = getMarketItemAddressByProperty(
                item,
                _addressProperty
            );
            if (addressPropertyValue != tx.origin) continue;
            items[currentIndex] = item;
            currentIndex += 1;
        }
        return items;
    }
}
