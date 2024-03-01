// @flow
import React from 'react';
import type { ItemDefinitions } from '../common/Changelog/Changelog.types';
import { Changelog, CHANGELOG_ENTITY_TYPES } from '../common/Changelog';

type Props = {
    eventId: string,
    dataItemDefinitions: ItemDefinitions,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
}

export const WidgetEventChangelog = ({
    eventId,
    ...passOnProps
}: Props) => (
    <Changelog
        {...passOnProps}
        entityId={eventId}
        entityType={CHANGELOG_ENTITY_TYPES.EVENT}
    />
);
