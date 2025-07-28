import * as React from 'react';
import './rowsPerPage.css';

import { OptionsSelectVirtualized } from '../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { withTranslations } from '../FormFields/Options/SelectVirtualized/withTranslations';
import type { VirtualizedOptionConfig } from
    '../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';

const OptionsSelectWithTranslations = withTranslations()(OptionsSelectVirtualized) as any;

type Props = {
    rowsPerPage: number;
    onChangeRowsPerPage: (rowsPerPage: number) => void;
    disabled?: boolean;
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

        constructor(props: Props) {
            super(props);
            this.options = RowsPerPageSelector.getOptions();
        }

        options: Array<VirtualizedOptionConfig>;

        handleRowsSelect = (rowsPerPage: number) => {
            this.props.onChangeRowsPerPage(rowsPerPage);
        }

        renderSelectorElement = () => {
            const { rowsPerPage, disabled } = this.props;

            return (
                <div id="rows-per-page-selector" data-test="rows-per-page-selector">
                    <OptionsSelectWithTranslations
                        onSelect={this.handleRowsSelect}
                        options={this.options}
                        value={rowsPerPage}
                        nullable={false}
                        disabled={disabled}
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
export const withRowsPerPageSelector = () =>
    (InnerComponent: React.ComponentType<any>) =>
        getRowsPerPageSelector(InnerComponent);
