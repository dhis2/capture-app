import * as React from 'react';
import { useTermLabel, type TermRequest } from '../metaData';

export const withCustomLabels =
    (requests: ReadonlyArray<TermRequest>) =>
        (InnerComponent: React.ComponentType<any>) =>
            (props: any) => {
                const { programId, stageId } = props;
                const labels = useTermLabel(requests, { programId, stageId });
                return <InnerComponent {...props} {...labels} />;
            };
