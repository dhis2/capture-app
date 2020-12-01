// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getTeiListData } from './getTeiListData';
import {
    initListViewSuccess,
    initListViewError,
} from '../../../../WorkingListsCommon';
import type { TeiColumnsMetaForDataFetching } from '../../../types';

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
};

type Input = {
    programId: string,
    orgUnitId: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
};

export const initTeiWorkingListsView = ({
    programId,
    orgUnitId,
    storeId,
    columnsMetaForDataFetching,
}: Input) => {
    const pageSize = 15;
    const page = 1;

    return getTeiListData({ programId, orgUnitId, pageSize, page }, [...columnsMetaForDataFetching.values()])
        .then(({ teis, request }) =>
            initListViewSuccess(storeId, {
                recordContainers: teis,
                pagingData: {
                    rowsPerPage: pageSize,
                    currentPage: page,
                },
                request,
                config: {
                    selections: {
                        programId,
                        orgUnitId,
                    },
                },
            }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
            return initListViewError(storeId, i18n.t('Working list could not be loaded'));
        });
};
