// @flow
import * as React from 'react';
import { BooleanFilter } from './BooleanFilter.component';
import type { BooleanFilterStringified } from './types';

type Props = {
    filter: ?BooleanFilterStringified,
    filterTypeRef: Function,
    handleCommitValue: () => void,
    singleSelect: boolean,
};

type State = {
    value: ?Array<string> | string,
};

export class BooleanFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(
        filter: ?BooleanFilterStringified,
        singleSelect: boolean,
    ): ?(Array<string> | string) {
        if (!filter) {
            return undefined;
        }

        return singleSelect ? filter.values[0] : filter.values;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: BooleanFilterManager.calculateDefaultValueState(this.props.filter, this.props.singleSelect),
        };
    }

    handleCommitValue = (value: ?Array<string>) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, singleSelect, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <BooleanFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                allowMultiple={!singleSelect}
                {...passOnProps}
            />
        );
    }
}
