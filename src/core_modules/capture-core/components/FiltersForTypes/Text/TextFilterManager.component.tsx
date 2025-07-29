import * as React from 'react';
import { TextFilter } from './TextFilter.component';
import type { TextFilterData } from './types';

type Props = {
    filter: TextFilterData | null | undefined;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void;
};

type State = {
    value: string | null | undefined;
};

export class TextFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: TextFilterData | null | undefined) {
        return {
            value: (filter && filter.value ? filter.value : undefined),
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = TextFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: string | null | undefined) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <TextFilter
                value={this.state.value}
                ref={filterTypeRef}
                onUpdate={this.handleCommitValue}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
