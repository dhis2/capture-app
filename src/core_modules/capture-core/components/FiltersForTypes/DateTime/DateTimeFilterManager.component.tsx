import * as React from 'react';
import { convertIsoToLocalCalendar } from '../../../utils/converters/date';
import { DateTimeFilter } from './DateTimeFilter.component';
import type { DateTimeFilterData } from './types/dateTime.types';
import type { Value } from './DateTime.types';

type Props = {
    filter?: DateTimeFilterData | null;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: (value?: Value | null) => void;
};

type State = {
    value?: Value;
};

function extractLocalDate(isoDatetime?: string | null): string | undefined {
    if (!isoDatetime) {
        return undefined;
    }
    const datePart = isoDatetime.split('T')[0];
    return convertIsoToLocalCalendar(datePart) || undefined;
}

function extractTime(isoDatetime?: string | null): string | undefined {
    if (!isoDatetime) {
        return undefined;
    }
    return isoDatetime.split('T')[1]?.slice(0, 5) ?? undefined;
}

export class DateTimeFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter?: DateTimeFilterData | null): Value {
        if (filter) {
            const fromDate = extractLocalDate(filter.ge);
            const fromTime = extractTime(filter.ge);
            const toDate = extractLocalDate(filter.le);
            const toTime = extractTime(filter.le);

            const from = fromDate ? { date: fromDate, time: fromTime ?? null, isValid: true } : null;
            const to = toDate ? { date: toDate, time: toTime ?? null, isValid: true } : null;

            if (from || to) {
                return { from, to };
            }
        }
        return null;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: DateTimeFilterManager.calculateDefaultState(this.props.filter),
        };
    }

    handleCommitValue = (value?: Value | null) => {
        this.setState({ value });
        this.props.handleCommitValue(value);
    };

    render() {
        const { filter, filterTypeRef, handleCommitValue, ...passOnProps } = this.props;

        return (
            <DateTimeFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
