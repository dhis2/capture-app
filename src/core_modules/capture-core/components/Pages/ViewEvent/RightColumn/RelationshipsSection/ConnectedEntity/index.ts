import * as React from 'react';
import { TrackedEntityInstance } from './TrackedEntityInstance';

const types = {
    TRACKED_ENTITY_INSTANCE: 'TRACKED_ENTITY_INSTANCE',
};

type Props = {
    type: string,
    name: string,
    id?: string,
    orgUnitId?: string,
    linkProgramId?: string | null | undefined,
};

export const ConnectedEntity = (props: Props) => {
    const { type, ...passOnProps } = props;

    if (type !== types.TRACKED_ENTITY_INSTANCE) {
        return React.createElement(React.Fragment, null, props.name);
    }
    return React.createElement(TrackedEntityInstance, passOnProps as any);
};
