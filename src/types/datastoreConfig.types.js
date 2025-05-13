// @flow
import { z } from 'zod';

export const bulkDataEntryDatastoreSchema = z.object({
    version: z.number(),
    config: z.array(
        z.object({
            programId: z.string(),
            configKey: z.string(),
            dataKey: z.string().optional(),
            pluginSource: z.string(),
            title: z.record(z.string()),
            subtitle: z.record(z.string()).optional(),
        }),
    ),
});
