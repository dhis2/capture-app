// @flow
import * as React from 'react';

import { MultiSelectionsBoxes } from '../internal/SelectionBoxes/MultiSelectionsBoxes/MultiSelectionsBoxes.component';
import { SingleSelectionBoxes } from '../internal/SelectionBoxes/SingleSelectionBoxes/SingleSelectionBoxes.component';

import { orientations } from '../constants/orientations.const';

type Props = {
    multiSelect?: ?boolean,
};

export const SelectionBoxes = (props: Props) => {
    const { multiSelect, ...passOnProps } = props;

    if (multiSelect) {
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <MultiSelectionsBoxes
                orientation={orientations.HORIZONTAL}
                {...passOnProps}
            />
        );
    }

    return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <SingleSelectionBoxes
            orientation={orientations.HORIZONTAL}
            {...passOnProps}
        />
    );
};
