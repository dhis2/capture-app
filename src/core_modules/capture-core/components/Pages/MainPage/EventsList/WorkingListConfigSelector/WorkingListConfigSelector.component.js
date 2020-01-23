// @flow
import * as React from 'react';
import classNames from 'classnames';
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { withStyles, Chip } from '@material-ui/core';
import EventListLoadWrapper from '../EventsListLoadWrapper.container';


const getBorder = (theme: Theme) => {
    const color = theme.palette.type === 'light'
        ? lighten(fade(theme.palette.divider, 1), 0.88)
        : darken(fade(theme.palette.divider, 1), 0.8);
    return `${theme.typography.pxToRem(1)} solid ${color}`;
};

const getStyles = (theme: Theme) => ({
    container: {
        border: getBorder(theme),
    },
    workingListConfigsContainer: {
        borderBottom: getBorder(theme),
        display: 'flex',
        flexWrap: 'wrap',
        padding: `${theme.typography.pxToRem(3)} 0rem`,
    },
    chipContainer: {
        padding: `${theme.typography.pxToRem(5)} ${theme.typography.pxToRem(8)}`,
    },
    chip: {
    },
    chipSelected: {
        color: 'white',
        backgroundColor: theme.palette.secondary.main,
        '&:focus': {
            backgroundColor: theme.palette.secondary.main,
        },
    },
});

type WorkingListConfig = {
    id: string,
    isDefault?: ?boolean,
    name: string,
    filters: Object,
}

type Props = {
    listId: string,
    workingListConfigs: Array<WorkingListConfig>,
    defaultWorkingListConfig: WorkingListConfig,
    onSetWorkingListConfig: (configId: string, listId: string, data?: ?Object) => void,
    configId: ?string,
    classes: {
        container: string,
        workingListConfigsContainer: string,
        chipContainer: string,
        chip: string,
        chipSelected: string,
    }
};
class WorkingListConfigSelector extends React.Component<Props> {
    handleWorkingListConfigClick = (id, data) => {
        const { configId, listId } = this.props;
        if (id === configId) {
            this.handleSetDefaultWorkingListConfig();
        } else {
            this.props.onSetWorkingListConfig(id, listId, data);
        }
    }

    handleSetDefaultWorkingListConfig = () => {
        const { id, name, ...data } = this.props.defaultWorkingListConfig;
        const listId = this.props.listId;
        this.props.onSetWorkingListConfig(id, listId, data);
    }

    renderWorkingListConfigs = () => {
        const { workingListConfigs, configId, classes } = this.props;
        const customConfigs = workingListConfigs
            .filter(c => !c.isDefault);

        if (customConfigs.length <= 0) {
            return null;
        }

        const configElements = customConfigs.map((w) => {
            const { id, name, ...data } = w;
            return (
                <div
                    className={classes.chipContainer}
                    key={id}
                >
                    <Chip
                        label={name}
                        key={id}
                        className={classNames(classes.chip, { [classes.chipSelected]: configId === w.id })}
                        onClick={() => this.handleWorkingListConfigClick(id, data)}
                    />
                </div>
            );
        });

        return (
            <div
                className={classes.workingListConfigsContainer}
            >
                {configElements}
            </div>
        );
    }

    render() {
        const { workingListConfigs, classes, ...passOnProps } = this.props;
        return (
            <div className={classes.container}>
                {this.renderWorkingListConfigs()}
                <EventListLoadWrapper
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(WorkingListConfigSelector);
