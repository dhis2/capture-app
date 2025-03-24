// @flow
import * as React from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { IconButton, DateField as UIDateField, orientations } from 'capture-ui';
import { IconCross24 } from '@dhis2/ui';
import classNames from 'classnames';
import { systemSettingsStore } from '../../../../../../metaDataMemoryStores';

const getStyles = () => ({
    fieldsContainer: {
        display: 'flex',
    },
    fieldsContainerVertical: {
        flexDirection: 'column',
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
    onChange?: (value: any) => void,
    orientation: string,
    classes: {
        fieldsContainer: string,
        fieldsContainerVertical: string,
        clearButton: string,
    },
};

const DateFieldPlain = (props: Props) => {
    const {
        value,
        onChange,
        disabled,
        orientation,
        classes,
        ...passOnProps
    } = props;

    const handleClear = () => {
        onChange && onChange(null);
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
            {isVertical && renderClearButton()}
            {/*  $FlowFixMe[cannot-spread-inexact] automated comment */}
            <UIDateField
                placeholder={systemSettingsStore.get().dateFormat.toLowerCase()}
                locale={systemSettingsStore.get().uiLocale}
                value={value}
                onChange={onChange}
                {...passOnProps}
            />
            {!isVertical && renderClearButton()}
        </div>
    );
};

export const DateField = withTheme()(withStyles(getStyles)(DateFieldPlain));
