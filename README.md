# Subgraph Templated

This is an example subgraph intended to showcase dynamic data sources on Hedera.


## Local Configuration

1) Create a copy of `.env.example` and rename it to `.env`. Provide your testnet account id and private key for contract interaction scripts.
2) Run a graph-node locally with the admin port exposed at http://localhost:8020
3) Install dependencies
    ```
    yarn install
    ```
4) Compile local contracts
    ```
    yarn run compile
    ```

## Deploy Contracts

1) Run `scripts/1-deployGreeterFactory.js`
2) Paste deployment address from step 1 into `subgraph.yaml` > `dataSources[0]` > `source` > `address`
3) Paste deployment address from step 1 into `factoryAddress` variable in `scripts/2-createGreeter.js`
4) Run `scripts/2-createGreeter.js`
5) Paste greeter id from step 4 into `greeterId` variable in `scripts/3-greet.js`
6) Run `scripts/3-greet.js`


## Begin Indexing

1) Build subgraph
    ```
    yarn run codegen && yarn run build
    ```
2) Create subgraph
    ```
    yarn run create-local
    ```
3) Deploy subgraph
    ```
    yarn run deploy-local
    ```

## What to look for

GraphQL Endpoint: http://localhost:8000/subgraphs/name/templated/graphql
```
{
  greeters {
    id
  }
  greetings(orderBy: timestamp, first: 20) {
    message
    greeter {
      id
    }
  }
}
```

You'll notice that the subgraph indexes the greeters fine. Try running `scripts/3-greet.js` after indexing has begun
and notice that entities are not updated. 