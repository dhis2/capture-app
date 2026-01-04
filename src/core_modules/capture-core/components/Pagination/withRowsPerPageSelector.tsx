import * as React from 'react';
import { SimpleSingleSelect } from '@dhis2/ui';
import './rowsPerPage.css';

type Props = {
    rowsPerPage: number;
    onChangeRowsPerPage: (rowsPerPage: number) => void;
    disabled?: boolean;
};

type SimpleSelectOption = {
    label: string;
    value: string;
};

const OPTIONS: SimpleSelectOption[] = [10, 15, 25, 50, 100].map(count => ({
    label: count.toString(),
    value: count.toString(),
}));

const getRowsPerPageSelector = (InnerComponent: React.ComponentType<any>) =>
    class RowsPerPageSelector extends React.Component<Props> {
        handleRowsSelect = (nextValue: any) => {
            const resolvedValue = typeof nextValue === 'string' ? nextValue : nextValue?.value;
            if (resolvedValue) {
                this.props.onChangeRowsPerPage(Number(resolvedValue));
            }
        }

        renderSelectorElement = () => {
            const { rowsPerPage, disabled } = this.props;
            const selectedOption = OPTIONS.find(option => option.value === rowsPerPage.toString());

            return (
                <>
                    <SimpleSingleSelect
                        name="rows-per-page-selector"
                        onChange={this.handleRowsSelect}
                        options={OPTIONS}
                        selected={selectedOption}
                        clearable={false}
                        dense
                        disabled={disabled}
                        dataTest="rows-per-page-selector"
                    />
                </>
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
