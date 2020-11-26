// @flow
import * as React from 'react';
import { moment } from 'capture-core-utils/moment';
import { convertMomentToDateFormatString } from '../../../utils/converters/date';
import DateFilter from './DateFilter.component';
import { mainOptionKeys } from './mainOptions';
import { dateFilterTypes } from './constants';
import type { DateFilterData } from './types';
import type { Value } from './DateFilter.component';

type Props = {
    filter: ?DateFilterData,
    filterTypeRef: Function,
};

type State = {
    value?: Value,
};

class DateFilterManager extends React.Component<Props, State> {
    static convertDateForEdit(rawValue: string) {
        const momentInstance = moment(rawValue);
        return convertMomentToDateFormatString(momentInstance);
    }

    static calculateDefaultValueState(filter: ?DateFilterData) {
        if (!filter) {
            return undefined;
        }

        if (filter.type === dateFilterTypes.RELATIVE) {
            return {
                main: filter.period,
            };
        }

        return {
            main: mainOptionKeys.CUSTOM_RANGE,
            from: filter.ge && DateFilterManager.convertDateForEdit(filter.ge),
            to: filter.le && DateFilterManager.convertDateForEdit(filter.le),
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: DateFilterManager.calculateDefaultValueState(this.props.filter),
        };
    }

    handleCommitValue = (value: ?Object) => {
        this.setState({
            value,
        });
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <DateFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}

export default DateFilterManager;
