const {PrivateKey, Client, ContractExecuteTransaction, ContractCreateFlow, AccountId, ContractFunctionParameters} = require('@hashgraph/sdk');
const Greeter = require('../artifacts/contracts/Greeter.sol/Greeter.json');
require('dotenv').config({
    path: '../.env'
});

const myAccountId = process.env.ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringED25519(process.env.PRIVATE_KEY_ED25519);
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

let tx, receipt, record;
let greeterId, greeterAddress;

const factoryAddress = '0x0000000000000000000000000000000002ed1a17';


(async () => {
    // Should be false to replicate a standard create2 deployment.
    // Can set to true which will deploy a contract manually (non-create2) and link as a dynamic data source
    const isManual = false;

    if (!isManual) {
        console.log(`Creating greeter via create2 ...`);
        tx = await new ContractExecuteTransaction()
            .setContractId(AccountId.fromSolidityAddress(factoryAddress).toString())
            .setGas(100000)
            .setFunction('create')
            .execute(client);
        record = await tx.getRecord(client);
        greeterAddress = `0x${record.contractFunctionResult.getAddress(0)}`;
        console.log(`Created Greeter: ${greeterAddress}`);
    } else {
        console.log(`Deploying greeter manually ...`);
        tx = await new ContractCreateFlow()
            .setBytecode(Greeter.bytecode)
            .setGas(100000)
            .execute(client);
        receipt = await tx.getReceipt(client);
        greeterId = receipt.contractId;
        greeterAddress = `0x${AccountId.fromString(greeterId).toSolidityAddress()}`;
        console.log(`Deployed Greeter: ${greeterId} (${greeterAddress})`);

        console.log(`Associating greeter with factory ...`);
        tx = await new ContractExecuteTransaction()
            .setContractId(AccountId.fromSolidityAddress(factoryAddress).toString())
            .setGas(60000)
            .setFunction('createManually',
                new ContractFunctionParameters().addAddress(greeterAddress)
            )
            .execute(client);
        record = await tx.getRecord(client);
        greeterAddress = `0x${record.contractFunctionResult.getAddress(0)}`;
        console.log(`Created Greeter: ${greeterAddress}`);
    }
})()
    .catch(async (e) => {
        console.error(e);
        record = await tx.getRecord(client);
        console.log(record.errorMessage);
    })
    .finally(process.exit);
