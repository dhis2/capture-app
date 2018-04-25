import React, { Component } from 'react';

import Button from 'material-ui-next/Button';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import SearchIcon from 'material-ui-icons/Search';

export default class ActionButtons extends Component {
    constructor(props) {
        super(props);
        this.handleClickReset = this.handleClickReset.bind(this);
    }

    handleClickReset() {
        this.props.handleClickReset();
    }

    render() {
        return (
            <div style={{ flexGrow: 1, padding: 10, textAlign: 'right' }}>
                <Button onClick={() => this.handleClickReset()} raised color="primary" style={{ float: 'left' }}>Reset</Button>
                <Button raised color="primary"><AddIcon style={{ marginRight: 5 }} /> New</Button>
                <Button raised color="primary"><SearchIcon style={{ marginRight: 5 }} /> Find</Button>
            </div>
        );
    }
}
