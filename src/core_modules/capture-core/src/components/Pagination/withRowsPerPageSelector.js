// @flow
import * as React from 'react';
import './rowsPerPage.css';

import OptionSet from '../../metaData/OptionSet/OptionSet';
import Option from '../../metaData/OptionSet/Option';
import OptionsSelect from '../FormFields/Options/SelectVirtualized/OptionsSelectVirtualized.component';
import withTranslations from '../FormFields/Options/SelectVirtualized/withTranslations';

const OptionsSelectWithTranslations = withTranslations()(OptionsSelect);

type Props = {
    rowsPerPage: number,
    onChangeRowsPerPage: (rowsPerPage: number) => void,
};

const getRowsPerPageSelector = (InnerComponent: React.ComponentType<any>) =>
    class RowsPerPageSelector extends React.Component<Props> {
        static getOptionSet() {
            const options = [10, 15, 25, 50, 100]
                .map(optionCount => new Option((_this) => {
                    _this.value = optionCount;
                    _this.text = optionCount.toString();
                }));

            return new OptionSet('rowsCountOptions', options);
        }
        optionSet: OptionSet;

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
                <div id="rows-per-page-selector">
                    <OptionsSelectWithTranslations
                        onBlur={this.handleRowsSelect}
                        optionSet={this.optionSet}
                        value={rowsPerPage}
                        nullable={false}
                        withoutUnderline
                        searchable={false}
                    />
                </div>
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

/**
 * Add rows per page selector to the inner component
 * @returns React Component
 * @alias withRowsPerPageSelector
 * @memberof Pagination
 * @example withRowsPerPageSelector()([InnerComponent])
*/
export default () =>
    (InnerComponent: React.ComponentType<any>) =>
        getRowsPerPageSelector(InnerComponent);
