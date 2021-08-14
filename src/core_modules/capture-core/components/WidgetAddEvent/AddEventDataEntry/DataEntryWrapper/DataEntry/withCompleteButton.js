// @flow
import * as React from 'react';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

type Props = {
    id: string,
    onComplete: () => void,
};

const getCompleteButton = (InnerComponent: React.ComponentType<any>) =>
    class CompleteButtonHOC extends React.Component<Props> {
        innerInstance: any;

        getWrappedInstance = () => this.innerInstance;

        render() {
            const { onComplete, ...passOnProps } = this.props;

            return (
                // $FlowFixMe[cannot-spread-inexact] automated comment
                <InnerComponent
                    ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                    completeButton={
                        <Button onClick={onComplete} primary>{i18n.t('Complete')}</Button>
                    }
                    {...passOnProps}
                />
            );
        }
    };


export const withCompleteButton = () => (InnerComponent: React.ComponentType<any>) => getCompleteButton(InnerComponent);
