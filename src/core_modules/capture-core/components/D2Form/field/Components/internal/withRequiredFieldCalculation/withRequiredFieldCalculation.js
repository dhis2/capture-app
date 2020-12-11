// @flow
import * as React from 'react';

type Props = {
  metaCompulsory?: ?boolean,
  rulesCompulsory?: ?boolean,
};

export default () => (InnerComponent: React.ComponentType<any>) =>
  class RequiredFieldCalculationHOC extends React.Component<Props> {
    render() {
      const { metaCompulsory, rulesCompulsory, ...passOnProps } = this.props;

      return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <InnerComponent required={!!(metaCompulsory || rulesCompulsory)} {...passOnProps} />
      );
    }
  };
