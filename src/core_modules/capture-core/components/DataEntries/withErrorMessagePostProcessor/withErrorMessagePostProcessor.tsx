import * as React from 'react';
import { ReactNode } from 'react';
import type { ComponentType } from 'react';
import { UniqueTEADuplicate } from './UniqueTEADuplicate/UniqueTEADuplicate.component';
import type { ExistingUniqueValueDialogActionsComponent } from './UniqueTEADuplicate/existingTeiContents.types';

type Props = {
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent,
};

type CacheItem = {
    errorMessage: string,
    errorData: any,
    outputElement: ReactNode,
};

type GetTrackedEntityTypeName = (props: Props) => string;


export const withErrorMessagePostProcessor = (getTrackedEntityTypeName: GetTrackedEntityTypeName) => 
    (InnerComponent: ComponentType<any>) =>
    class ErrorMessagePostProcessorHOC extends React.Component<Props> {
        cache: CacheItem | Record<string, never>;
        constructor(props: Props) {
            super(props);
            this.cache = {};
        }

        postProcessErrorMessage = ({
            errorMessage,
            errorType,
            errorData,
            id,
            fieldLabel,
        }: any) => {
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
                <InnerComponent
                    onPostProcessErrorMessage={this.postProcessErrorMessage}
                    {...passOnProps}
                />
            );
        }
    };
