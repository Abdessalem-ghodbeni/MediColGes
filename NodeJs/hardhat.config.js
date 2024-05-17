/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL_BLOCKCHAIN, PRIVATE_KEY_BLOCKCHAIN } = process.env;

module.exports = {
   solidity: "0.8.11",
   defaultNetwork: "volta",
   networks: {
      hardhat: {},
      volta: {
         url: API_URL_BLOCKCHAIN,
         accounts: [`0x${PRIVATE_KEY_BLOCKCHAIN}`],
         gas: 210000000,
         gasPrice: 800000000000,
      }
   },
}