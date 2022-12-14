const {PrivateKey, Client, ContractExecuteTransaction, ContractFunctionParameters} = require('@hashgraph/sdk');
require('dotenv').config({
    path: '../.env'
});

const myAccountId = process.env.ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringED25519(process.env.PRIVATE_KEY_ED25519);
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

let tx, record;

const greeterId = '0.0.49093175';
const messages = [
    'first message',
    // 'second message',
    // 'third message',
    // 'fourth message',
    // 'fifth message',
    // 'sixth message',
    // 'seventh message',
    // 'eighth message',
    // 'ninth message',
    // 'tenth message',
    // 'eleventh message',
    // 'twelfth message',
];

(async () => {
    for (const message of messages) {
        console.log(`Greeting with ${message} ...`);
        tx = await new ContractExecuteTransaction()
            .setContractId(greeterId)
            .setGas(100000)
            .setFunction('setGreeting',
                new ContractFunctionParameters()
                    .addString(message)
            )
            .execute(client);
        console.log(`Greeted!`);
    }
})()
    .catch(async (e) => {
        console.error(e);
        record = await tx.getRecord(client);
        console.log(record.errorMessage);
    })
    .finally(process.exit);
