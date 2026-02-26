import * as React from 'react';
import { convertIsoToLocalCalendar } from '../../../utils/converters/date';
import { AgeFilter } from './AgeFilter.component';
import type { AgeFilterData, Value } from './Age.types';

type Props = {
    filter: AgeFilterData | null | undefined;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void;
    onUpdate: (updatedValue: Value) => void;
};

type State = {
    value: Value;
};

export class AgeFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: AgeFilterData | null | undefined): State {
        if (filter?.type !== 'ABSOLUTE') {
            return { value: undefined };
        }
        const rawValue = filter.ge ?? filter.le;
        if (!rawValue) {
            return { value: undefined };
        }
        try {
            const localDate = convertIsoToLocalCalendar(rawValue);
            return { value: localDate };
        } catch {
            return { value: undefined };
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = AgeFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: Value) => {
        this.setState({ value });
        this.props.handleCommitValue?.();
    };

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <AgeFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
