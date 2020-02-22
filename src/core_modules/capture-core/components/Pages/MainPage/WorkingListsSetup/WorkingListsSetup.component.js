// @flow
import * as React from 'react';
import { getDefaultConfig } from './defaultConfiguration';
import { shouldSkipReload } from './skipReloadCalculator';
import { WorkingLists } from '../WorkingLists';

type PassOnProps = {|
    listId: string,
|};

type Props = {|
    programId: string,
    orgUnitId: string,
    categories: Object,
    lastTransaction: number,
    listContext: ?Object,
    ...PassOnProps,
|};

const WorkingListsSetup = (props: Props) => {
    const {
        programId,
        orgUnitId,
        categories,
        lastTransaction,
        listContext,
        ...passOnProps
    } = props;

    const defaultConfig = React.useMemo(() => getDefaultConfig(programId), [
        programId,
    ]);

    /*
    const {
        skipReloadTemplates,
        skipReloadData,
    } = React.useMemo(() =>
        shouldSkipReload(programId, orgUnitId, categories, lastTransaction, listContext), [     // eslint-disable-line react-hooks/exhaustive-deps
        programId,
        orgUnitId,
        categories,
        lastTransaction,
    ]);
    */

    /*
    const workingListsKey = React.useMemo(() => {
        const categoriesString = categories ? Object.keys(categories).map(key => categories[key]).join('_') : '';
        return `${programId}_${orgUnitId}_${categoriesString}`;
    }, [programId, orgUnitId, categories]);
    */

    return (
        <WorkingLists
            {...passOnProps}
            listId="eventList"
            programId={programId}
            orgUnitId={orgUnitId}
            categories={categories}
            lastTransaction={lastTransaction}
            listContext={listContext}
            defaultConfig={defaultConfig}
            onCheckSkipReload={shouldSkipReload}
        />
    );
};

export default WorkingListsSetup;
