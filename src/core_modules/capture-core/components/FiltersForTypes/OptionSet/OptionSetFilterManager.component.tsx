import * as React from 'react';
import { OptionSetFilter as OptionSetFilterInput } from './OptionSetFilter.component';
import { getEmptyValueFilterValue } from '../EmptyValue';
import type { OptionSetFilter } from './optionSet.types';

type Props = {
    filter: OptionSetFilter | null,
    filterTypeRef: (instance: any) => void,
    singleSelect?: boolean | null,
    handleCommitValue: () => void,
};

type State = {
    value?: Array<any> | string | null,
};

export class OptionSetFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(filter: OptionSetFilter | null, singleSelect: boolean) {
        if (!filter) {
            return undefined;
        }

        if ('isEmpty' in filter) {
            return getEmptyValueFilterValue(filter);
        }

        return singleSelect ? filter.values[0] : filter.values;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: OptionSetFilterManager.calculateDefaultValueState(this.props.filter, !!this.props.singleSelect),
        };
    }

    handleCommitValue = (value: Array<any> | string | null) => {
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
