// @flow
import * as React from 'react';
import DataEntry from './DataEntry/DataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import withStateBoundLoadingIndicator from '../../../../HOC/withStateBoundLoadingIndicator';

type Props = {};

class RegisterTei extends React.Component<Props> {
    render() {
        return (
            <React.Fragment>
                <RegistrationSection />
                <DataEntry />
            </React.Fragment>
        );
    }
}

export default withStateBoundLoadingIndicator((state: ReduxState) => !state.newRelationship.loading)(RegisterTei);
