// @flow
import React from 'react';
import { Modal } from '@dhis2/ui';
import { useChangelogData } from '../common/hooks';
import { ChangelogComponent } from './Changelog.component';
import { CHANGELOG_ENTITY_TYPES } from './index';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import type { ItemDefinitions } from './Changelog.types';

type Props = {
    entityId: string,
    entityType: $Values<typeof CHANGELOG_ENTITY_TYPES>,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
    dataItemDefinitions: ItemDefinitions,
    metadataItemDefinitions: ItemDefinitions,
}

export const Changelog = ({
    entityId,
    entityType,
    isOpen,
    setIsOpen,
    dataItemDefinitions,
    metadataItemDefinitions,
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
        dataItemDefinitions,
        metadataItemDefinitions,
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
