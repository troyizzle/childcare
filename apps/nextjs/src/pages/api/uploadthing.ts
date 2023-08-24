import { createNextPageApiHandler } from "uploadthing/next-legacy";
import { ourFileRouter} from "@acme/api/src/uploadthing";

const handler = createNextPageApiHandler({
  router: ourFileRouter,
});

export default handler;
