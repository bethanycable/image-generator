import { Configuration, OpenAIApi } from "openai";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import AWS from "aws-sdk"
import { Image } from 'next/image';
import { TRPCError } from "@trpc/server";
import { b64Image } from "~/data/b64image";
import { env } from "process";
import { z } from "zod";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});


const configuration = new Configuration ({
  apiKey: env.DALLE_API_KEY,
})

const openai = new OpenAIApi(configuration)

async function generateIcon(prompt: string): Promise<string | undefined> { //This will take an array of string urls eventually
  if(env.DALLE_MOCK === "true") {
    // return "https://images.pexels.com/photos/381739/pexels-photo-381739.jpeg?cs=srgb&dl=pexels-sevenstorm-juhaszimrus-381739.jpg&fm=jpg"
    return b64Image;
  } else {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    return response.data.data[0]?.b64_json;
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

      const b64EncodedImage = await generateIcon(input.prompt)

      const image = await ctx.prisma.image.create({
        data: {
          prompt: input.prompt,
          userId: ctx.session.user.id,
        },
      })

      await s3.putObject({
        Bucket: 'bookcovergenerator',
        Body: Buffer.from(b64EncodedImage!, "base64"),
        Key: image.id, 

        ContentEncoding: "base64",
        ContentType: "image/png"
      }).promise();




      return {
        imageLink: b64EncodedImage,
      }
    })
});
