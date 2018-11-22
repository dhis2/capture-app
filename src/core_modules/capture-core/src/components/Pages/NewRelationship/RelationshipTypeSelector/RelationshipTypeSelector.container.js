// @flow
import { connect } from 'react-redux';
import NewRelationship from './NewRelationship.component';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';

const relationshipTypes = {
    EVENT: 'EVENT',
    TRACKEDENTITYINSTANCE: 'TRACKEDENTITYINSTANCE',
    ENROLLMENT: 'ENROLLMENT',
};

const getRelationshipTypesByType = {
    [relationshipTypes.EVENT]: (relationshipFrom: any) => {
        const program = programCollection
            .get(relationshipFrom.program)
            .getStage()
            .

    }
}


function getRelationshipTypes(relationshipFrom: any) {
    
}


const mapStateToProps = (state: ReduxState) => {
    const relationship = state.newRelationshipPage.relationshipFrom;
    return {
    };
}

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(NewRelationship);