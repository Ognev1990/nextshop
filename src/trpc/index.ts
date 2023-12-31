import { TRPCError } from '@trpc/server';
import { publicProcedure, router, privateProcedure } from './trpc';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/db';
import { z } from 'zod';
import { utapi } from '@/app/api/uploadthing/core';

 
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const {getUser} = getKindeServerSession();
    const user = getUser();
    if (!user?.id || !user?.email) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return {
      success: true,
    }
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const {userId} = ctx;
    return await await db.file.findMany({
      where: {
        userId,
      },
    });
  }),
  deleteFile: privateProcedure.input(z.object({
    id: z.string(),
  })).mutation(async ({ctx, input}) => {
    const {userId} = ctx;
    const file = await db.file.findFirst({
      where: {
        id: input.id,
        userId,
      },
    });

    if (!file) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }
    await db.file.delete({
      where: {
        id: input.id,
      },
    });
    await utapi.deleteFiles(file.key);

    return file;
  }),
  getFile: privateProcedure.input(z.object({
    key: z.string(),
  })).mutation(async ({ctx, input}) => {
    const {userId} = ctx;
    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId,
      },
    });

    if (!file) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }
    return file;
  }),
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;