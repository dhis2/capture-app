// @flow
import * as React from 'react';
import { OptionSetFilter } from './OptionSetFilter.component';
import type { OptionSetFilterData } from './types';

type Props = {
    filter: ?OptionSetFilterData,
    filterTypeRef: Function,
    singleSelect?: ?boolean,
    handleCommitValue: () => void,
};

type State = {
    value?: ?Array<any>,
};

export class OptionSetFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(filter: ?OptionSetFilterData, singleSelect: boolean) {
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

    handleCommitValue = (value: ?Array<any>) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <OptionSetFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
