import { z } from "zod";

export const messageAccept  = z.object({
    acceptMessage : z.boolean(),
});


