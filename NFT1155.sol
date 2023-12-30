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

    address public marketplaceProxy;

    event MetadataUpdate(uint256 _tokenId);

    constructor(
        string memory _uri,
        address _marketplaceProxy
    ) ERC1155(_uri) Ownable(msg.sender) {
        marketplaceProxy = _marketplaceProxy;
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
        uint256 value,
        bytes memory data,
        string memory tokenURI
    ) public {
        uint256 id = _tokenIds.current();
        _mint(msg.sender, id, value, data);
        _setTokenURI(id, tokenURI);
        setApprovalForAll(marketplaceProxy, true);
    }

    function mint1155BatchToken(
        uint256[] memory values,
        bytes memory data,
        string[] memory tokenURI
    ) public {
        require(values.length == tokenURI.length, "not the same length");
        uint256[] memory ids;
        for (uint i = 0; i < tokenURI.length; i++) {
            uint256 newItemId = _tokenIds.current();
            ids[i] = newItemId;
            _setTokenURI(newItemId, tokenURI[i]);
            _tokenIds.increment();
        }
        _mintBatch(msg.sender, ids, values, data);
        setApprovalForAll(marketplaceProxy, true);
    }

    function burn1155Token(uint256 id, uint256 value) public {
        _burn(msg.sender, id, value);
    }

    function burnBatch1155Token(
        uint256[] memory ids,
        uint256[] memory values
    ) public {
        _burnBatch(msg.sender, ids, values);
    }
}
