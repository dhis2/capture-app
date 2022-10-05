// @flow
import { getContext } from '../context';
import type { StalePrograms } from '../storeLoaders.types';

export const confirmLoadingSequence = async (stalePrograms: StalePrograms) => {
    const { storageController, storeNames } = getContext();
    await Promise.all(
        stalePrograms.map(async ({ id, version }) => {
            const program = await storageController.get(storeNames.PROGRAMS, id);
            const updatedProgram = {
                ...program,
                version,
            };
            await storageController.set(storeNames.PROGRAMS, updatedProgram);
        }),
    );
};
