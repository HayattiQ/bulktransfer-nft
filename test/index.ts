import { Signer } from "ethers";
import { ethers } from "hardhat";
import { BulkSend, MockERC721 } from "../typechain";
import { expect } from "chai";

describe("BulkSend test", function () {
  let account0: Signer, account1: Signer, account2: Signer;
  let address0: string, address1: string, address2: string;
  let nft: MockERC721;
  let bulksend: BulkSend;

  beforeEach(async function () {
    [account0, account1, account2] = await ethers.getSigners();
    address0 = await account0.getAddress();
    address1 = await account1.getAddress();
    address2 = await account2.getAddress();

    const MockERC721 = await ethers.getContractFactory("MockERC721", account0);
    nft = await MockERC721.deploy("MockCats", "MOCK");

    const BulkSend = await ethers.getContractFactory("BulkSend");
    bulksend = await BulkSend.deploy();

    for (let i = 0; i <= 6; i++) {
      await nft.connect(account0).mint(address0);
    }
  });

  it("BulkSend test", async function () {
    await bulksend.updateMultiList([address1, address2], [1, 2]);

    await nft.connect(account0).setApprovalForAll(bulksend.address, true);
    expect(await nft.ownerOf(1)).to.equal(address0);

    await bulksend.bulksend(nft.address);
    expect(await nft.ownerOf(1)).to.equal(address1);
    expect(await nft.ownerOf(2)).to.equal(address2);
    expect(await nft.ownerOf(3)).to.equal(address0);
  });

  it("BulkSend 4 to 6", async function () {
    await bulksend.updateMultiList([address1, address2, address2], [4, 5, 6]);

    await nft.connect(account0).setApprovalForAll(bulksend.address, true);
    expect(await nft.ownerOf(4)).to.equal(address0);

    await bulksend.bulksend(nft.address);
    expect(await nft.ownerOf(1)).to.equal(address0);
    expect(await nft.ownerOf(2)).to.equal(address0);
    expect(await nft.ownerOf(3)).to.equal(address0);
    expect(await nft.ownerOf(4)).to.equal(address1);
    expect(await nft.ownerOf(5)).to.equal(address2);
    expect(await nft.ownerOf(6)).to.equal(address2);
  });
});
