// @flow
import React from 'react';
import { makeCancelablePromise } from 'capture-core-utils';
import { getApi } from '../../../../../../d2/d2Instance';
import ExistingTEIContents from './ExistingTEIContents.container';
import withLoadingIndicator from '../../../../../../HOC/withLoadingIndicator';
import type { ErrorData } from './uniqueTEADuplicate.types';

const LoadingInddicatorWrappedContents = withLoadingIndicator()(ExistingTEIContents);

type Props = {
    programId: ?string,
    errorData: ErrorData,
};

type State = {
    ready: boolean,
    tetAttributesOnly: boolean,
    attributeValues: ?{[id: string]: any},
};

class ExistingTEILoader extends React.Component<Props, State> {
    cancelablePromise: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            ready: false,
            tetAttributesOnly: false,
            attributeValues: null,
        };
        this.requestTei();
    }

    componentWillUnmount() {
        this.cancelablePromise && this.cancelablePromise.cancel();
    }

    requestTeiWithoutProgram() {
        const { errorData } = this.props;
        const { id } = errorData;
        const cancelablePromise = makeCancelablePromise(
            getApi()
                .get(
                    // $FlowFixMe[incompatible-type] automated comment
                    `trackedEntityInstances/${id}`,
                    {
                    },
                ),
        );

        cancelablePromise
            .promise
            .then((teiData) => {
                const attributes = (teiData && teiData.attributes) || [];
                this.setState({
                    ready: true,
                    tetAttributesOnly: true,
                    attributeValues: attributes
                        .reduce((acc, attributeData) => {
                            acc[attributeData.attribute] = attributeData.value;
                            return acc;
                        }, {}),
                });
            })
            .catch((error) => {
                if (error && error.isCanceled) {
                    return;
                }
                // logged, no additional actions for now
                this.setState({
                    ready: true,
                    tetAttributesOnly: true,
                    attributeValues: {},
                });
            });

        this.cancelablePromise = cancelablePromise;
    }

    requestTeiInProgramContext() {
        const { errorData, programId } = this.props;
        const { id } = errorData;
        const cancelablePromise = makeCancelablePromise(
            getApi()
                .get(
                    // $FlowFixMe[incompatible-type] automated comment
                    `trackedEntityInstances/${id}`,
                    {
                        program: programId,
                    },
                ),
        );

        cancelablePromise
            .promise
            .then((teiData) => {
                if (!teiData || !teiData.attributes) {
                    this.requestTeiWithoutProgram();
                    return;
                }
                this.setState({
                    ready: true,
                    attributeValues: teiData
                        .attributes
                        .reduce((acc, attributeData) => {
                            acc[attributeData.attribute] = attributeData.value;
                            return acc;
                        }, {}),
                });
            })
            .catch((error) => {
                if (error && error.isCanceled) {
                    return;
                }
                // TODO: if this is because of ownership -> request tei without program
                this.requestTeiWithoutProgram();
            });

        this.cancelablePromise = cancelablePromise;
    }

    requestTei() {
        const {programId} = this.props;
        if (programId) {
            this.requestTeiInProgramContext();
        } else {
            this.requestTeiWithoutProgram();
        }
    }

    render() {
        const { ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <LoadingInddicatorWrappedContents
                {...this.state}
                {...passOnProps}
            />
        );
    }
}

export default ExistingTEILoader;
