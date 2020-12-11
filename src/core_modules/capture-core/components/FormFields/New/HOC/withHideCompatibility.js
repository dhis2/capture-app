// @flow
import * as React from 'react';

type Props = {
  hidden?: ?boolean,
};

export default () => (InnerComponent: React.ComponentType<any>) =>
  class HideFieldCompatibilityInterface extends React.Component<Props> {
    render() {
      const { hidden, ...passOnProps } = this.props;

      if (hidden) {
        return null;
      }

      return <InnerComponent {...passOnProps} />;
    }
  };
