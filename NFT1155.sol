// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC1155.sol";
import "./Ownable.sol";
import "./Strings.sol";
import "./Counters.sol";

contract NFT1155 is ERC1155, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;

    // Token 1155 name
    string private name;

    // Token 1155 symbol
    string private symbol;

    event MetadataUpdate(uint256 _tokenId);

    constructor(
        string memory _uri,
        string memory _name,
        string memory _symbol
    ) ERC1155(_uri) Ownable(msg.sender) {
        name = _name;
        symbol = _symbol;
    }

    function getName() public view virtual returns (string memory) {
        return name;
    }

    /**
     * @dev See {IERC721Metadata-symbol}.
     */
    function getSymbol() public view virtual returns (string memory) {
        return symbol;
    }

    function setURI(string memory newuri) public onlyOwner {
        super._setURI(newuri);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
        emit MetadataUpdate(tokenId);
    }

    function uri(
        uint256 _tokenid
    ) public view override returns (string memory) {
        return
            string(abi.encodePacked(_uri, Strings.toString(_tokenid), ".json"));
    }

    function viewCurrentTokenID() public view returns (uint256) {
        return _tokenIds.current();
    }

    function mint1155Token(uint256 amtToken, bytes memory data) public {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        string memory tokenURI = uri(id);
        _mint(msg.sender, id, amtToken, data);
        _setTokenURI(id, tokenURI);
    }

    function mint1155BatchToken(
        uint256[] memory amtTokens,
        bytes memory data
    ) public {
        uint256[] memory ids = new uint256[](amtTokens.length);
        for (uint i = 0; i < amtTokens.length; i++) {
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            ids[i] = newItemId;
            string memory tokenURI = uri(newItemId);
            _setTokenURI(newItemId, tokenURI);
        }
        _mintBatch(msg.sender, ids, amtTokens, data);
    }

    function burn1155Token(uint256 id, uint256 amtToken) public {
        _burn(msg.sender, id, amtToken);
    }

    function burnBatch1155Token(
        uint256[] memory ids,
        uint256[] memory amtTokens
    ) public {
        _burnBatch(msg.sender, ids, amtTokens);
    }
}
