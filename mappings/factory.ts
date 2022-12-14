import {GreeterCreated} from "../generated/Factory/Factory";
import {Greeter} from "../generated/schema";
import {Greeter as GreeterTemplate} from "../generated/templates";
import {Address, log} from "@graphprotocol/graph-ts";

export function handleNewGreeter(event: GreeterCreated): void {
  let greeter = new Greeter(event.params.greeter.toHexString())
  greeter.timestamp = event.block.timestamp
  greeter.save()

  GreeterTemplate.create(Address.fromString(event.params.greeter.toHexString()))

  log.debug('Created greeter xy', []); // modify this for ease of altering the subgraph build hash

  greeter.save() // save again?
}
