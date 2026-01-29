import React from 'react';
import { IconArrowRight16, IconArrowLeft16, type IconProps } from '@dhis2/ui';
import { isLangRtl } from 'capture-ui';

export function DirectionalArrow(props: IconProps): React.ReactElement {
    const isRtl = isLangRtl();

    if (isRtl) {
        return React.createElement(IconArrowLeft16, { ...props });
    }
    return React.createElement(IconArrowRight16, { ...props });
}
