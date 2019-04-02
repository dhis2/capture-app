// @flow
import * as React from 'react';
import DataEntry from './DataEntry/DataEntry.container';
import { RegistrationSection } from './RegistrationSection';

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

export default RegisterTei;
