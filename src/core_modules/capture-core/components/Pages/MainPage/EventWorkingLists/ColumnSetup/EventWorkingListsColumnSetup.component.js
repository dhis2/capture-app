// @flow
import React, { useMemo } from 'react';
import { getDefaultColumnConfig } from './defaultColumnConfiguration';
import { shouldSkipReload } from './skipReloadCalculator';
import { EventWorkingListsDataSourceSetup } from '../DataSourceSetup';
import {
    getEventProgramThrowIfNotFound,
} from '../../../../../metaData';
import type { GetOrdinaryColumnMetadataFn, GetMainColumnMetadataHeaderFn } from '../../WorkingLists';

type PassOnProps = {
    listId: string,
    eventsDataElementValues: Object,
    eventsMainProperties: Object,
};

type Props = {
    ...PassOnProps,
    programId: string,
};

export const EventWorkingListsColumnSetup = (props: Props) => {
    const {
        programId,
        ...passOnProps
    } = props;

    const defaultConfig = React.useMemo(() => getDefaultColumnConfig(programId), [
        programId,
    ]);

    const { getOrdinaryColumnMetadata, getMainColumnMetadataHeader }: { getOrdinaryColumnMetadata: GetOrdinaryColumnMetadataFn, getMainColumnMetadataHeader: GetMainColumnMetadataHeaderFn } =
        useMemo(() => {
            const stageForm = getEventProgramThrowIfNotFound(programId).stage.stageForm;

            return {
                getOrdinaryColumnMetadata: (columnId: string) => {
                    const { formName, optionSet } = stageForm.getElement(columnId);
                    return {
                        header: formName,
                        optionSet,
                    };
                },
                getMainColumnMetadataHeader: (columnId: string) => stageForm.getLabel(columnId) || '',
            };
        }, [
            programId,
        ]);

    return (
        <EventWorkingListsDataSourceSetup
            {...passOnProps}
            listId={props.listId}
            programId={programId}
            defaultConfig={defaultConfig}
            onCheckSkipReload={shouldSkipReload}
            getOrdinaryColumnMetadata={getOrdinaryColumnMetadata}
            getMainColumnMetadataHeader={getMainColumnMetadataHeader}
        />
    );
};
