import * as React from 'react';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { useTermLabel } from '../metaData';
import type { TermRequest } from '../metaData/helpers/customLabels';

export const withCustomLabels =
    (requests: ReadonlyArray<TermRequest>) =>
        <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) =>
            (props: P & { programId?: string; stageId?: string }) => {
                const { programId, stageId } = props;
                const labels = useTermLabel(requests, { programId, stageId });
                const capitalized = Object.fromEntries(
                    Object.entries(labels).map(([key, value]) => [key, capitalizeFirstLetter(value)]),
                );
                const Component = WrappedComponent as React.ComponentType<Record<string, unknown>>;
                return React.createElement(Component, { ...props, ...capitalized });
            };
