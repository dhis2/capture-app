import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import { Tooltip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import classNames from 'classnames';

const ClearIcon = ({ className, ...props }) => (
    <svg
        className={className}
        {...props}
        viewBox="0 0 24 24"
        width={24}
        height={24}
    >
        <path
            d={`
                M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2
                M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7
            `}
        />
    </svg>
);

const getStyles: Readonly<any> = (theme: any) => ({
    button: {
        backgroundColor: 'rgb(184, 215, 243) !important',
    },
    hovered: {
        backgroundColor: 'rgb(114, 176, 231) !important',
    },
    clearIcon: {
        color: theme.palette.text.secondary,
        '&:hover': {
            color: theme.palette.text.primary,
        },
    },
});

type State = {
    isHovered: boolean;
};

type Props = {
    onChange: (event: any) => void;
    onClear: () => void;
    iconClass: string;
    title: string;
    arrowIconElement: React.ReactNode;
    buttonText?: string;
};

const MAX_LENGTH_OF_VALUE = 10;

class ActiveFilterButtonPlain extends React.Component<Props & WithStyles<typeof getStyles>, State> {
    static stopClearPropagation(event: React.SyntheticEvent<any>) {
        event.stopPropagation();
    }

    static getCappedValue(value: string): string {
        const cappedValue = value.substring(0, MAX_LENGTH_OF_VALUE - 3).trimRight();
        return `${cappedValue}...`;
    }
    static getViewValueForFilter(buttonText = ''): string {
        const calculatedValue = buttonText.length > MAX_LENGTH_OF_VALUE ?
            ActiveFilterButtonPlain.getCappedValue(buttonText) :
            buttonText;
        return `: ${calculatedValue}`;
    }

    constructor(props: Props & WithStyles<typeof getStyles>) {
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

    handleClearClick = (event: React.MouseEvent<any>) => {
        event.stopPropagation();
        this.props.onClear();
    }

    render() {
        const { onChange, classes, iconClass, title, arrowIconElement, buttonText } = this.props;
        const isHovered = this.state.isHovered;
        const buttonClasses = classNames(classes.button, { [classes.hovered]: isHovered });

        return (
            <div
                onMouseEnter={this.setIsHovered}
                onMouseLeave={this.clearIsHovered}
            >
                <Button
                    className={buttonClasses}
                    onClick={onChange}
                >
                    {title}
                    {ActiveFilterButtonPlain.getViewValueForFilter(buttonText)}
                    {arrowIconElement}
                    <Tooltip
                        content={i18n.t('Clear')}
                        placement={'bottom'}
                        openDelay={300}
                    >
                        <ClearIcon
                            onMouseEnter={this.clearIsHovered}
                            onMouseLeave={this.setIsHovered}
                            className={classNames(iconClass, classes.clearIcon)}
                            onClick={this.handleClearClick}
                            onMouseDown={ActiveFilterButtonPlain.stopClearPropagation}
                            onMouseUp={ActiveFilterButtonPlain.stopClearPropagation}
                            onTouchStart={ActiveFilterButtonPlain.stopClearPropagation}
                            onTouchEnd={ActiveFilterButtonPlain.stopClearPropagation}
                            onTouchMove={ActiveFilterButtonPlain.stopClearPropagation}
                            onKeyDown={ActiveFilterButtonPlain.stopClearPropagation}
                            onKeyUp={ActiveFilterButtonPlain.stopClearPropagation}
                        />
                    </Tooltip>
                </Button>
            </div>
        );
    }
}

export const ActiveFilterButton = withStyles(getStyles)(ActiveFilterButtonPlain);
