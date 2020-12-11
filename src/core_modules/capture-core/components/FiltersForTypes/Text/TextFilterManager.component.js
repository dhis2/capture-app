// @flow
import * as React from 'react';
import TextFilter from './TextFilter.component';
import type { TextFilterData } from '../filters.types';

type Props = {
  filter: ?TextFilterData,
  filterTypeRef: Function,
};

type State = {
  value: ?string,
};

class TextFilterManager extends React.Component<Props, State> {
  static calculateDefaultState(filter: ?TextFilterData) {
    return {
      value: filter && filter.value ? filter.value : undefined,
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = TextFilterManager.calculateDefaultState(this.props.filter);
  }

  handleCommitValue = (value: ?string) => {
    this.setState({
      value,
    });
  };

  render() {
    const { filter, filterTypeRef, ...passOnProps } = this.props;

    return (
      // $FlowFixMe[cannot-spread-inexact] automated comment
      <TextFilter
        value={this.state.value}
        ref={filterTypeRef}
        onCommitValue={this.handleCommitValue}
        {...passOnProps}
      />
    );
  }
}

export default TextFilterManager;
