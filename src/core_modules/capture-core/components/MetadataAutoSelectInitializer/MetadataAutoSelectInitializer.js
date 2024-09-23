// @flow
import * as React from 'react';
import { useOrgUnitsForAutoSelect } from '../../dataQueries';
import { LoadingMaskForPage } from '../LoadingMasks';

type Props = {|
    children: React.Node,
|}

export const MetadataAutoSelectInitializer = ({ children }: Props) => {
    const { isLoading } = useOrgUnitsForAutoSelect();

    if (isLoading) {
        return (
            <LoadingMaskForPage />
        );
    }

    return children;
};
