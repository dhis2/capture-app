// @flow
import { connect } from 'react-redux';
import {
    preCleanData,
    selectTemplate,
    fetchTemplates,
    fetchTemplatesCancel,
    initEventList,
    initEventListCancel,
    updateEventList,
    updateEventListCancel,
} from './workingLists.actions';
import WorkingListsContextBuilder from './WorkingListsContextBuilder.component';

type OwnProps = {|
    listId: string,
    skipReload: boolean,
    onResetSkipReload?: ?Function,
    defaultConfig: Object,
|};

type StateProps = {|
    selectedTemplate: ?Object,
    templates: ?Object,
    loadTemplatesError: ?string,
    loadEventListError: ?string,
    listMeta: ?Object,
    eventsData: ?Object,
    eventListIsLoading: boolean,
|};

type DispatchProps = {|
    onSelectTemplate: Function,
    onLoadTemplates: Function,
    onPreCleanData: Function,
    onLoadEventList: Function,
    onUpdateEventList: Function,
    onCancelLoadEventList: Function,
    onCancelUpdateEventList: Function,
    onCancelLoadTemplates: Function,
|};

type Props = {
   ...OwnProps,
   ...StateProps,
   ...DispatchProps,
};

type MapStateToPropsFactory = (ReduxState, OwnProps) => StateProps;
// eslint-disable-next-line complexity
const mapStateToProps: MapStateToPropsFactory = (state: ReduxState, props: { listId: string }) => {
    const listId = props.listId;
    return {
        selectedTemplate: state.workingListsTemplates[listId] &&
            state.workingListsTemplates[listId].selectedTemplateId &&
            state.workingListsTemplates[listId].templates &&
            state.workingListsTemplates[listId].templates.find(template => template.id === state.workingListsTemplates[listId].selectedTemplateId),
        templates: state.workingListsTemplates[listId] &&
        state.workingListsTemplates[listId].templates,
        loadTemplatesError: state.workingListsTemplates[listId] && state.workingListsTemplates[listId].loadError,
        loadEventListError: state.workingListsUI[listId] && state.workingListsUI[listId].dataLoadingError,
        listMeta: state.workingListsMeta[listId],
        eventsData: state.workingLists[listId],
        eventListIsLoading: !!state.workingListsUI[listId] && !!state.workingListsUI[listId].isLoading,
    };
};

type MapDispatchToPropsFactory = (ReduxDispatch) => DispatchProps;
const mapDispatchToProps: MapDispatchToPropsFactory = (dispatch: ReduxDispatch) => {
    const basicDispatcher = actionCreator => (...params) => dispatch(actionCreator(...params));
    return {
        onSelectTemplate: basicDispatcher(selectTemplate),
        onLoadTemplates: basicDispatcher(fetchTemplates),
        onPreCleanData: basicDispatcher(preCleanData),
        onLoadEventList: basicDispatcher(initEventList),
        onUpdateEventList: basicDispatcher(updateEventList),
        onCancelLoadEventList: basicDispatcher(initEventListCancel),
        onCancelUpdateEventList: basicDispatcher(updateEventListCancel),
        onCancelLoadTemplates: basicDispatcher(fetchTemplatesCancel),
    };
};

export default connect<Props, OwnProps, _, _, _, _>(
    mapStateToProps, mapDispatchToProps)(
    WorkingListsContextBuilder);
