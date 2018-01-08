// @flow
import React, { Component } from 'react';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

import { withStyles } from 'material-ui-next/styles';
import EventCaptureForm from '../EventCaptureForm/EventCaptureForm.component';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const styles = theme => ({
   
});

class AppContents extends Component {
    render() {
        return (
            <div>
                <div>
                    <HeaderBar />
                </div>
                {
                /*
                <div style={{padding: 400}}>
                    <Button color="primary">
                        Primary
                    </Button>                    
                </div>
                */
                }
                <div style={{padding: 100}}>
                    <EventCaptureForm />
                </div>
                <div>
                    
                </div>
            </div>
        );
    }
}

AppContents.propTypes = {

};

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
