import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import Button from 'material-ui-next/Button';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import SearchIcon from 'material-ui-icons/Search';

const styles = () => ({
    container: {
        flexGrow: 1,
        padding: 10,
        textAlign: 'right',
    },
    leftButton: {
        float: 'left',
    },
    rightButton: {
        marginRight: 5,
    },
});

class ActionButtons extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleClickActionButton();
    }

    render() {
        if (!this.props.selectedProgram && !this.props.selectedOrgUnit) {
            return (
                <div className={this.props.classes.container}>
                    <Button onClick={() => this.handleClick()} color="primary" className={this.props.classes.leftButton}>Reset</Button>
                </div>
            );
        }
        return (
            <div className={this.props.classes.container}>
                <Button onClick={() => this.handleClick()} color="primary" className={this.props.classes.leftButton}>Reset</Button>
                <Button onClick={() => this.handleClick()} color="primary"><AddIcon className={this.props.classes.rightButton} /> New</Button>
                <Button onClick={() => this.handleClick()} color="primary"><SearchIcon className={this.props.classes.rightButton} /> Find</Button>
            </div>
        );
    }
}

export default withStyles(styles)(ActionButtons);
