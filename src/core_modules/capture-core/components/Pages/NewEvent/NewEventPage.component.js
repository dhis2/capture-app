// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DataEntrySelectionsComplete from './SelectionsComplete/SelectionsComplete.container';
import DataEntrySelectionsIncomplete from './SelectionsIncomplete/DataEntrySelectionsIncomplete.container';
import { TrackerProgramHandler } from '../../TrackerProgramHandler';
import { LockedSelector } from '../../LockedSelector/container';

const getStyles = () => ({

});

type Props = {
    isSelectionsComplete: boolean,
    formInputInProgess: boolean,
    inAddRelationship: boolean,
};

class IsSelectionsCompleteLevel extends React.Component<Props> {
    renderContents() {
        const { isSelectionsComplete } = this.props;
        if (!isSelectionsComplete) {
            return (
                <DataEntrySelectionsIncomplete />
            );
        }

        return (
            <TrackerProgramHandler>
                <DataEntrySelectionsComplete />
            </TrackerProgramHandler>
        );
    }
    render() {
        const { inAddRelationship, formInputInProgess } = this.props;
        return (
            <div>
                <LockedSelector formInputInProgess={formInputInProgess} inAddRelationship={inAddRelationship} />
                {this.renderContents()}
            </div>
        );
    }
}

export default withStyles(getStyles)(IsSelectionsCompleteLevel);
