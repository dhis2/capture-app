import * as React from 'react';
import { OptionSetFilter as OptionSetFilterInput } from './OptionSetFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { OptionSetFilter, OptionSetFilterManagerProps, Value } from './optionSet.types';

type State = {
    value?: Value,
};

export class OptionSetFilterManager extends React.Component<OptionSetFilterManagerProps, State> {
    static calculateDefaultValueState(filter: OptionSetFilter | null, singleSelect: boolean) {
        if (!filter) return undefined;
        if (isEmptyFilterData(filter)) return getEmptyValueFilterValue(filter);
        return singleSelect ? filter.values[0] : filter.values;
    }

    constructor(props: OptionSetFilterManagerProps) {
        super(props);
        this.state = {
            value: OptionSetFilterManager.calculateDefaultValueState(this.props.filter, !!this.props.singleSelect),
        };
    }

    handleCommitValue = (value: Value) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <OptionSetFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
