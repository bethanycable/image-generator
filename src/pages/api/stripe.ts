import { type NextApiRequest, type NextApiResponse } from "next";

import Stripe from "stripe";
import { buffer } from "micro";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15"
});

export const config = {
  api: {
    bodyParser: false,
  }
}

const webhook = async(req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;

    let event;
  
    try {
      event = stripe.webhooks.constructEvent(buf, sig, env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      let message = "Unkown Error";
      if(err instanceof Error) message = err.message;
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }
  
    // Handle the evente
    switch (event.type) {
      case 'checkout.session.completed':
        const completedEvent = event.data.object as {
          id: string;
          metadata: {
            userId: string,
          };
        };
        // Then define and call a function to handle the event checkout.session.completed
        await prisma.user.update({
          where: {
            id: completedEvent.metadata.userId
          },
          data: {
            credits: {
              increment: 100, 
            }
          }
        })
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    res.json({recieved: true});
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end("Method Not Allowed")
  }
}

export default webhook;
