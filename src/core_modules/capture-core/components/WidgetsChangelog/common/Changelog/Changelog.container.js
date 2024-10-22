// @flow
import React from 'react';
import { Modal } from '@dhis2/ui';
import { useChangelogData, useClientDataValues } from '../hooks';
import { ChangelogComponent } from './Changelog.component';
import { CHANGELOG_ENTITY_TYPES } from './index';
import { LoadingMaskElementCenter } from '../../../LoadingMasks';
import type { ItemDefinitions } from './Changelog.types';

type Props = {
    entityId: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    isOpen: boolean,
    close: () => void,
    dataItemDefinitions: ItemDefinitions,
    programId?: string,
};

export const Changelog = ({
    entityId,
    entityType,
    programId,
    isOpen,
    close,
    dataItemDefinitions,
}: Props) => {
    const {
        rawRecords,
        pager,
        isLoading: isChangelogLoading,
        page,
        pageSize,
        setPage,
        setPageSize,
        sortDirection,
        setSortDirection,
    } = useChangelogData({
        entityId,
        entityType,
        programId,
    });

    const {
        processedRecords,
        isLoading: isProcessingLoading,
    } = useClientDataValues({
        rawRecords,
        dataItemDefinitions,
        entityId,
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
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
        />
    );
};
