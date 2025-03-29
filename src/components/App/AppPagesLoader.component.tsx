import React, { useState } from 'react';
import { LoadingMaskElementCenter } from 'capture-core/components/LoadingMasks';
import { AppPages } from './AppPages.component';

export const AppPagesLoader = (): JSX.Element => {
    return (
        <>
            <AppPages />
        </>
    );
};
