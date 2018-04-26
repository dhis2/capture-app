// @flow
import * as React from 'react';

import OptionSet from '../../../../../metaData/OptionSet/OptionSet';
import Option from '../../../../../metaData/OptionSet/Option';
import OptionsSelect from '../../../../FormFields/Options/SelectVirtualized/OptionsSelectVirtualized.component';
import withTranslations from '../../../../FormFields/Options/SelectVirtualized/withTranslations';

const OptionsSelectWithTranslations = withTranslations()(OptionsSelect);

type Props = {
    rowsPerPage: number,
    onChangeRowsPerPage: (rowsPerPage: number) => void,
};

const getRowsPerPageSelector = (InnerComponent: React.ComponentType<any>) =>
    class RowsPerPageSelector extends React.Component<Props> {
        optionSet: OptionSet;
        static getOptionSet() {
            const options = [1, 5, 10, 15]
                .map(optionCount => new Option((_this) => {
                    _this.value = optionCount;
                    _this.text = optionCount.toString();
                }));

            return new OptionSet('rowsCountOptions', options);
        }

        constructor(props: Props) {
            super(props);
            this.optionSet = RowsPerPageSelector.getOptionSet();
        }

        handleRowsSelect = (rowsPerPage: number) => {
            this.props.onChangeRowsPerPage(rowsPerPage);
        }

        renderSelectorElement = () => {
            const rowsPerPage = this.props.rowsPerPage;

            return (
                <OptionsSelectWithTranslations
                    onBlur={this.handleRowsSelect}
                    optionSet={this.optionSet}
                    value={rowsPerPage}
                    nullable={false}
                    withoutUnderline
                    searchable={false}
                />
            );
        }

        render = () => {
            const { ...passOnProps } = this.props;
            return (
                <InnerComponent
                    rowsCountSelector={this.renderSelectorElement()}
                    {...passOnProps}
                />
            );
        }
    };

export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        getRowsPerPageSelector(InnerComponent);
