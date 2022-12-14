const {PrivateKey, Client, ContractCallQuery} = require('@hashgraph/sdk');
require('dotenv').config({
    path: '../.env'
});

const myAccountId = process.env.ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringED25519(process.env.PRIVATE_KEY_ED25519);
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

let tx, record;

const greeterId = '';

(async () => {
    console.log(`Greeting ...`);
    tx = await new ContractCallQuery()
        .setContractId(greeterId)
        .setGas(100000)
        .setFunction('greet')
        .execute(client);
    console.log(`Greeting of: ${tx.getString(0)}`);
})()
    .catch(async (e) => {
        console.error(e);
        record = await tx.getRecord(client);
        console.log(record.errorMessage);
    })
    .finally(process.exit);
