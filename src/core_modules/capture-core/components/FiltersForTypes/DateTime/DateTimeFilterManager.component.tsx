import * as React from 'react';
import moment from 'moment';
import { convertIsoToLocalCalendar } from '../../../utils/converters/date';
import { DateTimeFilter as DateTimeFilterInput } from './DateTimeFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { DateTimeFilter, Value } from './dateTime.types';

type Props = {
    filter?: DateTimeFilter | null;
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
    const localDateStr = moment(isoDatetime).format('YYYY-MM-DD');
    return convertIsoToLocalCalendar(localDateStr) || undefined;
}

function extractTime(isoDatetime?: string | null): string | undefined {
    if (!isoDatetime) {
        return undefined;
    }
    return moment(isoDatetime).format('HH:mm');
}

export class DateTimeFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter?: DateTimeFilter | null): Value {
        if (!filter) return null;
        if (isEmptyFilterData(filter)) return getEmptyValueFilterValue(filter);

        if ('type' in filter) {
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
            <DateTimeFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
