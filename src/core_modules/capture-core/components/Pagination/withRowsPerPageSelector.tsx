import * as React from 'react';
import './rowsPerPage.css';

import { NewSingleSelectField } from '../FormFields/New/Fields/SingleSelectField/SingleSelectField.component';

export type SelectOption = {
    label: string;
    value: any;
    icon?: React.ReactNode | null;
};

type Props = {
    rowsPerPage: number;
    onChangeRowsPerPage: (rowsPerPage: number) => void;
    disabled?: boolean;
};

const getRowsPerPageSelector = (InnerComponent: React.ComponentType<any>) =>
    class RowsPerPageSelector extends React.Component<Props> {
        static getOptions(): Array<SelectOption> {
            const options =
                [10, 15, 25, 50, 100]
                    .map(optionCount => ({
                        label: optionCount.toString(),
                        value: optionCount,
                    }));
            return options;
        }

        options: Array<SelectOption>;

        constructor(props: Props) {
            super(props);
            this.options = RowsPerPageSelector.getOptions();
        }

        handleRowsSelect = (rowsPerPage: string | null) => {
            if (rowsPerPage != null) {
                this.props.onChangeRowsPerPage(Number(rowsPerPage));
            }
        }

        renderSelectorElement = () => {
            const { rowsPerPage, disabled } = this.props;

            return (
                <div id="rows-per-page-selector" data-test="rows-per-page-selector">
                    <NewSingleSelectField
                        onChange={this.handleRowsSelect}
                        options={this.options}
                        value={rowsPerPage != null ? String(rowsPerPage) : null}
                        clearable={false}
                        disabled={disabled}
                        filterable={false}
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
