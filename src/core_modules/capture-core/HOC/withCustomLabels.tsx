import * as React from 'react';
import { useTermLabel, type TermRequest } from '../metaData';

export const withCustomLabels =
    (requests: ReadonlyArray<TermRequest>) =>
        (InnerComponent: React.ComponentType<any>) =>
            (props: any) => {
                const labels = useTermLabel(requests, { stageId: props.stageId });
                return <InnerComponent {...props} {...labels} />;
            };
