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

    address public marketplaceProxy;

    event MetadataUpdate(uint256 _tokenId);

    constructor(
        string memory _uri,
        string memory _name,
        string memory _symbol,
        address _marketplaceProxy
    ) ERC1155(_uri) Ownable(msg.sender) {
        marketplaceProxy = _marketplaceProxy;
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

    function setUpMarketProxy(address _proxy) public onlyOwner {
        marketplaceProxy = _proxy;
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

    function mint1155Token(
        uint256 amtToken,
        bytes memory data,
        string memory tokenURI
    ) public {
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id, amtToken, data);
        _setTokenURI(id, tokenURI);
        setApprovalForAll(marketplaceProxy, true);
    }

    function mint1155BatchToken(
        uint256[] memory amtTokens,
        bytes memory data,
        string[] memory tokenURI
    ) public {
        require(amtTokens.length == tokenURI.length, "not the same length");
        uint256[] memory ids;
        for (uint i = 0; i < tokenURI.length; i++) {
            uint256 newItemId = _tokenIds.current();
            ids[i] = newItemId;
            _setTokenURI(newItemId, tokenURI[i]);
            _tokenIds.increment();
        }
        _mintBatch(msg.sender, ids, amtTokens, data);
        setApprovalForAll(marketplaceProxy, true);
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
