const {AccountId, PrivateKey, Client, ContractCreateFlow} = require('@hashgraph/sdk');
const GreeterFactory = require('../artifacts/contracts/GreeterFactory.sol/GreeterFactory.json');
require('dotenv').config({
    path: '../.env'
});

const myAccountId = process.env.ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringED25519(process.env.PRIVATE_KEY_ED25519);
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

let tx, receipt, record;

(async () => {
    console.log(`Deploying Factory ...`);
    tx = await new ContractCreateFlow()
        .setBytecode(GreeterFactory.bytecode)
        .setGas(100000)
        .execute(client);
    receipt = await tx.getReceipt(client);
    const factoryId = receipt.contractId;
    const factoryAddress = `0x${AccountId.fromString(factoryId).toSolidityAddress()}`;
    console.log(`Deployed Factory: ${factoryId} (${factoryAddress})`);

})()
    .catch(async (e) => {
        console.error(e);
        record = await tx.getRecord(client);
        console.log(record.errorMessage);
    })
    .finally(process.exit);
