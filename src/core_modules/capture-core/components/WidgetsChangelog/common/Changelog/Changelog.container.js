// @flow
import React from 'react';
import { Modal } from '@dhis2/ui';
import { useChangelogData } from '../hooks';
import { ChangelogComponent } from './Changelog.component';
import { CHANGELOG_ENTITY_TYPES } from './index';
import { LoadingMaskElementCenter } from '../../../LoadingMasks';
import type { ItemDefinitions } from './Changelog.types';

type Props = {
    entityId: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
    dataItemDefinitions: ItemDefinitions,
    programId?: string,
}

export const Changelog = ({
    entityId,
    entityType,
    programId,
    isOpen,
    setIsOpen,
    dataItemDefinitions,
}: Props) => {
    const {
        records,
        pager,
        isLoading,
        setPage,
        setPageSize,
        sortDirection,
        setSortDirection,
    } = useChangelogData({
        entityId,
        entityType,
        programId,
        dataItemDefinitions,
    });

    if (isLoading) {
        return (
            <Modal onClose={() => setIsOpen(false)}>
                <LoadingMaskElementCenter />
            </Modal>
        );
    }

    return (
        <ChangelogComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            records={records}
            pager={pager}
            setPage={setPage}
            setPageSize={setPageSize}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
        />
    );
};
