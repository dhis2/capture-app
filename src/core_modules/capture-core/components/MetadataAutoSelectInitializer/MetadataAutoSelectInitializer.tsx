import React, { type ReactNode } from 'react';
import { useMetadataAutoSelect } from './hooks/useMetadataAutoSelect';
import { LoadingMaskForPage } from '../LoadingMasks';

type Props = {
    children: ReactNode;
};

export const MetadataAutoSelectInitializer = ({ children }: Props) => {
    const { isReady } = useMetadataAutoSelect();

    if (!isReady) {
        return (
            <LoadingMaskForPage />
        );
    }

    return children;
};
