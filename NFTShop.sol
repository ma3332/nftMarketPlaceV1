// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import "./ERC721URIStorage.sol";
import "./Counters.sol";
import "./Ownable.sol";

// TO DO: Explain the reason/advantadge to use ERC721URIStorage instead of ERC721 itself
contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) private _creators;

    event TokenMinted(
        uint256 indexed tokenId,
        string tokenURI,
        address creators
    );

    constructor() Ownable(msg.sender) ERC721("Game1", "FIDECGAME1") {}

    // need tokenURI is a link pointed to IFPS or some other decentralized DB
    // user need to submit metadata and image to DB to check hash, then server push data to IPFS and get back the link
    // this link will be "tokenURI"
    function mintNftToken(
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _creators[newItemId] = msg.sender;
        _setTokenURI(newItemId, tokenURI);

        // Give the marketplace approval to transact NFTs between users
        emit TokenMinted(newItemId, tokenURI, msg.sender);
        return newItemId;
    }

    function mintNftBatchToken(
        string[] memory tokenURI
    ) public onlyOwner returns (uint256) {
        for (uint i = 0; i < tokenURI.length; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            _mint(msg.sender, newItemId);
            _creators[newItemId] = msg.sender;
            _setTokenURI(newItemId, tokenURI[i]);
            emit TokenMinted(newItemId, tokenURI[i], msg.sender);
        }
        return _tokenIds.current();
    }

    function exists1(
        uint256 num,
        uint256[] memory numbers1
    ) internal pure returns (bool) {
        for (uint i = 0; i < numbers1.length; i++) {
            if (numbers1[i] == num) {
                return true;
            }
        }
        return false;
    }

    function burnNftToken(uint256 tokenID) public onlyOwner {
        uint256[] memory ownedTokenIds = getTokensOwnedByMe();
        require(exists1(tokenID, ownedTokenIds), "Not Allowed");
        _burn(tokenID);
    }

    function getTokensOwnedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensOwned = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](numberOfTokensOwned);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (ownerOf(tokenId) != msg.sender) continue;
            ownedTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return ownedTokenIds;
    }

    function getTokenCreatorById(
        uint256 tokenId
    ) public view returns (address) {
        return _creators[tokenId];
    }

    function getTokensCreatedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _tokenIds.current();
        uint256 numberOfTokensCreated = 0;

        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            numberOfTokensCreated += 1;
        }

        uint256[] memory createdTokenIds = new uint256[](numberOfTokensCreated);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            uint256 tokenId = i + 1;
            if (_creators[tokenId] != msg.sender) continue;
            createdTokenIds[currentIndex] = tokenId;
            currentIndex += 1;
        }

        return createdTokenIds;
    }
}
