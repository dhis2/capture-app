// @flow
// HOC for adding search group actions to field updates (async and sync)
import * as React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { InputSearchGroup } from '../../metaData';
import getDataEntryKey from './common/getDataEntryKey';
import {
    filterSearchGroupForCountSearch,
    filterSearchGroupForCountSearchToBeExecuted,
    startAsyncUpdateField,
} from './actions/searchGroup.actions';
import {
    updateFieldAndRunSearchGroupSearchesBatch,
    asyncUpdateSuccessBatch,
} from './actions/searchGroup.actionBatches';

type Props = {
    dataEntryKey: string,
    onUpdateFormFieldInner: Function,
    onUpdateFormField: ?Function,
    onUpdateFormFieldInnerAsync: Function,
    onUpdateFormFieldAsync: ?Function,
};

type SearchGroupsGetter = (props: Props) => Array<InputSearchGroup>;
type SearchContextGetter = (props: Props) => Object;

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
        searchGroups: Array<InputSearchGroup>;
        constructor(props: Props) {
            super(props);
            this.searchGroups = onGetSearchGroups(this.props);
        }

        getFilterActions(
        ) {
            const { dataEntryKey } = this.props;
            const searchGroups = this.searchGroups;
            const searchContext = (onGetSearchContext && onGetSearchContext(this.props)) || {};

            const searchUids = searchGroups
                .map(() => uuid());

            const filterActions = searchGroups
                .map((sg, index) => filterSearchGroupForCountSearch(
                    sg,
                    searchUids[index],
                    dataEntryKey,
                    searchContext,
                ));

            const filterActionsToBeExecuted = filterActions.map(fa => filterSearchGroupForCountSearchToBeExecuted(fa));

            return {
                filterActions,
                filterActionsToBeExecuted,
            };
        }

        handleFieldUpdate = (
            innerAction: ReduxAction<any, any>,
        ) => {
            const { onUpdateFormField, onUpdateFormFieldInner } = this.props;

            onUpdateFormFieldInner(
                innerAction,
                this.getFilterActions(),
                onUpdateFormField,
            );
        }

        handleAsyncFieldUpdate = (...args) => {
            const { onUpdateFormFieldAsync, onUpdateFormFieldInnerAsync } = this.props;
            onUpdateFormFieldInnerAsync(
                ...args,
                this.getFilterActions(),
                onUpdateFormFieldAsync,
            );
        }

        render() {
            const {
                dataEntryKey,
                onUpdateFormField,
                onUpdateFormFieldInner,
                onUpdateFormFieldAsync,
                onUpdateFormFieldInnerAsync,
                ...passOnProps
            } = this.props;

            return (
                <SearchGroupPostHOC
                    onUpdateFormField={this.handleFieldUpdate}
                    onUpdateFormFieldAsync={this.handleAsyncFieldUpdate}
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
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateFormFieldInner: (
        innerAction: ReduxAction<any, any>,
        searchGroupActionsContainer: {
            filterActions: Array<ReduxAction<any, any>>,
            filterActionsToBeExecuted: Array<ReduxAction<any, any>>,
        },
        onUpdateFormField: ?Function,
    ) => {
        const { filterActions, filterActionsToBeExecuted } = searchGroupActionsContainer;
        if (onUpdateFormField) {
            onUpdateFormField(
                innerAction,
                { filterActions, filterActionsToBeExecuted },
            );
        } else {
            dispatch(updateFieldAndRunSearchGroupSearchesBatch(innerAction, filterActions, filterActionsToBeExecuted));
        }
    },
    onUpdateFormFieldInnerAsync: (
        innerAction: ReduxAction<any, any>,
        dataEntryId: string,
        itemId: string,
        searchGroupActionsContainer: {
            filterActions: Array<ReduxAction<any, any>>,
            filterActionsToBeExecuted: Array<ReduxAction<any, any>>,
        },
        onUpdateFormFieldAsync: ?Function,
    ) => {
        const { filterActions, filterActionsToBeExecuted } = searchGroupActionsContainer;
        if (onUpdateFormFieldAsync) {
            onUpdateFormFieldAsync(
                innerAction,
                { filterActions, filterActionsToBeExecuted },
                dataEntryId,
                itemId,
            );
        } else {
            const onAsyncUpdateSuccess = (successInnerAction: ReduxAction<any, any>) =>
                asyncUpdateSuccessBatch(successInnerAction, filterActions, filterActionsToBeExecuted);
            const onAsyncUpdateError = (errorInnerAction: ReduxAction<any, any>) => errorInnerAction;

            dispatch(startAsyncUpdateField(innerAction, onAsyncUpdateSuccess, onAsyncUpdateError));
        }
    },
});

export default (
    onGetSearchGroups: SearchGroupsGetter,
    onGetSearchContext?: ?SearchContextGetter,
) =>
    (InnerComponent: React.ComponentType<any>) =>
        // $FlowSuppress
        connect(
            mapStateToProps, mapDispatchToProps)(
            getSearchGroupsHOC(InnerComponent, onGetSearchGroups, onGetSearchContext));
