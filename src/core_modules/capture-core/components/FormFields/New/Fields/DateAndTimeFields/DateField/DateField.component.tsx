import * as React from 'react';
import { withStyles, withTheme, WithStyles } from '@material-ui/core/styles';
import { IconButton, DateField as UIDateField, orientations } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import classNames from 'classnames';
import { systemSettingsStore } from '../../../../../../metaDataMemoryStores';

const getStyles = () => ({
    fieldsContainer: {
        display: 'flex',
    },
    fieldsContainerVertical: {
        flexDirection: 'column-reverse' as const,
        alignItems: 'center',
    },
    clearButton: {
        height: '40px',
        width: '40px',
        borderRadius: 0,
    },
});

type Props = {
    value?: any,
    disabled?: boolean,
    onBlur?: (value: any, options?: any) => void,
    orientation: string,
    width?: number,
};

const DateFieldPlain = (props: Props & WithStyles<typeof getStyles>) => {
    const {
        value,
        onBlur,
        disabled,
        orientation,
        classes,
        width = 350,
        ...passOnProps
    } = props;

    const handleClear = () => {
        onBlur && onBlur(null, {});
    };

    const isVertical = orientation === orientations.VERTICAL;

    const renderClearButton = () => (
        <IconButton
            className={classes.clearButton}
            disabled={!!disabled}
            onClick={handleClear}
        >
            <IconCross24 />
        </IconButton>
    );

    return (
        <div
            className={classNames(classes.fieldsContainer, {
                [classes.fieldsContainerVertical]: isVertical,
            })}
        >
            <UIDateField
                placeholder={systemSettingsStore.get().dateFormat.toLowerCase()}
                locale={systemSettingsStore.get().uiLocale}
                value={value}
                onBlur={(val: any, options: any) => onBlur && onBlur(val, options)}
                disabled={disabled}
                width={width}
                {...passOnProps}
            />
            {renderClearButton()}
        </div>
    );
};

export const DateField = withTheme()(withStyles(getStyles)(DateFieldPlain));
