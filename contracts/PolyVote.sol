// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PolyVote is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    mapping(address => bool) internal isWhiteListed;

    constructor() ERC721("PolyVote", "PVT") {
        _tokenIdCounter.increment();
    }

    // add remove whitelist
    function addWhiteList(address _newUser) external onlyOwner {
        isWhiteListed[_newUser] = true;
    }

    function removeWhiteList(address _newUser) external onlyOwner {
        isWhiteListed[_newUser] = false;
    }

    //check status
    function check() external view returns (string memory) {
        if (isWhiteListed[msg.sender] == true) {
            return "you are on whitelist";
        } else {
            return "you are not whitelisted";
        }
    }

    Counters.Counter private _tokenIdCounter;
    uint256 maxSupply = 10000;

    function safeMint(address to, string memory uri) public {
        require(
            isWhiteListed[msg.sender] == true,
            "User not authorized to mint"
        );
        require(
            _tokenIdCounter.current() <= maxSupply,
            "I'm sorry we reached the cap"
        );
        require(balanceOf(msg.sender) == 0, "Max mint per wallet reached");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
