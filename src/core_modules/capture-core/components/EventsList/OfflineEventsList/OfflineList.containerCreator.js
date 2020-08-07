// @flow
import { connect } from 'react-redux';
import {
    makeColumnsSelector,
    makeCreateEventsContainer,
    makeCreateWorkingListData,
} from './offlineList.selector';

const makeMapStateToProps = () => {
    const columnsSelector = makeColumnsSelector();
    const createEventsContainer = makeCreateEventsContainer();
    const createWorkingListData = makeCreateWorkingListData();

    const mapStateToProps = (state: ReduxState, props: Object) => {
        const columns = columnsSelector(state, props);
        const eventsContainer = createEventsContainer(state, props);
        const sortById = state.workingListsMeta[props.listId].sortById;
        const sortByDirection = state.workingListsMeta[props.listId].sortByDirection;
        const rowIdKey = 'eventId';
        return {
            columns,
            rowIdKey,
            dataSource: createWorkingListData(eventsContainer, columns),
            sortById,
            sortByDirection,
        };
    };
    return mapStateToProps;
};

// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, {});
