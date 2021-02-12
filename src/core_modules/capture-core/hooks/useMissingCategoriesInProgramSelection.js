// @flow
import { useSelector } from 'react-redux';
import { programCollection } from '../metaDataMemoryStores';

type MissingCategories = {| missingCategories: any, programSelectionIsIncomplete: boolean |}

export const useMissingCategoriesInProgramSelection = (): MissingCategories =>
    useSelector(({ currentSelections: { categoriesMeta = {}, programId, complete }, router: { location: { query } } }) => {
        const program = query.program || programId;

        const selectedProgram = program && programCollection.get(program);
        if (selectedProgram && selectedProgram.categoryCombination && !complete) {
            const programCategories = Array.from(selectedProgram.categoryCombination.categories.values())
                .map(({ id, name }) => ({ id, name }));

            return {
                missingCategories:
                  programCategories.filter(({ id }) =>
                      !(Object.keys(categoriesMeta).some((programCategoryId => programCategoryId === id))),
                  ),
                programSelectionIsIncomplete: true,
            };
        }
        return { missingCategories: [], programSelectionIsIncomplete: false };
    });

