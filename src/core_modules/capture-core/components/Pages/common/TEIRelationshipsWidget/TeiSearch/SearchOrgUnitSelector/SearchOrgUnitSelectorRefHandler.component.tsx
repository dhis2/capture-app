import * as React from 'react';
import { SearchOrgUnitSelector } from './SearchOrgUnitSelector.component';

type Props = {
    innerRef: (instance: any) => void;
    [key: string]: any;
};

export const SearchOrgUnitSelectorRefHandler = React.forwardRef<any, Omit<Props, 'innerRef'>>((props, ref) => {
    const { innerRef, ...passOnProps } = props as Props;
    const refToUse = innerRef || ref;
    
    return (
        <SearchOrgUnitSelector
            ref={refToUse}
            {...passOnProps}
        />
    );
});
