// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';

import SingleSelectBoxes from '../Options/SingleSelectBoxes/SingleSelectBoxes.component';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import Option from '../../../metaData/OptionSet/Option';

type Props = {

};

class D2TrueFalse extends Component<Props> {
    static getOptions() {
        const trueText = i18n.t('Yes');
        const falseText = i18n.t('No');

        const optionSet = new OptionSet();
        optionSet.addOption(new Option((_this) => { _this.text = trueText; _this.value = 'true'; }));
        optionSet.addOption(new Option((_this) => { _this.text = falseText; _this.value = 'false'; }));
        return optionSet;
    }

    optionSet: OptionSet;

    constructor(props: Props) {
        super(props);
        this.optionSet = D2TrueFalse.getOptions();
    }

    render() {
        const { ...passOnProps } = this.props;

        return (
            <div>
                <SingleSelectBoxes
                    {...passOnProps}
                    optionSet={this.optionSet}
                />
            </div>
        );
    }
}

export default D2TrueFalse;
