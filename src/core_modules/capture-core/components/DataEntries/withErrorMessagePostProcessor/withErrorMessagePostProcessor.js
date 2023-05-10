// @flow
import * as React from 'react';
import type { PostProcessErrorMessage } from '../../D2Form/FormBuilder';
import { UniqueTEADuplicate } from './UniqueTEADuplicate/UniqueTEADuplicate.component';
import type { ExistingUniqueValueDialogActionsComponent } from './UniqueTEADuplicate/existingTeiContents.types';

type Props = {
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
};

type CacheItem = {
    errorMessage: string,
    errorData: any,
    outputElement: React.Node,
};

type GetTrackedEntityTypeName = (props: Object) => string;

export const withErrorMessagePostProcessor = (getTrackedEntityTypeName: GetTrackedEntityTypeName) => (InnerComponent: React.ComponentType<any>) =>
    class ErrorMessagePostProcessorHOC extends React.Component<Props> {
        cache: CacheItem;
        constructor(props: Props) {
            super(props);
            this.cache = {};
        }

        postProcessErrorMessage: PostProcessErrorMessage = ({
            errorMessage,
            errorType,
            errorData,
            id,
            fieldLabel,
        }) => {
            if (errorType !== 'unique') {
                return errorMessage;
            }

            const cacheItem = this.cache[id] || {};
            if (errorMessage === cacheItem.errorMessage && errorData === cacheItem.errorData) {
                return cacheItem.outputElement;
            }

            const outputElement = (
                <UniqueTEADuplicate
                    errorData={errorData}
                    ExistingUniqueValueDialogActions={this.props.ExistingUniqueValueDialogActions}
                    trackedEntityTypeName={getTrackedEntityTypeName(this.props)}
                    attributeName={fieldLabel}
                />
            );

            this.cache[id] = {
                errorMessage,
                errorData,
                outputElement,
            };

            return outputElement;
        }

        render() {
            const { ExistingUniqueValueDialogActions, ...passOnProps } = this.props;

            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    onPostProcessErrorMessage={this.postProcessErrorMessage}
                    {...passOnProps}
                />
            );
        }
    };

