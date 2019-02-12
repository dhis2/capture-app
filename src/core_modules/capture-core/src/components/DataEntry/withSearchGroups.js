// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { InputSearchGroup } from '../../metaData';
import getDataEntryKey from './common/getDataEntryKey';
import { filterSearchGroupForCountSearch, filterSearchGroupForCountSearchToBeExecuted } from './actions/searchGroup.actions';
import { updateFieldAndRunSearchGroupSearchesBatch } from './actions/searchGroup.actionBatches';

type Props = {
    dataEntryKey: string,
    onUpdateFormFieldInner: Function,
    onUpdateFormField: ?Function,
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

        handleFieldUpdate = (
            innerAction: ReduxAction<any, any>,
        ) => {
            const { onUpdateFormField, onUpdateFormFieldInner, dataEntryKey } = this.props;
            const searchGroupsForField = this.searchGroups || [];

            onUpdateFormFieldInner(
                innerAction,
                searchGroupsForField,
                dataEntryKey,
                onGetSearchContext && onGetSearchContext(this.props),
                onUpdateFormField,
            );
        }

        render() {
            const {
                dataEntryKey,
                onUpdateFormField,
                onUpdateFormFieldInner,
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
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateFormFieldInner: (
        innerAction: ReduxAction<any, any>,
        searchGroups: Array<InputSearchGroup>,
        dataEntryKey: string,
        searchContext: Object,
        onUpdateFormField: ?Function,
    ) => {
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

        if (onUpdateFormField) {
            onUpdateFormField(
                innerAction,
                { filterActions, filterActionsToBeExecuted },
            );
        } else {
            dispatch(updateFieldAndRunSearchGroupSearchesBatch(innerAction, filterActions, filterActionsToBeExecuted));
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
