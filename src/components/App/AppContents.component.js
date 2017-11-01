// @flow
import React, { Component } from 'react';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class AppContents extends Component {
    render() {
        return (
            <div>            
                <HeaderBar />
            </div>
        );
    }
}

AppContents.propTypes = {

};

export default AppContents;