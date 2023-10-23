import { createUploadthing, type FileRouter } from "uploadthing/next";
 
// @see https://docs.uploadthing.com/getting-started/appdir 
const f = createUploadthing();
 
export const ourFileRouter = {

  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {            
      return { };
    })
    .onUploadComplete(async ({ metadata, file }) => {
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;