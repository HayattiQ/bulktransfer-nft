import { task } from "hardhat/config";
import { ethers } from "ethers";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { BulkSend } from "../typechain";
import type { HardhatRuntimeEnvironment } from "hardhat/types";

task("bulksend", "BulkSend contract run")
  .addParam("tokenAddress", "send token address")
  .setAction(async function (args, hre) {
    const contract: BulkSend = (await getContract(hre)) as BulkSend;
    const transactionResponse = await contract.bulksend(args.tokenAddress);
    console.log(`sentMultiple. hash: ${transactionResponse}`);
  });

function getProvider(hre: HardhatRuntimeEnvironment) {
  // @ts-ignore
  const provider = new ethers.providers.JsonRpcProvider(hre.network.config.url);
  return provider;
}

// Helper method for fetching a contract instance at a given address
async function getContract(hre: HardhatRuntimeEnvironment) {
  const account = getAccount(hre.network.name);
  const signer = getProvider(hre).getSigner(await account.getAddress());
  return getContractAt(
    hre,
    "BulkSend",
    process.env.NFT_CONTRACT_ADDRESS_LOCALHOST || "",
    signer
  );
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
