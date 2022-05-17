import { handler } from "./Create";

const event = {
  body: {
    location: 'Paris',
    world: 'Hello'
  }
}
handler(event as any, {} as any).then(response => console.log(response))