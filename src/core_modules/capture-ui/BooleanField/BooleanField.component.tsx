import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { SelectionBoxes } from '../SelectionBoxes/SelectionBoxes.component';
import type { OptionRendererInputData } from '../internal/SelectionBoxes/selectBoxes.types';

type Props = {
    allowMultiple?: boolean;
    useRealBooleanValues?: boolean;
    onSelect?: (value: any, event: any) => void;
};

export class BooleanField extends Component<Props> {
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
        this.options = BooleanField.getOptions(!!this.props.useRealBooleanValues);
    }

    render() {
        const { allowMultiple, useRealBooleanValues, onSelect, ...passOnProps } = this.props;
        return (
            <div>
                <SelectionBoxes
                    options={this.options}
                    multiSelect={allowMultiple}
                    onSelect={onSelect}
                    {...passOnProps}
                />
            </div>
        );
    }
}
