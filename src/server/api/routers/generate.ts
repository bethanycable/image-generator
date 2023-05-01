import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { z } from "zod";

export const generateRouter = createTRPCRouter({
  generateIcon: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    ).mutation(({ctx, input}) => {
    console.log("We are in generateRouter", input.prompt)
    return {
      message: "success"
    }
  })
});
