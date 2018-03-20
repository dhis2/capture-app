// @flow
import React, { Component } from 'react';
import { getTranslation } from '../../../d2/d2Instance';
import { formatterOptions } from '../../../utils/string/format.const';

import SingleSelectBoxes from '../Options/SingleSelectBoxes/SingleSelectBoxes.component';
import OptionSet from '../../../metaData/OptionSet/OptionSet';
import Option from '../../../metaData/OptionSet/Option';

type Props = {

};

class D2TrueFalse extends Component<Props> {
    static uiTexts = {
        YES: 'boolean_true',
        NO: 'boolean_false',
    };

    static getOptions() {
        const trueText = getTranslation(D2TrueFalse.uiTexts.YES, formatterOptions.CAPITALIZE_FIRST_LETTER);
        const falseText = getTranslation(D2TrueFalse.uiTexts.NO, formatterOptions.CAPITALIZE_FIRST_LETTER);

        const optionSet = new OptionSet();
        optionSet.addOption(new Option((_this) => { _this.text = trueText; _this.value = 'true'; }));
        optionSet.addOption(new Option((_this) => { _this.text = falseText; _this.value = 'false'; }));
        return optionSet;
    }

    fieldInstance: SingleSelectBoxes;
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
                    ref={((instance) => { this.fieldInstance = instance; })}
                />
            </div>
        );
    }
}

export default D2TrueFalse;
