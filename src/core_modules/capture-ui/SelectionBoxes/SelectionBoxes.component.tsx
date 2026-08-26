import React from 'react';

import { MultiSelectionsBoxes } from '../internal/SelectionBoxes/MultiSelectionsBoxes/MultiSelectionsBoxes.component';
import { SingleSelectionBoxes } from '../internal/SelectionBoxes/SingleSelectionBoxes/SingleSelectionBoxes.component';
import { withKeyboardNavigation } from '../internal/SelectionBoxes/withKeyboardNavigation';

import { orientations } from '../constants/orientations.const';

type Props = {
    multiSelect?: boolean | null;
    [key: string]: any;
};

const SelectionBoxesPlain = (props: Props) => {
    const { multiSelect, ...passOnProps } = props;

    if (multiSelect) {
        return (
            <MultiSelectionsBoxes
                orientation={orientations.HORIZONTAL}
                {...passOnProps}
            />
        );
    }

    return (
        <SingleSelectionBoxes
            orientation={orientations.HORIZONTAL}
            {...passOnProps}
        />
    );
};

export const SelectionBoxes = withKeyboardNavigation()(SelectionBoxesPlain);
