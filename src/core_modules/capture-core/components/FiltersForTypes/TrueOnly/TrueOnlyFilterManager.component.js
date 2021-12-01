// @flow
import * as React from 'react';
import type { TrueOnlyFilterData } from './types';
import { TrueOnlyFilter } from './TrueOnlyFilter.component';

type Props = {
    filter: ?TrueOnlyFilterData,
    filterTypeRef: ?Function,
    handleCommitValue: () => void,
};

type State = {
    value: ?Array<string>,
};

export class TrueOnlyFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: ?TrueOnlyFilterData) {
        return {
            value: filter && filter.value ? ['true'] : undefined,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = TrueOnlyFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: ?Array<string>) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TrueOnlyFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
