// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import SelectBoxes from '../SelectionBoxes/SelectionBoxes.component';
import type { OptionRendererInputData } from '../internal/SelectionBoxes/selectBoxes.types';

type Props = {
    allowMultiple?: boolean,
    useRealBooleanValues?: ?boolean, // instead of string as option values
};

class D2BooleanField extends Component<Props> {
    static getOptions(useRealBooleanValues: boolean) {
        const trueText = i18n.t('Yes');
        const falseText = i18n.t('No');

        return [
            {
                name: trueText,
                value: useRealBooleanValues ? true : 'true',
            },
            {
                name: falseText,
                value: useRealBooleanValues ? false : 'false',
            },
        ];
    }

    options: Array<OptionRendererInputData>;

    constructor(props: Props) {
        super(props);
        this.options = D2BooleanField.getOptions(!!this.props.useRealBooleanValues);
    }

    render() {
        const { allowMultiple, useRealBooleanValues, ...passOnProps } = this.props;
        return (
            <div>
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <SelectBoxes
                    options={this.options}
                    multiSelect={allowMultiple}
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default D2BooleanField;
