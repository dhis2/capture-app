// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { InputSearchGroup } from '../../metaData';
import getDataEntryKey from './common/getDataEntryKey';
import { startSearchGroupCountSearch } from './actions/searchGroup.actions';
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
            fieldId: string,
            value: any,
            innerAction: ReduxAction<any, any>,
            updateCompletePromise: ?Promise<any>,
        ) => {
            const { onUpdateFormField, onUpdateFormFieldInner, dataEntryKey } = this.props;
            const searchGroupsForField = this.searchGroups;

            onUpdateFormFieldInner(
                fieldId,
                value,
                innerAction,
                updateCompletePromise,
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
        fieldId: string,
        value: any,
        innerAction: ReduxAction<any, any>,
        updateCompletePromise: ?Promise<any>,
        searchGroups: Array<InputSearchGroup>,
        dataEntryKey: string,
        searchContext: Object,
        onUpdateFormField: ?Function,
    ) => {
        const searchCompletePromises = searchGroups
            .map(() => {
                let resolver;
                const promise = new Promise((resolve) => {
                    resolver = resolve;
                });
                return {
                    resolver,
                    promise,
                };
            });

        const searchActions = searchGroups
            .map((sg, index) => startSearchGroupCountSearch(
                sg,
                searchCompletePromises[index],
                dataEntryKey,
                searchContext,
            ));

        if (onUpdateFormField) {
            onUpdateFormField(
                fieldId,
                value,
                innerAction,
                updateCompletePromise,
                { searchActions, searchCompletePromises },
            );
        } else {
            dispatch(updateFieldAndRunSearchGroupSearchesBatch(innerAction, searchActions));
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
