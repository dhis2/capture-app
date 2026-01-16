import * as React from 'react';
import { OptionSetFilter } from './OptionSetFilter.component';
import type { OptionSetFilterData } from './types';

type Props = {
    filter: OptionSetFilterData | null,
    filterTypeRef: (instance: any) => void,
    singleSelect?: boolean | null,
    handleCommitValue: () => void,
};

type State = {
    value?: Array<any> | null,
};

export class OptionSetFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(filter: OptionSetFilterData | null, singleSelect: boolean) {
        if (!filter) {
            return undefined;
        }

        return singleSelect ? filter.values[0] : filter.values;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: OptionSetFilterManager.calculateDefaultValueState(this.props.filter, !!this.props.singleSelect),
        };
    }

    handleCommitValue = (value: Array<any> | null) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <OptionSetFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
