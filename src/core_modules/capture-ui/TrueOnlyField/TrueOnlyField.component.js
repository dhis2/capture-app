// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { SelectionBoxes } from '../SelectionBoxes/SelectionBoxes.component';
import { MultiSelectionCheckedIcon, MultiSelectionUncheckedIcon } from '../Icons';
import type { OptionRendererInputData } from '../internal/SelectionBoxes/selectBoxes.types';

type Props = {
    useRealTrueValue?: ?boolean, // instead of string as option values
};

export class TrueOnlyField extends Component<Props> {
    static getOptions(useRealTrueValue: boolean) {
        const trueText = i18n.t('Yes');

        return [
            {
                name: trueText,
                value: useRealTrueValue ? true : 'true',
            },
        ];
    }

    options: Array<OptionRendererInputData>;

    constructor(props: Props) {
        super(props);
        this.options = TrueOnlyField.getOptions(!!this.props.useRealTrueValue);
    }

    render() {
        const { useRealTrueValue, ...passOnProps } = this.props;

        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <SelectionBoxes
                    options={this.options}
                    {...passOnProps}
                >
                    {
                        (optionData, isSelected) =>
                            (isSelected ? <MultiSelectionCheckedIcon /> : <MultiSelectionUncheckedIcon />)
                    }
                </SelectionBoxes>
            </div>
        );
    }
}
