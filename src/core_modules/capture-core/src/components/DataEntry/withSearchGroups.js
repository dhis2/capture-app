// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { pipe } from 'capture-core-utils';
import { InputSearchGroup, RenderFoundation } from '../../metaData';
import getDataEntryKey from './common/getDataEntryKey';
import { convertFormToClient, convertClientToServer } from '../../converters';
import { searchGroupResultCountRetrieved } from './actions/searchGroup.actions';

type Props = {
    dataEntryKey: string,
    values: Object,
    onUpdateFormField: (fieldId: string, value: any, innerAction: ReduxAction<any, any>, updateCompletePromise: ?Promise<any>, searchCompletePromises: ?Array<Promise<any>>) => void,
    onSearchGroupResultCountRetrievedInner: (count: number, dataEntryKey: string, groupId: string, completePromise?: ?Promise<any>, onSearchGroupResultCountRetrieved: ?Function) => void,
    onSearchGroupResultCountRetrieved: ?(innerAction: ReduxAction<any, any>, completePromise?: ?Promise<any>) => void,
};

type SearchGroupsGetter = (props: Props) => Array<InputSearchGroup>;
type SearchContextGetter = (props: Props) => Object;

type SearchGroupPromises = {
    completePromise: Promise<any>,
    completePromiseResolver: () => void,
    currentSearchPromise: Promise<any>,
};

const getSearchGroupsHOC = (
    InnerComponent: React.ComponentType<any>,
    onGetSearchGroups: SearchGroupsGetter,
    onGetSearchContext: ?SearchContextGetter,
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
        searchGroupsPromises: { [groupId: string]: ?SearchGroupPromises };
        constructor(props: Props) {
            super(props);
            this.searchGroups = onGetSearchGroups(this.props);
            this.searchGroupsPromises = {};
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
                dataEntryKey,
            } = this.props;
            const searchGroupId = searchGroupForField.id;

            const promiseContainer = this.searchGroupsPromises[searchGroupId] || {};
            if (!promiseContainer.completePromise) {
                promiseContainer.completePromise = new Promise((resolve) => {
                    promiseContainer.completePromiseResolver = resolve;
                });
            }

            promiseContainer.currentSearchPromise = searchGroupForField
                .onSearch(
                    SearchGroupsHOC.getServerValues(updatedFormValues, searchGroupForField.searchFoundation),
                    onGetSearchContext ? onGetSearchContext(this.props) : {},
                )
                .then((result) => {
                    if (promiseContainer.currentSearchPromise ===
                        (this.searchGroupsPromises[searchGroupId] &&
                        this.searchGroupsPromises[searchGroupId].currentSearchPromise)) {
                        onSearchGroupResultCountRetrievedInner(
                            result,
                            dataEntryKey,
                            searchGroupId,
                            promiseContainer.completePromise,
                            onSearchGroupResultCountRetrieved,
                        );
                        promiseContainer.completePromiseResolver();
                        this.searchGroupsPromises[searchGroupId] = null;
                    }
                });
            this.searchGroupsPromises[searchGroupId] = promiseContainer;
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
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const defaultMergedProps = Object.assign({}, ownProps, stateProps, dispatchProps);

    const mergedProps =
        ownProps.onUpdateFormField ?
            { ...defaultMergedProps, onUpdateFormField: ownProps.onUpdateFormField } :
            defaultMergedProps;

    return mergedProps;
};

export default (onGetSearchGroups: SearchGroupsGetter, onGetSearchContext?: ?SearchContextGetter) =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps, mergeProps)(
            getSearchGroupsHOC(InnerComponent, onGetSearchGroups, onGetSearchContext));
