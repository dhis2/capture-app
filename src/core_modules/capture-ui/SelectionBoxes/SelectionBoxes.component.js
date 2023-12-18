// @flow
import * as React from 'react';

import { MultiSelectionsBoxes } from '../internal/SelectionBoxes/MultiSelectionsBoxes/MultiSelectionsBoxes.component';
import { SingleSelectionBoxes } from '../internal/SelectionBoxes/SingleSelectionBoxes/SingleSelectionBoxes.component';
import { withKeyboardNavigation } from '../internal/SelectionBoxes/withKeyboardNavigation';

import { orientations } from '../constants/orientations.const';

type Props = {
    multiSelect?: ?boolean,
};

const SelectionBoxesPlain = (props: Props) => {
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

export const SelectionBoxes = withKeyboardNavigation()(SelectionBoxesPlain);
