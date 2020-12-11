// @flow
import * as React from 'react';
import UniqueTEADuplicate from './UniqueTEADuplicate/UniqueTEADuplicate.component';

type Props = {
  onLink: (teiId: string) => void,
};

type CacheItem = {
  errorMessage: string,
  errorData: any,
  outputElement: React.Node,
};

export default () => (InnerComponent: React.ComponentType<any>) =>
  class ErrorMessagePostProcessorHOC extends React.Component<Props> {
    cache: CacheItem;

    constructor(props: Props) {
      super(props);
      this.cache = {};
    }

    postProcessErrorMessage = (
      errorMessage: string,
      errorType: ?string,
      errorData: any,
      id: string,
      fieldId: string,
    ) => {
      if (errorType !== 'unique') {
        return errorMessage;
      }

      const cacheItem = this.cache[id] || {};
      if (errorMessage === cacheItem.errorMessage && errorData === cacheItem.errorData) {
        return cacheItem.outputElement;
      }

      const outputElement = (
        <UniqueTEADuplicate errorData={errorData} id={fieldId} onLink={this.props.onLink} />
      );

      this.cache[id] = {
        errorMessage,
        errorData,
        outputElement,
      };

      return outputElement;
    };

    render() {
      const { onLink, ...passOnProps } = this.props;

      return (
        // $FlowFixMe[cannot-spread-inexact] automated comment
        <InnerComponent onPostProcessErrorMessage={this.postProcessErrorMessage} {...passOnProps} />
      );
    }
  };
