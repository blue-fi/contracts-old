// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ERC721TokenReceiver {
  function onERC721Received(
    address operator,
    address from,
    uint256 id,
    bytes calldata data
  ) external returns (bytes4);
}
