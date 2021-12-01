// @flow
import moment from 'moment';
import * as React from 'react';
import { convertMomentToDateFormatString } from '../../../utils/converters/date';
import { dateFilterTypes } from './constants';
import { DateFilter } from './DateFilter.component';
import type { Value } from './DateFilter.component';
import { mainOptionKeys } from './mainOptions';
import type { DateFilterData } from './types';

type Props = {
    filter: ?DateFilterData,
    filterTypeRef: Function,
    handleCommitValue: () => void,
};

type State = {
    value?: Value,
};

export class DateFilterManager extends React.Component<Props, State> {
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
        this.props.handleCommitValue && this.props.handleCommitValue();
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
