import * as React from 'react';
import { capitalizeFirstLetter } from 'capture-core-utils/string/capitalizeFirstLetter';
import { useTermLabel } from '../metaData';
import type { CustomLabelKey } from '../metaData/helpers/customLabels';

type LabelSpec = {
    key: CustomLabelKey;
    plural?: boolean;
};

type LabelSpecs = Record<string, LabelSpec>;

type InjectedLabels<S extends LabelSpecs> = { [K in keyof S]: string };

export const withCustomLabels =
    <S extends LabelSpecs>(specs: S) => {
        const entries = Object.entries(specs);
        return <P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P & InjectedLabels<S>>) =>
            (props: P & { programId?: string; stageId?: string }) => {
                const { programId, stageId } = props;
                const labels = Object.fromEntries(
                    entries.map(([propName, { key, plural }]) => [
                        propName,
                        capitalizeFirstLetter(useTermLabel(key, { programId, stageId, plural })),
                    ]),
                ) as InjectedLabels<S>;
                return React.createElement(WrappedComponent, { ...props, ...labels });
            };
    };
