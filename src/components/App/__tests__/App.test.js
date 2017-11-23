import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import LoadingMask from 'd2-ui/lib/loading-mask/LoadingMask.component';

import { setD2 } from 'd2-tracker/d2/d2Instance';

import App from '../App.component';
import { MuiThemeProvider } from 'material-ui-next/styles';
import AppContents from '../AppContents.component';

jest.mock('d2-ui/lib/app-header/HeaderBar', () => ({ default: () => null }));
jest.mock('d2-ui/lib/app-header/headerBar.store', () => ({ default: jest.fn() }));
jest.mock('d2-ui/lib/component-helpers/withStateFrom', () => {
    function withStateFrom() {
        return () => null;
    }
    return withStateFrom;
});



/*
it('render loader', () => {
    setD2({});
    const div = document.createElement('div');
    ReactDOM.render(<App ready={false} store={{}}  />, div);
});

it('render app without crashing', () => {
    setD2({});
    const div = document.createElement('div');
    ReactDOM.render(<App ready store={{}} />, div);
});

it('verify Loader is present if not ready', () => {
    const app = shallow(
        <App ready={false} />,
    );
    expect(app.find(LoadingMask)).toHaveLength(1);
});
*/

it('verify LoadingIndicator is found is found if ready', () => {
    const app = shallow(
        <App />,
    );
    //console.log(app.debug());
    expect(app.find('Connect(LoadingIndicator)')).toHaveLength(1);
});


