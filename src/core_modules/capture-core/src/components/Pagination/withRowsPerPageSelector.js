// @flow
import * as React from 'react';
import './rowsPerPage.css';

import OptionsSelect from '../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import withTranslations from '../FormFields/Options/SelectVirtualized/withTranslations';
import type { VirtualizedOptionConfig } from
    '../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';

const OptionsSelectWithTranslations = withTranslations()(OptionsSelect);

type Props = {
    rowsPerPage: number,
    onChangeRowsPerPage: (rowsPerPage: number) => void,
};

const getRowsPerPageSelector = (InnerComponent: React.ComponentType<any>) =>
    class RowsPerPageSelector extends React.Component<Props> {
        static getOptions(): Array<VirtualizedOptionConfig> {
            const options =
                [10, 15, 25, 50, 100]
                    .map(optionCount => ({
                        label: optionCount.toString(),
                        value: optionCount,
                    }));
            return options;
        }

        options: Array<VirtualizedOptionConfig>;
        constructor(props: Props) {
            super(props);
            this.options = RowsPerPageSelector.getOptions();
        }

        handleRowsSelect = (rowsPerPage: number) => {
            this.props.onChangeRowsPerPage(rowsPerPage);
        }

        renderSelectorElement = () => {
            const rowsPerPage = this.props.rowsPerPage;

            return (
                <div id="rows-per-page-selector">
                    <OptionsSelectWithTranslations
                        onSelect={this.handleRowsSelect}
                        options={this.options}
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
