// @flow

import React from 'react';
import { ErrorHandler, LoadingHandler } from 'capture-ui';
import { useSearchGroups } from './useSearchGroups';
import type { Props } from './searchFormSection.types';

const NextComp = ({ programId }) => (
    <div>
        {programId}
    </div>
);

export const SearchFormSection = ({ programId, getSearchGroups, getSearchGroupsAsync }: Props) => {
    const { searchGroups, loading, failed } = useSearchGroups(getSearchGroups, getSearchGroupsAsync, programId);

    return (
        <ErrorHandler
            error={failed ? 'Search forms could not be loaded. Please try again later' : undefined}
        >
            <LoadingHandler
                loading={loading}
            >
                <NextComp
                    programId={programId}
                    data={searchGroups}
                />
            </LoadingHandler>
        </ErrorHandler>
    );
};
