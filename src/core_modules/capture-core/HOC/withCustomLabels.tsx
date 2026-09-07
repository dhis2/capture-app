import * as React from 'react';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { useTermLabel, type TermRequest } from '../metaData';

export const withCustomLabels =
    (requests: ReadonlyArray<TermRequest>) =>
        (InnerComponent: React.ComponentType<any>) =>
            (props: any) => {
                const { programId, stageId } = props;
                const labels = useTermLabel(requests, { programId, stageId });
                const capitalized = Object.fromEntries(
                    Object.entries(labels).map(([key, value]) => [key, capitalizeFirstLetter(value)]),
                );
                return <InnerComponent {...props} {...capitalized} />;
            };
