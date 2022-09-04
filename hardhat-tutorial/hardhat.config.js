require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

ALCHEMY_API_KEY_URL = process.env.ALCHEMY_API_KEY_URL;

RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [RINKEBY_PRIVATE_KEY],
    },
  },
};
