// @flow
import * as React from 'react';
import BooleanFilter from './BooleanFilter.component';
import type { BooleanFilterData } from './types';

type Props = {
  filter: ?BooleanFilterData,
  filterTypeRef: Function,
};

type State = {
  value: ?Array<string>,
};

class BooleanFilterManager extends React.Component<Props, State> {
  static calculateDefaultValueState(filter: ?BooleanFilterData): ?Array<string> {
    if (!filter) {
      return undefined;
    }

    return filter.values.map((value) => (value ? 'true' : 'false'));
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      value: BooleanFilterManager.calculateDefaultValueState(this.props.filter),
    };
  }

  handleCommitValue = (value: ?Array<string>) => {
    this.setState({
      value,
    });
  };

  render() {
    const { filter, filterTypeRef, ...passOnProps } = this.props;

    return (
      // $FlowFixMe[cannot-spread-inexact] automated comment
      <BooleanFilter
        value={this.state.value}
        innerRef={filterTypeRef}
        onCommitValue={this.handleCommitValue}
        {...passOnProps}
      />
    );
  }
}

export default BooleanFilterManager;
