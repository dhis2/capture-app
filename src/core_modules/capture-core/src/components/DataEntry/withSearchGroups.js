// @flow
import * as React from 'react';
import log from 'loglevel';
import { connect } from 'react-redux';
import { pipe, makeCancelablePromise } from 'capture-core-utils';
import type { CancelablePromise } from 'capture-core-utils/cancelablePromise/makeCancelable';
import i18n from '@dhis2/d2-i18n';
import { InputSearchGroup, RenderFoundation } from '../../metaData';
import getDataEntryKey from './common/getDataEntryKey';
import { convertFormToClient, convertClientToServer } from '../../converters';
import { searchGroupResultCountRetrieved, searchGroupResultCountRetrievalFailed } from './actions/searchGroup.actions';

type Props = {
    dataEntryKey: string,
    values: Object,
    onUpdateFormField: (fieldId: string, value: any, innerAction: ReduxAction<any, any>, updateCompletePromise: ?Promise<any>, searchCompletePromises: ?Array<Promise<any>>) => void,
    onSearchGroupResultCountRetrievedInner: (count: number, dataEntryKey: string, groupId: string, completePromise?: ?Promise<any>, onSearchGroupResultCountRetrieved: ?Function) => void,
    onSearchGroupResultCountRetrieved: ?(innerAction: ReduxAction<any, any>, completePromise?: ?Promise<any>) => void,
    onSearchGroupResultCountRetrievalFailedInner: (error: number, dataEntryKey: string, groupId: string, completePromise?: ?Promise<any>, onSearchGroupResultCountRetrieved: ?Function) => void,
    onSearchGroupResultCountRetrievalFailed: ?(innerAction: ReduxAction<any, any>, completePromise?: ?Promise<any>) => void,
    onCleanUp?: ?(remainingPromises: Array<Promise<any>>) => void,
};

type SearchGroupsGetter = (props: Props) => Array<InputSearchGroup>;
type SearchContextGetter = (props: Props) => Object;

type SearchGroupPromises = {
    completePromise: Promise<any>,
    completePromiseResolver: () => void,
    currentSearchCancelablePromise: CancelablePromise<any>,
};

const searchGroupsPromises: { [dataEntryKey: string]: { [groupId: string]: ?SearchGroupPromises }} = {};

