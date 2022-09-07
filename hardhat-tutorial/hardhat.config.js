require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.16",
  networks: {
    goerli: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};
