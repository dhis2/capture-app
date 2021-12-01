// @flow
import React, { useMemo } from 'react';

import { SingleSelectBoxes, singleOrientations } from '../SingleSelectBoxes';
import { MultiSelectBoxes, multiOrientations } from '../MultiSelectBoxes';
import type { Props, Options } from './selectBoxes.types';
import { orientations } from './selectBoxes.const';


export const SelectBoxes = (props: Props) => {
    const { multiSelect, options, optionSet, orientation, ...passOnProps } = props;

    // $FlowFixMe even with a cheat flow could not figure out this one
    const outputOptions: Options = useMemo(() => {
        if (optionSet) {
            return optionSet.options
                .map(({ text, value }) => ({ text, value }));
        }
        return options;
    }, [optionSet, options]);

    const [SelectBoxesTypeComponent, typeOrientation] = multiSelect ?
        [MultiSelectBoxes, orientations.VERTICAL ? multiOrientations.VERTICAL : multiOrientations.HORIZONTAL] :
        [SingleSelectBoxes, orientations.VERTICAL ? singleOrientations.VERTICAL : singleOrientations.HORIZONTAL];

    return (
        <SelectBoxesTypeComponent
            {...passOnProps}
            orientation={typeOrientation}
            options={outputOptions}
        />
    );
};
