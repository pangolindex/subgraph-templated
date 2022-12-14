import {GreetingSet} from "../generated/templates/Greeter/Greeter";
import {Greeting} from "../generated/schema";

export function handleGreetingSet(event: GreetingSet): void {
  let greeting = new Greeting(event.transaction.hash.toHexString().concat(event.logIndex.toString()))
  greeting.greeter = event.address.toHexString()
  greeting.message = event.params.greeting
  greeting.timestamp = event.block.timestamp
  greeting.save()
}
