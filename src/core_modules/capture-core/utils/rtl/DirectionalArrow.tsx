import React from 'react';
import { IconArrowRight16, IconArrowLeft16, type IconProps } from '@dhis2/ui';
import { systemSettingsStore } from '../../metaDataMemoryStores/systemSettings/systemSettings.store';

export const DirectionalArrow = (props: IconProps): React.ReactElement => {
    const rtl = systemSettingsStore.get()?.dir === 'rtl';

    if (rtl) {
        return <IconArrowLeft16 {...props} />;
    }
    return <IconArrowRight16 {...props} />;
};
