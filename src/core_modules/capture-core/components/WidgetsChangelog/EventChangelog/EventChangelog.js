// @flow
import React from 'react';
import { Modal } from '@dhis2/ui';
import { useChangelogData } from '../common/hooks';
import { Changelog, CHANGELOG_ENTITY_TYPES } from '../common/Changelog';
import { LoadingMaskElementCenter } from '../../LoadingMasks';
import type { ItemDefinitions } from '../common/Changelog/Changelog.types';

type Props = {
    eventId: string,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
    dataItemDefinitions: ItemDefinitions,
    metadataItemDefinitions: ItemDefinitions,
}

export const EventChangelog = ({
    eventId,
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
        entityId: eventId,
        entityType: CHANGELOG_ENTITY_TYPES.EVENT,
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
        <Changelog
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
