// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './tokens/ERC721.sol';
import './utils/ownable.sol';

contract IdentDeFi is ERC721, Ownable {

  mapping(uint256 => address) private _tokenOf;

  modifier onlyOwnerOrHolder(uint256 tokenId) {
    require(msg.sender == owner || msg.sender == tokenOf(tokenId), "Only the fundraiser can execute this method.");
    _;
  }

  constructor() ERC721("IdentDeFi", "IDF") {}

  function tokenOf(uint id) public view returns (address) {
    return _tokenOf[id];
  }
}
