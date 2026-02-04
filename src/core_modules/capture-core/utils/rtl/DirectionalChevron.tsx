import React from 'react';
import {
    IconChevronLeft16,
    IconChevronRight16,
    IconChevronLeft24,
    IconChevronRight24,
    type IconProps,
} from '@dhis2/ui';
import { systemSettingsStore } from '../../metaDataMemoryStores/systemSettings/systemSettings.store';

type ChevronSize = 16 | 24;
type ChevronDirection = 'forward' | 'back';

export type DirectionalChevronProps = {
    size?: ChevronSize;
    direction?: ChevronDirection;
} & IconProps;

export const DirectionalChevron = ({
    size = 16,
    direction = 'forward',
    ...iconProps
}: DirectionalChevronProps): React.ReactElement => {
    const rtl = systemSettingsStore.get()?.dir === 'rtl';

    const pointDirection =
        (direction === 'forward' && !rtl) || (direction === 'back' && rtl);

    const RightIcon = size === 24 ? IconChevronRight24 : IconChevronRight16;
    const LeftIcon = size === 24 ? IconChevronLeft24 : IconChevronLeft16;
    const ChevronIcon = pointDirection ? RightIcon : LeftIcon;

    return <ChevronIcon {...iconProps} />;
};
