// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import ClearIcon from '@material-ui/icons/RemoveCircle';
import Tooltip from '@material-ui/core/Tooltip';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';
import Button from '../../../../../Buttons/Button.component';

const getStyles = (theme: Theme) => ({
    button: {
        backgroundColor: lighten(theme.palette.primary.light, 0.7),
        '&:hover': {
            backgroundColor: lighten(theme.palette.primary.light, 0.7),
        },
    },
    hovered: {
        backgroundColor: `${lighten(theme.palette.primary.light, 0.4)} !important`,
    },
    contents: {
        color: theme.palette.text.primary,
    },
    clearIcon: {
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.text.primary,
        },
    },
    label: {
        textTransform: 'none',
    },
});

type State = {
    isHovered: boolean,
};

type Props = {
    onChange: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
    onClear: () => void,
    classes: {
        button: string,
        hovered: string,
        contents: string,
        clearIcon: string,
        label: string,
    },
    iconClass: string,
    title: string,
    arrowIconElement: React.Node,
    filterValue: string,
};

const MAX_LENGTH_OF_VALUE = 6;

class ActiveFilterButton extends React.Component<Props, State> {
    static stopClearPropagation(event: SyntheticEvent<any>) {
        event.stopPropagation();
    }

    static getViewValueForFilter(filterValue: string) {
        return `: ${filterValue.length > MAX_LENGTH_OF_VALUE ? filterValue.substring(0, MAX_LENGTH_OF_VALUE) : filterValue}`;
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            isHovered: false,
        };
    }

    setIsHovered = () => {
        this.setState({
            isHovered: true,
        });
    }

    clearIsHovered = () => {
        this.setState({
            isHovered: false,
        });
    }

    handleClearClick = (event: SyntheticMouseEvent<any>) => {
        event.stopPropagation();
        this.props.onClear();
    }

    render() {
        const { onChange, onClear, classes, iconClass, title, arrowIconElement, filterValue } = this.props; //eslint-disable-line
        const isHovered = this.state.isHovered;
        const buttonClasses = classNames(classes.button, { [classes.hovered]: isHovered });

        return (
            <Button
                variant="text"
                color="default"
                size={'small'}
                classes={{ button: buttonClasses, contents: classes.contents }}
                muiClasses={{ label: classes.label }}
                onClick={onChange}
                onMouseEnter={this.setIsHovered}
                onMouseLeave={this.clearIsHovered}
            >
                {title}
                {ActiveFilterButton.getViewValueForFilter(filterValue)}
                {arrowIconElement}
                <Tooltip
                    title={i18n.t('Clear')}
                    placement={'bottom'}
                    enterDelay={300}
                >
                    <ClearIcon
                        onMouseEnter={this.clearIsHovered}
                        onMouseLeave={this.setIsHovered}
                        className={classNames(iconClass, classes.clearIcon)}
                        onClick={this.handleClearClick}
                        onMouseDown={ActiveFilterButton.stopClearPropagation}
                        onMouseUp={ActiveFilterButton.stopClearPropagation}
                        onTouchStart={ActiveFilterButton.stopClearPropagation}
                        onTouchEnd={ActiveFilterButton.stopClearPropagation}
                        onTouchMove={ActiveFilterButton.stopClearPropagation}
                        onKeyDown={ActiveFilterButton.stopClearPropagation}
                        onKeyUp={ActiveFilterButton.stopClearPropagation}
                    />
                </Tooltip>
            </Button>
        );
    }
}

export default withStyles(getStyles)(ActiveFilterButton);
