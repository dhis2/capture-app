// @flow
import * as React from 'react';
import { TextFilter } from './TextFilter.component';
import type { TextFilterData } from './types';

type Props = {
    filter: ?TextFilterData,
    filterTypeRef: Function,
    handleCommitValue: () => void,
};

type State = {
    value: ?string,
};

export class TextFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: ?TextFilterData) {
        if (!filter) {
            return { value: undefined };
        }

        // When the filter represents an "Empty / no value" choice we keep the
        // internal value as null so that the checkbox is shown as checked and the
        // input rendered empty.
        if (filter.isNoValue) {
            return { value: null };
        }

        return { value: filter.value || undefined };
    }

    constructor(props: Props) {
        super(props);
        this.state = TextFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: ?string) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TextFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
