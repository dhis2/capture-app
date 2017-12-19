// @flow
import React, { Component } from 'react';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

// TEST
import { withStyles } from 'material-ui-next/styles';
import Button from 'material-ui-next/Button';
import EventForm from '../EventForm/EventForm.component';
import D2Form from 'd2-tracker/components/D2Form/D2Form.component';
import programCollection from 'd2-tracker/metaData/programCollection/programCollection';

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
                    <D2Form
                        metaDataStage={Array.from(programCollection.get('IpHINAT79UW').stages.entries())[0][1]}
                    />
                </div>
            </div>
        );
    }
}

AppContents.propTypes = {

};

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
