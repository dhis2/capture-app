// @flow
import React from 'react';
import { Modal } from '@dhis2/ui';
import { useChangelogData, useListDataValues } from '../hooks';
import { ChangelogComponent } from './Changelog.component';
import { CHANGELOG_ENTITY_TYPES } from './Changelog.constants';
import { LoadingMaskElementCenter } from '../../../LoadingMasks';
import type { ItemDefinitions } from './Changelog.types';

type Props = {
    entityId: string,
    entityData: Object,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    isOpen: boolean,
    close: () => void,
    dataItemDefinitions: ItemDefinitions,
    programId?: string,
};

export const Changelog = ({
    entityId,
    entityData,
    entityType,
    programId,
    isOpen,
    close,
    dataItemDefinitions,
}: Props) => {
    console.log('Changelog', entityData, dataItemDefinitions);
    const {
        rawRecords,
        pager,
        isLoading: isChangelogLoading,
        page,
        pageSize,
        setPage,
        setPageSize,
        columnToSortBy,
        setColumnToSortBy,
        sortDirection,
        setSortDirection,
        filterValue,
        setFilterValue,
        attributeToFilterBy,
        setAttributeToFilterBy,
    } = useChangelogData({ entityId, entityType, programId });

    const {
        processedRecords,
        isLoading: isProcessingLoading,
    } = useListDataValues({
        rawRecords,
        dataItemDefinitions,
        entityId,
        entityData,
        entityType,
        programId,
        sortDirection,
        page,
        pageSize,
    });

    if (isChangelogLoading || isProcessingLoading) {
        return (
            <Modal onClose={close}>
                <LoadingMaskElementCenter />
            </Modal>
        );
    }

    return (
        <ChangelogComponent
            isOpen={isOpen}
            close={close}
            records={processedRecords}
            pager={pager}
            setPage={setPage}
            setPageSize={setPageSize}
            entityData={entityData}
            entityType={entityType}
            columnToSortBy={columnToSortBy}
            setColumnToSortBy={setColumnToSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            attributeToFilterBy={attributeToFilterBy}
            setAttributeToFilterBy={setAttributeToFilterBy}
            dataItemDefinitions={dataItemDefinitions}
        />
    );
};
