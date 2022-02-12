// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

library SafeTransfers {
  function safeTransferETH(address to, uint256 value) internal {
    (bool success, bytes memory data) = to.call{value: value}(new bytes(0));

    verifyCallResult(success, data, 'SafeTransfers::safeTransferETH: ETH transfer failed');
  }

  function safeTransferFrom(
    address token,
    address from,
    address to,
    uint256 value
  ) internal {
    bytes memory payload = abi.encodeWithSignature('transferFrom(address,address,uint256)', from, to, value);
    (bool success, bytes memory data) = token.call(payload);

    verifyCallResult(success, data, 'SafeTransfers::safeTransferFrom: transferFrom failed');
  }

  function safeApprove(
    address token,
    address to,
    uint256 value
  ) internal {
    bytes memory payload = abi.encodeWithSignature('approve(address,uint256)', to, value);
    (bool success, bytes memory data) = token.call(payload);

    verifyCallResult(success, data, 'SafeTransfers::safeApprove: approve failed');
  }

  function safeTransfer(
    address token,
    address to,
    uint256 value
  ) internal {
    bytes memory payload = abi.encodeWithSignature('transfer(address,uint256)', to, value);
    (bool success, bytes memory data) = token.call(payload);

    verifyCallResult(success, data, 'SafeTransfers::safeTransfer: transfer failed');
  }

  function verifyCallResult(
    bool success,
    bytes memory returndata,
    string memory errorMessage
  ) internal pure returns (bytes memory) {
    if (success) {
      return returndata;
    } else {
      if (returndata.length > 0) {
        assembly {
          let returndata_size := mload(returndata)
          revert(add(32, returndata), returndata_size)
        }
      } else {
        revert(errorMessage);
      }
    }
  }
}
