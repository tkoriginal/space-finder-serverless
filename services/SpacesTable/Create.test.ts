import { handler } from "./Create";

const event = {
  body: {
    location: 'Paris',
    world: 'Hello'
  }
}
console.log(handler(event as any, {} as any))