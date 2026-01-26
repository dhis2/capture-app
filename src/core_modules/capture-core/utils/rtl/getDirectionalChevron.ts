import React from 'react';
import { IconChevronLeft16, IconChevronRight16, IconChevronLeft24, IconChevronRight24, type IconProps } from '@dhis2/ui';
import { isLangRtl } from './isLangRtl';

type ChevronSize = 16 | 24;
type ChevronDirection = 'forward' | 'back';

type DirectionalChevronProps = {
    size?: ChevronSize;
    direction?: ChevronDirection;
} & IconProps;

export function DirectionalChevron(props: DirectionalChevronProps): React.ReactElement {
    const { size = 16, direction = 'forward', ...iconProps } = props;
    const isRtl = isLangRtl();

    let ChevronIcon;
    const pointDirection =
        (direction === 'forward' && !isRtl) ||
        (direction === 'back' && isRtl);

    if (size === 24) {
        ChevronIcon = pointDirection ? IconChevronRight24 : IconChevronLeft24;
    } else {
        ChevronIcon = pointDirection ? IconChevronRight16 : IconChevronLeft16;
    }

    return React.createElement(ChevronIcon, iconProps);
}
