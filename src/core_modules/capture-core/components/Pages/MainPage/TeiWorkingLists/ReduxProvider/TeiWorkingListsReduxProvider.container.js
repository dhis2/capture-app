// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { TeiWorkingListsSetup } from '../Setup';
import { useWorkingListsCommonStateManagement } from '../../WorkingListsCommon';
import { useTrackerProgram } from '../../../../../hooks/useTrackerProgram';
import { TEI_WORKING_LISTS_TYPE } from '../constants';
import type { Props } from './teiWorkingListsReduxProvider.types';

export const TeiWorkingListsReduxProvider = ({ storeId }: Props) => {
    const programId = useSelector(({ currentSelections }) => currentSelections.programId);
    const program = useTrackerProgram(programId);

    const commonStateManagementProps = useWorkingListsCommonStateManagement(storeId, TEI_WORKING_LISTS_TYPE, program);

    // ------ TEMPORARY DUMMY DATA TO BYPASS LOADING IN THIS PR!!! ------
    const loadedContext = {
        programIdTemplates: programId,
        programIdView: programId,
        orgUnitId: commonStateManagementProps.orgUnitId,
        categories: commonStateManagementProps.categories,
    };

    const currentTemplate = {
        id: 'default',
        isDefault: true,
        name: 'default',
        access: {
            update: false,
            delete: false,
            write: false,
            manage: false,
        },
    };

    const dummyData = {
        currentPage: 1,
        currentTemplate,
        rowsPerPage: 15,
        templates: [currentTemplate],
        loadedContext,
        onSelectListRow: () => {},
        stickyFilters: {
            filtersWithValueOnInit: {},
            userSelectedFilters: {},
        },
        lastTransaction: undefined,
        lastTransactionOnListDataRefresh: undefined,
        listDataRefreshTimestamp: undefined,
        initialViewConfig: undefined,
        records: undefined,
        recordsOrder: undefined,
    };
    // ---------------------------------------------------------------

    return (
        // $FlowFixMe Yep, dealing with this later
        <TeiWorkingListsSetup
            {...commonStateManagementProps}
            {...dummyData}
            program={program}
        />
    );
};
