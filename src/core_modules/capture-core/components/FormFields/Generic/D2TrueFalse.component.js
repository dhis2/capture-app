// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';

import SingleSelectBoxes from '../Options/SingleSelectBoxes/SingleSelectBoxes.component';
import MultiSelectBoxes from '../Options/MultiSelectBoxes/MultiSelectBoxes.component';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import Option from '../../../metaData/OptionSet/Option';

type Props = {
    allowMultiple?: boolean,
};

class D2TrueFalse extends Component<Props> {
    static getOptions() {
        const trueText = i18n.t('Yes');
        const falseText = i18n.t('No');

        const optionSet = new OptionSet();
        optionSet.addOption(new Option((o) => { o.text = trueText; o.value = 'true'; }));
        optionSet.addOption(new Option((o) => { o.text = falseText; o.value = 'false'; }));
        return optionSet;
    }

    optionSet: OptionSet;

    constructor(props: Props) {
        super(props);
        this.optionSet = D2TrueFalse.getOptions();
    }

    render() {
        const { allowMultiple, ...passOnProps } = this.props;
        const SelectBoxes = allowMultiple ? MultiSelectBoxes : SingleSelectBoxes;
        return (
            <div>
                <SelectBoxes
                    {...passOnProps}
                    optionSet={this.optionSet}
                />
            </div>
        );
    }
}

export default D2TrueFalse;
