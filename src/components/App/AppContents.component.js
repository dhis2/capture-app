// @flow
import React, { Component } from 'react';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

// TEST
import { withStyles } from 'material-ui-next/styles';
import Button from 'material-ui-next/Button';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

const styles = theme => ({
    danger: {
        color: theme.status.danger,
    },
});

class AppContents extends Component {
    render() {
        return (
            <div>
                <div>
                    <HeaderBar />
                </div>
                <div className={this.props.classes.danger} style={{padding: 400}}>
                    <Button color="primary">
                        Primary
                    </Button>
                </div>
            </div>
        );
    }
}

AppContents.propTypes = {

};

const AppContentsWithStyles = withStyles(styles)(AppContents);

export default AppContentsWithStyles;
