const axios = require('axios');
const Web3 = require('web3');
const web3 = new Web3();
const API_BASE = 'https://testnet.mirrornode.hedera.com/api/v1';
const GreeterFactory = require('../abis/greeterFactory.json');
const Greeter = require('../abis/greeter.json');


const blockHash = '0x6931cf0e25eeb9e09970446dc8511bad54306d1548dfdeb2f860069b0e82aebc89fc2aefa27e1d6b442d74728638a6f3';



const events = [
    ...GreeterFactory.filter(entry => entry.type === 'event'),
    ...Greeter.filter(entry => entry.type === 'event'),
];

(async () => {
    const blockDataURL = `${API_BASE}/blocks/${blockHash}`;
    const {data: blockData} = await axios.get(blockDataURL);
    console.log(blockDataURL);
    const { from, to } = blockData.timestamp;

    const contractsDataURL = `${API_BASE}/contracts/results?timestamp=gte:${from}&timestamp=lte:${to}`;
    console.log(contractsDataURL);
    const {data: contractsData} = await axios.get(contractsDataURL);

    for (const {address, timestamp} of contractsData.results) {
        const contractDataURL = `${API_BASE}/contracts/${address}/results/${timestamp}`;
        const {data: contractData} = await axios.get(contractDataURL);
        console.log(contractDataURL);
        for (const log of contractData.logs) {
            const event = findEvent(log.topics[0]);
            if (!event) continue;

            console.log(`Event: ${event.name}`);
            const result = web3.eth.abi.decodeLog(event.inputs, log.data, log.topics);
            console.log(result);
        }
    }

})();

function findEvent(topic0) {
    const encodedTopicSignature = topic0.slice(0, 10);
    for (const event of events) {
        const eventSignature = `${event.name}(${event.inputs.map(i => i.internalType).join(',')})`;
        const encodedEventSignature = web3.eth.abi.encodeFunctionSignature(eventSignature);
        if (encodedEventSignature === encodedTopicSignature) {
            return event;
        }
    }
}