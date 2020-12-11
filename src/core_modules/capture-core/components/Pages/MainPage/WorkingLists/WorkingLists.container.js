// @flow
import { connect } from 'react-redux';
import {
    selectTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    fetchTemplates,
    fetchTemplatesCancel,
    initEventList,
    initEventListCancel,
    updateEventList,
    updateEventListCancel,
    cleanSkipInitAddingTemplate,
    unloadingContext,
} from './workingLists.actions';
import WorkingListsContextBuilder from './WorkingListsContextBuilder.component';

type OwnProps = {|
    listId: string,
    programId: string,
    orgUnitId: string,
    categories: Object,
    lastTransaction: number,
    listContext: ?Object,
    defaultConfig: Object,
    onCheckSkipReload: Function,
|};

type StateProps = {|
    currentTemplate: ?Object,
    templates: ?Object,
    templatesForProgramId: ?string,
    templatesAreLoading: boolean,
    loadTemplatesError: ?string,
    loadEventListError: ?string,
    listMeta: ?Object,
    columnOrder: ?Array<Object>,
    eventsData: ?Object,
    eventListIsLoading: boolean,
    eventListIsUpdating: boolean,
    eventListIsUpdatingWithDialog: boolean,
    lastEventIdDeleted: ?string,
|};

type DispatchProps = {|
    onSelectTemplate: Function,
    onLoadTemplates: Function,
    onLoadEventList: Function,
    onUpdateEventList: Function,
    onCancelLoadEventList: Function,
    onCancelUpdateEventList: Function,
    onCancelLoadTemplates: Function,
    onAddTemplate: Function,
    onUpdateTemplate: Function,
    onDeleteTemplate: Function,
    onCleanSkipInitAddingTemplate: Function,
    onUnloadingContext: Function,
|};

type Props = {
   ...OwnProps,
   ...StateProps,
   ...DispatchProps,
};

type MapStateToPropsFactory = (ReduxState, OwnProps) => StateProps;
// eslint-disable-next-line complexity
const mapStateToProps: MapStateToPropsFactory = (state: ReduxState, props: { listId: string }) => {
    const {listId} = props;
    return {
        currentTemplate: state.workingListsTemplates[listId] &&
            state.workingListsTemplates[listId].selectedTemplateId &&
            state.workingListsTemplates[listId].templates &&
            state.workingListsTemplates[listId].templates.find(template => template.id === state.workingListsTemplates[listId].selectedTemplateId),
        templates: state.workingListsTemplates[listId] &&
        state.workingListsTemplates[listId].templates,
        templatesForProgramId: state.workingListsTemplates[listId] &&
        state.workingListsTemplates[listId].programId,
        templatesAreLoading: !!state.workingListsTemplates[listId] &&
        !!state.workingListsTemplates[listId].loading,
        loadTemplatesError: state.workingListsTemplates[listId] && state.workingListsTemplates[listId].loadError,
        loadEventListError: state.workingListsUI[listId] && state.workingListsUI[listId].dataLoadingError,
        listMeta: state.workingListsMeta[listId],
        columnOrder: state.workingListsColumnsOrder[listId],
        eventsData: state.workingLists[listId],
        eventListIsLoading: !!state.workingListsUI[listId] && !!state.workingListsUI[listId].isLoading,
        eventListIsUpdating: !!state.workingListsUI[listId] && !!state.workingListsUI[listId].isUpdating,
        eventListIsUpdatingWithDialog: !!state.workingListsUI[listId] && !!state.workingListsUI[listId].isUpdatingWithDialog,
        lastEventIdDeleted: state.workingListsUI[listId] && state.workingListsUI[listId].lastEventIdDeleted,
    };
};

type MapDispatchToPropsFactory = (ReduxDispatch) => DispatchProps;
const mapDispatchToProps: MapDispatchToPropsFactory = (dispatch: ReduxDispatch) => {
    const basicDispatcher = actionCreator => (...params) => dispatch(actionCreator(...params));
    return {
        onSelectTemplate: basicDispatcher(selectTemplate),
        onLoadTemplates: basicDispatcher(fetchTemplates),
        onLoadEventList: basicDispatcher(initEventList),
        onUpdateEventList: basicDispatcher(updateEventList),
        onCancelLoadEventList: basicDispatcher(initEventListCancel),
        onCancelUpdateEventList: basicDispatcher(updateEventListCancel),
        onCancelLoadTemplates: basicDispatcher(fetchTemplatesCancel),
        onAddTemplate: basicDispatcher(addTemplate),
        onUpdateTemplate: basicDispatcher(updateTemplate),
        onDeleteTemplate: basicDispatcher(deleteTemplate),
        onCleanSkipInitAddingTemplate: basicDispatcher(cleanSkipInitAddingTemplate),
        onUnloadingContext: basicDispatcher(unloadingContext),
    };
};

export default connect<Props, OwnProps, _, _, _, _>(
    mapStateToProps, mapDispatchToProps)(
    WorkingListsContextBuilder);
