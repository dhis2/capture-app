// @flow
import * as React from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import { withStyles } from '@material-ui/core/styles';
import Button from './Button.component';
import ProgressButton from './ProgressButton.component';

const styles = () => ({
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    arrowButton: {
        padding: 0,
        minWidth: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
    },
    button: {
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
});

type Props = {
    color: string,
    variant: string,
    buttonType: string,
    buttonText: string,
    buttonProps: Object,
    arrowProps: Object,
    dropDownItems: [{ key: string, text: string, onClick: () => void }],
    classes: {buttonsContainer: string, arrowButton: string, button: string }
};

type State = {
    menuOpen: boolean,
    anchorElement: ?Object,
}

class MultiButton extends React.Component<Props, State> {
    buttonInstance: ?Object;
    arrowInstance: ?Object;
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            anchorElement: null,
        };
    }

    getMenuItems = () => this.props.dropDownItems.map(item =>
        (<MenuItem
            key={item.key}
            onClick={item.onClick}
        >
            {item.text}
        </MenuItem>),
    )

    toggleMenu = () => {


        this.setState({
            menuOpen: !this.state.menuOpen,
            anchorElement: this.buttonInstance,
        });
    }

    render() {
        const { classes, color, variant } = this.props;
        const arrowButtonProps = { color, variant, ...this.props.arrowProps };
        const buttonProps = { color, variant, ...this.props.buttonProps };
        return (
            <div>
                <div className={classes.buttonsContainer} ref={(buttonInstance) => { this.buttonInstance = buttonInstance; }}>
                    <div>
                        {this.props.buttonType === 'progress' ?
                            <ProgressButton
                                className={classes.button}
                                {...buttonProps}
                            >
                                {this.props.buttonText}
                            </ProgressButton> :
                            <Button
                                className={classes.button}
                                {...buttonProps}
                            >
                                {this.props.buttonText}
                            </Button>}
                    </div>
                    <div ref={(arrowInstance) => { this.arrowInstance = arrowInstance; }}>
                        <Button onClick={this.toggleMenu} className={classes.arrowButton} variant={variant} color={color} {...arrowButtonProps}>
                            {this.state.menuOpen ? <ArrowDropUp /> : <ArrowDropDown /> }
                        </Button>
                    </div>

                </div>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorElement}
                    getContentAnchorEl={null}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={this.state.menuOpen}
                    onClose={this.toggleMenu}
                >
                    {this.getMenuItems()}
                </Menu>
            </div>

        );
    }
}

export default withStyles(styles)(MultiButton);

