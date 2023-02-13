import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config({ path: __dirname + '/.env' })

const key: string | undefined = process.env.PRIVATE_KEY;
const url: string | undefined = process.env.URL;
if (!key) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}
if (!url) {
  throw new Error("Please set your URL in a .env file");
}

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks:{
    goerli: {
      url,
      accounts:[`0x${key}`]
    },
  }

};

export default config;
