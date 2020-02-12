// @flow
import { connect } from 'react-redux';
import {
    preCleanData,
    selectTemplate,
    fetchTemplates,
    initEventList,
    updateEventList,
} from './workingLists.actions';
import WorkingListsContextBuilder from './WorkingListsContextBuilder.component';

type OwnProps = {|
    listId: string,
|};

type StateProps = {|
    selectedTemplate: ?Object,
    templates: ?Object,
    eventListIsLoading: boolean,
    loadTemplatesError: ?string,
    loadEventListError: ?string,
|};

type DispatchProps = {|
    onSelectTemplate: Function,
    onLoadTemplates: Function,
    onPreCleanData: Function,
    onLoadEventList: Function,
    onUpdateEventList: Function,
|};

type Props = {
   ...OwnProps,
   ...StateProps,
   ...DispatchProps,
};

type MapStateToPropsFactory = (ReduxState, OwnProps) => StateProps;
const mapStateToProps: MapStateToPropsFactory = (state: ReduxState, props: { listId: string }) => {
    const listId = props.listId;
    return {
        selectedTemplate: state.workingListsTemplates[listId] &&
            state.workingListsTemplates[listId].selectedTemplateId &&
            state.workingListsTemplates[listId].templates &&
            state.workingListsTemplates[listId].templates.find(template => template.id === state.workingListsTemplates[listId].selectedTemplateId),
        templates: state.workingListsTemplates[listId] &&
        state.workingListsTemplates[listId].templates,
        eventListIsLoading: !state.workingListsUI[listId] || state.workingListsUI[listId].isLoading === undefined || !!state.workingListsUI[listId].isLoading,
        loadTemplatesError: state.workingListsTemplates[listId] && state.workingListsTemplates[listId].loadError,
        loadEventListError: state.workingListsUI[listId] && state.workingListsUI[listId].dataLoadingError,
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
    };
};

export default connect<Props, OwnProps, _, _, _, _>(
    mapStateToProps, mapDispatchToProps)(
        WorkingListsContextBuilder);
