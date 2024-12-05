// @flow
import React from 'react';
import type { ItemDefinitions } from '../common/Changelog/Changelog.types';
import { Changelog, CHANGELOG_ENTITY_TYPES } from '../common/Changelog';

type Props = {
    eventId: string,
    eventData: Object,
    dataItemDefinitions: ItemDefinitions,
    isOpen: boolean,
    setIsOpen: (boolean | boolean => boolean) => void,
}

export const WidgetEventChangelog = ({
    eventId,
    eventData,
    setIsOpen,
    ...passOnProps
}: Props) => (
    <Changelog
        {...passOnProps}
        close={() => setIsOpen(false)}
        entityId={eventId}
        entityData={eventData}
        entityType={CHANGELOG_ENTITY_TYPES.EVENT}
    />
);
