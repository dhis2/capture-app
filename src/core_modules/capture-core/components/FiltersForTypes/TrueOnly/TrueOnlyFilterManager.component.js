// @flow
import * as React from 'react';
import TrueOnlyFilter from './TrueOnlyFilter.component';
import type { TrueOnlyFilterData } from './types';

type Props = {
    filter: ?TrueOnlyFilterData,
    filterTypeRef: ?Function,
};

type State = {
    value: ?Array<string>,
};

class TrueOnlyFilterManager extends React.Component<Props, State> {
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

export default TrueOnlyFilterManager;
