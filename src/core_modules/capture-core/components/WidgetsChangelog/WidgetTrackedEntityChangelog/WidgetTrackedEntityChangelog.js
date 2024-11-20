// @flow
import React from 'react';
import type { ItemDefinitions } from '../common/Changelog/Changelog.types';
import { Changelog, CHANGELOG_ENTITY_TYPES } from '../common/Changelog';

type Props = {
    teiId: string,
    programId?: string,
    dataItemDefinitions: ItemDefinitions,
    isOpen: boolean,
    close: () => void,
    trackedEntityData: Object,
}

export const WidgetTrackedEntityChangelog = ({
    teiId,
    programId,
    close,
    trackedEntityData,
    ...passOnProps
}: Props) => (
    <Changelog
        {...passOnProps}
        close={close}
        entityData={trackedEntityData}
        entityId={teiId}
        programId={programId}
        entityType={CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY}
    />
);
