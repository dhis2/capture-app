import React from 'react';
import { IconArrowRight16, IconArrowLeft16, type IconProps } from '@dhis2/ui';
import { systemSettingsStore } from '../../metaDataMemoryStores/systemSettings/systemSettings.store';

type Props = IconProps & { reverse?: boolean };

export const DirectionalArrow = ({ reverse, ...props }: Props): React.ReactElement => {
    const rtl = systemSettingsStore.get()?.dir === 'rtl';
    const pointLeft = reverse ? !rtl : rtl;

    return pointLeft ? <IconArrowLeft16 {...props} /> : <IconArrowRight16 {...props} />;
};
