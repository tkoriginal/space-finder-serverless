import { handler } from "./Create";

const event = {
  body: {
    location: 'Paris',
  }
}
handler(event as any, {} as any).then(response => 
  console.log(response)
  )