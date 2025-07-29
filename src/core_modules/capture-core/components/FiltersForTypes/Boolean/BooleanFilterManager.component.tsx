import * as React from 'react';
import { BooleanFilter } from './BooleanFilter.component';
import type { BooleanFilterStringified } from './types';

type Props = {
    filter: BooleanFilterStringified | null,
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void,
    singleSelect: boolean,
};

type State = {
    value: Array<string> | string | boolean | null | undefined,
};

export class BooleanFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(
        filter: BooleanFilterStringified | null,
        singleSelect: boolean,
    ): (Array<string> | string | null | boolean | undefined) {
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

    handleCommitValue = (value?: Array<string> | string | boolean| null) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, singleSelect, ...passOnProps } = this.props;

        return (
            <BooleanFilter
                value={this.state.value}
                // @ts-expect-error - keeping original functionality as before ts rewrite
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                allowMultiple={!singleSelect}
                {...passOnProps}
            />
        );
    }
}
