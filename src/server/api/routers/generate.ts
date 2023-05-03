import { Configuration, OpenAIApi } from "openai";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import { TRPCError } from "@trpc/server";
import { env } from "process";
import { z } from "zod";

const configuration = new Configuration ({
  apiKey: env.DALLE_API_KEY,
})

const openai = new OpenAIApi(configuration)

async function generateIcon(prompt: string): Promise<string | undefined> { //This will take an array of string urls eventually
  if(env.DALLE_MOCK === "true") {
    // return "https://images.pexels.com/photos/381739/pexels-photo-381739.jpeg?cs=srgb&dl=pexels-sevenstorm-juhaszimrus-381739.jpg&fm=jpg"
    return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-TXpy72gAPZZFIFZaLpz0qsgk/user-eZCRFpREPtVfgUMbI9GcnX8T/img-vMsxwvGowvCSfou5dwhLlJOJ.png?st=2023-05-03T00%3A28%3A11Z&se=2023-05-03T02%3A28%3A11Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-05-02T19%3A51%3A51Z&ske=2023-05-03T19%3A51%3A51Z&sks=b&skv=2021-08-06&sig=9nWtXRup6L1D9y01jVLfjUTmHf46PXr2Ap5vWVsWokk%3D"
  } else {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "1024x1024",
    });

    return response.data.data[0]?.url;
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ctx, input}) => {
      console.log("Mutation prompt: ", input.prompt)
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          credits: {
            gte: 1,
          }
        },
        data: {
          credits: {
            decrement: 1,
          }
        }
      })

      if(count <= 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: "You do not have enough credits"
        })
      }

      const responseUrl =  await generateIcon(input.prompt)

      return {
        imageUrl: responseUrl,
      }
    })
});
