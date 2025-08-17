import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { SelectionBoxes } from '../SelectionBoxes/SelectionBoxes.component';
import type { Props } from './BooleanField.types';

export class BooleanField extends Component<Props> {
    constructor(props: Props) {
        super(props);
        this.options = BooleanField.getOptions(!!this.props.useRealBooleanValues);
    }

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

    options: Array<any>;

    render() {
        const { allowMultiple, useRealBooleanValues, ...passOnProps } = this.props;
        return (
            <div>
                <SelectionBoxes
                    options={this.options}
                    multiSelect={allowMultiple}
                    {...passOnProps}
                />
            </div>
        );
    }
}
