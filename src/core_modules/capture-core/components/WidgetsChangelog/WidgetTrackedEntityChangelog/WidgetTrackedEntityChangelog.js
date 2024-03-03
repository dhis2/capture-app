// @flow
import React from 'react';
import type { ItemDefinitions } from '../common/Changelog/Changelog.types';
import { Changelog, CHANGELOG_ENTITY_TYPES } from '../common/Changelog';

type Props = {
    teiId: string,
    programId?: string,
    dataItemDefinitions: ItemDefinitions,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
}

export const WidgetTrackedEntityChangelog = ({
    teiId,
    programId,
    ...passOnProps
}: Props) => (
    <Changelog
        {...passOnProps}
        entityId={teiId}
        programId={programId}
        entityType={CHANGELOG_ENTITY_TYPES.TRACKED_ENTITY}
    />
);
