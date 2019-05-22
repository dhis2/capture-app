// @flow
import * as React from 'react';

import MultiSelectBoxes from '../internal/SelectionBoxes/MultiSelectionsBoxes/MultiSelectionsBoxes.component';
import SingleSelectBoxes from '../internal/SelectionBoxes/SingleSelectionBoxes/SingleSelectionBoxes.component';

import orientations from '../constants/orientations.const';

type Props = {
    multiSelect?: ?boolean,
};

const SelectBoxes = (props: Props) => {
    const { multiSelect, ...passOnProps } = props;

    if (multiSelect) {
        return (
            <MultiSelectBoxes
                orientation={orientations.HORIZONTAL}
                {...passOnProps}
            />
        );
    }

    return (
        <SingleSelectBoxes
            orientation={orientations.HORIZONTAL}
            {...passOnProps}
        />
    );
};

export default SelectBoxes;