const getSearchGroupsHOC = (
    InnerComponent: React.ComponentType<any>,
    onGetSearchGroups: SearchGroupsGetter,
    onGetSearchContext: ?SearchContextGetter,
    keepPromisesAliveOnUnmount: boolean,
) => {
    class SearchGroupPostHOC extends React.PureComponent<Object> {
        render() {
            return (
                <InnerComponent
                    {...this.props}
                />
            );
        }
    }

    // eslint-disable-next-line react/no-multi-comp
    class SearchGroupsHOC extends React.Component<Props> {
        static getServerValues(
            updatedFormValues: Object,
            foundation: RenderFoundation,
        ) {
            const convertFn = pipe(
                convertFormToClient,
                convertClientToServer,
            );

            const serverValues = foundation.convertValues(updatedFormValues, convertFn);
            return serverValues;
        }

        searchGroups: Array<InputSearchGroup>;
        constructor(props: Props) {
            super(props);
            this.searchGroups = onGetSearchGroups(this.props);
        }

        componentWillUnmount() {
            if (!keepPromisesAliveOnUnmount) {
                this.props.onCleanUp && this.props.onCleanUp(this.cleanUpPromises());
            }
        }

        cleanUpPromises() {
            const { dataEntryKey } = this.props;
            const currentSearchGroupsPromises = searchGroupsPromises[dataEntryKey] || {};
            const remainingCompletePromises: Array<Promise<any>> = Object
                .keys(currentSearchGroupsPromises)
                .map((key) => {
                    const { currentSearchCancelablePromise, completePromise } =
                        currentSearchGroupsPromises[key] || {};
                    currentSearchCancelablePromise && currentSearchCancelablePromise.cancel();
                    return completePromise;
                })
                .filter(promise => !!promise);
            searchGroupsPromises[dataEntryKey] = {};
            return remainingCompletePromises;
        }

        getSearchGroupsForField(
            fieldId: string,
            updatesValues: Object,
        ) {
            return this
                .searchGroups
                .filter((searchGroup) => {
                    const searchFoundation = searchGroup.searchFoundation;
                    const elements = searchFoundation.getElements();
                    if (elements.find(e => e.id === fieldId)) {
                        const elementsWithValue = elements
                            .filter(e => updatesValues[e.id]);
                        return elementsWithValue.length >= searchGroup.minAttributesRequiredToSearch;
                    }
                    return false;
                });
        }

        executeSearch(
            searchGroupForField: InputSearchGroup,
            updatedFormValues: Object,
        ) {
            const {
                onSearchGroupResultCountRetrievedInner,
                onSearchGroupResultCountRetrieved,
                onSearchGroupResultCountRetrievalFailedInner,
                onSearchGroupResultCountRetrievalFailed,
                dataEntryKey,
            } = this.props;
            const searchGroupId = searchGroupForField.id;

            const promiseContainer = (
                searchGroupsPromises[dataEntryKey] && searchGroupsPromises[dataEntryKey][searchGroupId]
            ) || {};
            if (!promiseContainer.completePromise) {
                promiseContainer.completePromise = new Promise((resolve) => {
                    promiseContainer.completePromiseResolver = resolve;
                });
            }
            promiseContainer.currentSearchCancelablePromise && promiseContainer.currentSearchCancelablePromise.cancel();
            promiseContainer.currentSearchCancelablePromise = makeCancelablePromise(searchGroupForField
                .onSearch(
                    SearchGroupsHOC.getServerValues(updatedFormValues, searchGroupForField.searchFoundation),
                    onGetSearchContext ? onGetSearchContext(this.props) : {},
                ),
            );
            promiseContainer.currentSearchCancelablePromise
                .promise
                .then((result) => {
                    onSearchGroupResultCountRetrievedInner(
                        result,
                        dataEntryKey,
                        searchGroupId,
                        promiseContainer.completePromise,
                        onSearchGroupResultCountRetrieved,
                    );
                    promiseContainer.completePromiseResolver();
                    searchGroupsPromises[dataEntryKey][searchGroupId] = null;
                })
                .catch((reason) => {
                    if (!reason.isCanceled) {
                        log.error({ reason });
                        onSearchGroupResultCountRetrievalFailedInner(
                            i18n.t('search group result could not be retrieved'),
                            dataEntryKey,
                            searchGroupId,
                            promiseContainer.completePromise,
                            onSearchGroupResultCountRetrievalFailed,
                        );
                    }
                });
            if (!searchGroupsPromises[dataEntryKey]) {
                searchGroupsPromises[dataEntryKey] = {};
            }
            searchGroupsPromises[dataEntryKey][searchGroupId] = promiseContainer;
            return promiseContainer.completePromise;
        }

        handleFieldUpdate = (
            fieldId: string,
            value: any,
            innerAction: ReduxAction<any, any>,
            updateCompletePromise: ?Promise<any>,
        ) => {
            const { values } = this.props;
            const updatedFormValues = {
                ...values,
                [fieldId]: value,
            };

            const searchGroupsForField = this.getSearchGroupsForField(fieldId, updatedFormValues);
            const searchCompletePromises = searchGroupsForField
                .map(searchGroup => this.executeSearch(searchGroup, updatedFormValues));
            this.props.onUpdateFormField(
                fieldId,
                value,
                innerAction,
                updateCompletePromise,
                searchCompletePromises,
            );
        }

        render() {
            const {
                dataEntryKey,
                values,
                onUpdateFormField,
                onSearchGroupResultCountRetrievedInner,
                onSearchGroupResultCountRetrieved,
                onSearchGroupResultCountRetrievalFailedInner,
                onSearchGroupResultCountRetrievalFailed,
                ...passOnProps
            } = this.props;

            return (
                <SearchGroupPostHOC
                    onUpdateFormField={this.handleFieldUpdate}
                    {...passOnProps}
                />
            );
        }
    }

    return SearchGroupsHOC;
};

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const dataEntryKey = getDataEntryKey(props.id, itemId);

    return {
        dataEntryKey,
        values: state.formsValues[dataEntryKey] || {},
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateFormField: (fieldId: string, value: any, innerAction: ReduxAction<any, any>) => {
        dispatch(innerAction);
    },
    onSearchGroupResultCountRetrievedInner: (
        count: number,
        dataEntryKey: string,
        groupId: string,
        completePromise?: ?Promise<any>,
        onSearchGroupResultCountRetrieved: ?Function,
    ) => {
        const action = searchGroupResultCountRetrieved(count, dataEntryKey, groupId);
        if (onSearchGroupResultCountRetrieved) {
            onSearchGroupResultCountRetrieved(action, completePromise);
        } else {
            dispatch(action);
        }
    },
    onSearchGroupResultCountRetrievalFailedInner: (
        error: string,
        dataEntryKey: string,
        groupId: string,
        completePromise?: ?Promise<any>,
        onSearchGroupResultCountRetrievalFailed: ?Function,
    ) => {
        const action = searchGroupResultCountRetrievalFailed(error, dataEntryKey, groupId);
        if (onSearchGroupResultCountRetrievalFailed) {
            onSearchGroupResultCountRetrievalFailed(action, completePromise);
        } else {
            dispatch(action);
        }
    },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const defaultMergedProps = Object.assign({}, ownProps, stateProps, dispatchProps);

    const mergedProps =
        ownProps.onUpdateFormField ?
            { ...defaultMergedProps, onUpdateFormField: ownProps.onUpdateFormField } :
            defaultMergedProps;

    return mergedProps;
};

export default (
    onGetSearchGroups: SearchGroupsGetter,
    onGetSearchContext?: ?SearchContextGetter,
    keepPromisesAliveOnUnmount: boolean = false,
) =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps, mergeProps)(
            getSearchGroupsHOC(InnerComponent, onGetSearchGroups, onGetSearchContext, keepPromisesAliveOnUnmount));
