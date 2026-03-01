import * as React from 'react';
import moment from 'moment';
import { convertIsoToLocalCalendar } from '../../../utils/converters/date';
import { DateTimeFilter } from './DateTimeFilter.component';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';
import type { DateTimeFilterData } from './types/dateTime.types';
import type { Value } from './DateTime.types';

type Props = {
    filter?: DateTimeFilterData | null;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void;
};

type State = {
    value?: Value;
};

function extractLocalDate(isoDatetime?: string | null): string | undefined {
    if (!isoDatetime) {
        return undefined;
    }
    const localDateStr = moment(isoDatetime).format('YYYY-MM-DD');
    return convertIsoToLocalCalendar(localDateStr) || undefined;
}

function extractTime(isoDatetime?: string | null): string | undefined {
    if (!isoDatetime) {
        return undefined;
    }
    const hhmm = moment(isoDatetime).format('HH:mm');
    return hhmm === '00:00' ? undefined : hhmm;
}

export class DateTimeFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter?: DateTimeFilterData | null): Value {
        if (filter && 'isEmpty' in filter) {
            return filter.isEmpty ? EMPTY_VALUE_FILTER : NOT_EMPTY_VALUE_FILTER;
        }

        if (filter && 'type' in filter) {
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
        this.props.handleCommitValue();
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
