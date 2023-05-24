import { Configuration, OpenAIApi } from "openai";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

import AWS from "aws-sdk"
import { TRPCError } from "@trpc/server";
import { b64Image } from "~/data/b64image";
import { env } from "~/env.mjs";
import { z } from "zod";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});

const BUCKET_NAME = "bookcovergenerator"

const configuration = new Configuration ({
  apiKey: env.DALLE_API_KEY,
})

const openai = new OpenAIApi(configuration)

async function generateIcon(
  prompt: string, 
  numberOfCovers = 1
): Promise<string[]> { //This will take an array of string urls eventually
  if(env.DALLE_MOCK === "true") {
    return new Array<string>(numberOfCovers).fill(b64Image);
  } else {
    const response = await openai.createImage({
      prompt,
      n: numberOfCovers,
      size: "512x512",
      response_format: "b64_json",
    });

    return response.data.data?.map((result) => result.b64_json || "");
  }
}

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        color: z.string(),
        numberOfCovers:z.number().min(1).max(10)
      })
    )
    .mutation(async ({ctx, input}) => {
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

      const finalPrompt = `A book cover with a background color of ${input.color} with a ${input.prompt} overlay`

      const b64EncodedImages = await generateIcon(
        finalPrompt, 
        input.numberOfCovers
      )

      const createdCovers = await Promise.all(b64EncodedImages.map( async (image) => {
        const cover = await ctx.prisma.cover.create({
          data: {
            prompt: input.prompt,
            userId: ctx.session.user.id,
          },
        })

        await s3.putObject({
          Bucket: BUCKET_NAME,
          Body: Buffer.from(image, "base64"),
          Key: cover.id, 

          ContentEncoding: "base64",
          ContentType: "image/png"
        }).promise();

        return cover;
      })
    );
      

      return createdCovers.map(cover => {
        return {
          imageLink: `https://${BUCKET_NAME}.s3.amazonaws.com/${cover.id}`,
        }
      });
    })
});
