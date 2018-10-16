// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DataEntrySelectionsComplete from '../SelectionsComplete/SelectionsComplete.container';
import DataEntrySelectionsIncomplete from '../SelectionsIncomplete/DataEntrySelectionsIncomplete.container';

const getStyles = () => ({

});

type Props = {
    isSelectionsComplete: boolean,
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
            <DataEntrySelectionsComplete />
        );
    }
    render() {
        return (
            <div>
                {this.renderContents()}
            </div>
        );
    }
}

export default withStyles(getStyles)(IsSelectionsCompleteLevel);
