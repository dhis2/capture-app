// @flow
import * as React from 'react';
import withDataEntryField from './withDataEntryField';

type Props = {};

type Settings = {
  isApplicable: (props: Props) => boolean,
};

const getDataEntryFieldIfApplicable = (
  settings: Settings,
  InnerComponent: React.ComponentType<any>,
) =>
  class DataEntryFieldIfApplicableHOC extends React.Component<Props> {
    Component: React.ComponentType<any>;

    constructor(props: Props) {
      super(props);
      const applicable = settings.isApplicable(this.props);
      if (applicable) {
        // $FlowFixMe
        this.Component = withDataEntryField(settings)(InnerComponent);
      } else {
        this.Component = InnerComponent;
      }
    }

    render() {
      const { Component } = this;
      return <Component {...this.props} />;
    }
  };

export default (settings: Settings) => (InnerComponent: React.ComponentType<any>) =>
  getDataEntryFieldIfApplicable(settings, InnerComponent);
