import { z } from 'zod';

export const devTipFormSchema = z.object({
    title: z.string().min(5).max(255),
    htmlContent: z.string(),
    lexicalState: z.string().optional(),
});
