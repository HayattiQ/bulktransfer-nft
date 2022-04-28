import { task } from "hardhat/config";
import { ethers } from "ethers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { BulkSend } from "../typechain";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import fs from "fs";
import { parse } from "csv-parse/sync"; // requiring sync module

task("receivers", "Update Receivers")
  .addOptionalParam("filename", "CSV file name", "./scripts/receivers.csv")
  .setAction(async function (args, hre) {
    const addresses: string[] = [];
    const tokenIDs: number[] = [];

    const data = fs.readFileSync(args.filename);

    const resArray = parse(data);
    for (const res of resArray) {
      tokenIDs.push(res[0]);
      addresses.push(res[1]);
    }

    const contract: BulkSend = (await getContract(hre)) as BulkSend;
    const res = await contract.updateMultiList(addresses, tokenIDs);
    console.log(`multilist update. ${res.hash}`);
    const count = await contract.getCount();
    console.log(`current receivers count. ${count}`);
  });

task("bulksend", "Update Receivers")
  .addParam("address", "send token address")
  .setAction(async function (args, hre) {
    const contract: BulkSend = (await getContract(hre)) as BulkSend;
    const transactionResponse = await contract.bulksend(args.address);
    console.log(`Transaction complete. hash: ${transactionResponse.hash}`);
    console.log(transactionResponse);
  });

function getProvider(hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const provider = new ethers.providers.JsonRpcProvider(hre.network.config.url);
  return provider;
}

// Helper method for fetching a contract instance at a given address
async function getContract(hre: HardhatRuntimeEnvironment) {
  const account = getAccount(hre.network.name);
  const contractAddress =
    process.env["NFT_CONTRACT_ADDRESS_" + hre.network.name.toUpperCase()];
  if (!contractAddress) {
    throw Error(
      "contract address env is null. network = " +
        hre.network.name.toUpperCase()
    );
  }
  const signer = getProvider(hre).getSigner(await account.getAddress());
  return getContractAt(hre, "BulkSend", contractAddress, signer);
}

export function getAccount(network: string): ethers.Wallet {
  if (network === "localhost") {
    return ethers.Wallet.fromMnemonic(
      "test test test test test test test test test test test junk"
    );
  } else {
    return new ethers.Wallet(process.env.PRIVATE_KEY || "");
  }
}
