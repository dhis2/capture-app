import React from 'react';
import { IconChevronLeft16, IconChevronRight16, IconChevronLeft24, IconChevronRight24, type IconProps } from '@dhis2/ui';
import { isLangRtl } from './isLangRtl';

type ChevronSize = 16 | 24;

type RtlChevronProps = {
    size?: ChevronSize;
} & IconProps;

export function RtlChevron(props: RtlChevronProps): React.ReactElement {
    const { size = 16, ...iconProps } = props;
    const isRtl = isLangRtl();

    let ChevronIcon;
    if (size === 24) {
        ChevronIcon = isRtl ? IconChevronLeft24 : IconChevronRight24;
    } else {
        ChevronIcon = isRtl ? IconChevronLeft16 : IconChevronRight16;
    }

    return React.createElement(ChevronIcon, iconProps);
}
