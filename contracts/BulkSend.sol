//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract BulkSend is Ownable {
    Receiver[] private receivers;

    struct Receiver {
     address addr;
     uint256 tokenID;
    }

    function clearList() public onlyOwner {
        delete receivers;
    }

    function updateMultiList(address[] memory addressList, uint256[] memory tokenList) public onlyOwner returns (uint256)  {
        clearList();
        require(addressList.length == tokenList.length, "two list length need same");
        for (uint256 i = 0; i < addressList.length; i++) {
            Receiver memory rec;
            rec.addr = addressList[i];
            rec.tokenID = tokenList[i];
            receivers.push(rec);
        }
        return receivers.length;
    }

    function getCount() public view returns (uint256) {
        return receivers.length;
    }


    function bulksend(address tokenAddress) public {
        require(receivers.length >= 1, "Need set receiver");
        for (uint256 i = 0; i < receivers.length; i++) {
            ERC721(tokenAddress).safeTransferFrom(msg.sender, receivers[i].addr, receivers[i].tokenID);
        }
    }
}
