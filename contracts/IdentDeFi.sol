// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import './tokens/ERC721.sol';
import './utils/ownable.sol';
import './libraries/Strings.sol';
import "hardhat/console.sol";

contract IdentDeFi is ERC721, Ownable, ChainlinkClient {
  using Strings for address;
  using Chainlink for Chainlink.Request;

  string private path;
  address private oracle;
  bytes32 private jobId;
  uint256 private fee;

  mapping(address => uint256) private _tokens;
  mapping(bytes32 => address) private requestToMint;

  uint256 private _counter;

  modifier onlyOwnerOrHolder(uint256 tokenId) {
    require(msg.sender == owner || tokenOf(msg.sender) == tokenId, "Only the fundraiser can execute this method.");
    _;
  }

  constructor(
    string memory _path,
    address _oracle,
    bytes32 _jobId,
    uint256 _fee
  )
  ERC721("IdentDeFi", "IDF")
  {
    setPublicChainlinkToken();
    path = _path;
    oracle = _oracle;
    jobId = _jobId;
    fee = _fee;
  }

  function tokenOf(address account) public view returns (uint256) {
    return _tokens[account];
  }

  function verify(address account) public view returns (bool) {
    return tokenOf(account) > 0;
  }

  function mintVerification() payable external {
    // Put price to make request and mint NFT
    // require(msg.value >= );
    require(balanceOf(msg.sender) < 1, "Only 1 token per account");

    bytes32 requestId = requestValidation();
    requestToMint[requestId] = msg.sender;
  }

  function requestValidation() internal returns (bytes32 requestId) {
    Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
    // Set the URL to perform the GET request on
    req.add("get", string(abi.encodePacked(path, msg.sender.addressToString())));

    // Define path to value in JSON
    req.add("path", "RAW.ETH.USD.VOLUME24HOUR");

    // Sends the request
    return sendChainlinkRequestTo(oracle, req, fee);
  }

  function fulfill(bytes32 _requestId, bool _valid) public recordChainlinkFulfillment(_requestId) {
    if (_valid) {
      address account = requestToMint[_requestId];

      _counter += 1;
      _mint(account, _counter);
      _tokens[account] = _counter;
    } else {
      // Put fail event response
    }
  }
}
