// @flow
import * as React from 'react';
import { useMetadataAutoSelect } from './hooks/useMetadataAutoSelect';
import { LoadingMaskForPage } from '../LoadingMasks';

type Props = {|
    children: React.Node,
|}

export const MetadataAutoSelectInitializer = ({ children }: Props) => {
    const { isReady } = useMetadataAutoSelect();

    if (!isReady) {
        return (
            <LoadingMaskForPage />
        );
    }

    return children;
};
