// @flow
// $FlowFixMe
import { shallowEqual, useSelector } from 'react-redux';
import { programCollection } from '../metaDataMemoryStores';
import { useLocationQuery } from '../utils/routing';

type MissingCategories = {| missingCategories: any, programSelectionIsIncomplete: boolean |}

export const useMissingCategoriesInProgramSelection = (): MissingCategories => {
    const { programId: queryProgramId } = useLocationQuery();
    const { categoriesMeta = {}, programId, complete } = useSelector(
        ({ currentSelections }) => ({
            categoriesMeta: currentSelections.categoriesMeta,
            programId: currentSelections.programId,
            complete: currentSelections.complete,
        }),
        shallowEqual,
    );
    const program = queryProgramId || programId;

    const selectedProgram = program && programCollection.get(program);
    if (selectedProgram && selectedProgram.categoryCombination && !complete) {
        const programCategories = Array.from(selectedProgram.categoryCombination.categories.values())
            .map(({ id, name }) => ({ id, name }));

        return {
            missingCategories:
                programCategories.filter(({ id }) =>
                    !(Object.keys(categoriesMeta)
                        .some((programCategoryId => programCategoryId === id))),
                ),
            programSelectionIsIncomplete: true,
        };
    }
    return { missingCategories: [], programSelectionIsIncomplete: false };
};

