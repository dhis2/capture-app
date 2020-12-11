// @flow
import React, { Component } from 'react';
import moment from 'moment';
import UIDate from '../../DateAndTimeFields/DateField/Date.component';
import orientations from '../../constants/orientations.const';
import withFocusSaver from '../../HOC/withFocusSaver';

type Props = {
  value: ?string,
  onBlur: (value: string) => void,
  onChange?: ?(value: string) => void,
  orientation: $Values<typeof orientations>,
};

class AgeDateInput extends Component<Props> {
  render() {
    const { value, orientation, ...passOnProps } = this.props;
    return (
      // $FlowFixMe[cannot-spread-inexact] automated comment
      <UIDate
        value={value || ''}
        calendarMaxMoment={moment()}
        width={150}
        calendarWidth={350}
        {...passOnProps}
      />
    );
  }
}

export default withFocusSaver()(AgeDateInput);
