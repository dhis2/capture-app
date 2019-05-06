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
    workingListConfigs: Array<WorkingListConfig>,
    defaultWorkingListConfig: WorkingListConfig,
    onSetWorkingListConfig: (id: string, data?: ?Object) => void,
    selectedListId: ?string,
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
        const { selectedListId } = this.props;
        if (id === selectedListId) {
            this.handleSetDefaultWorkingListConfig();
        } else {
            this.props.onSetWorkingListConfig(id, data);
        }
    }

    handleSetDefaultWorkingListConfig = () => {
        const { id, name, ...data } = this.props.defaultWorkingListConfig;
        this.props.onSetWorkingListConfig(id, data);
    }

    renderWorkingListConfigs = () => {
        const { workingListConfigs, selectedListId, classes } = this.props;
        return workingListConfigs.filter(w => !w.isDefault).map((w) => {
            const { id, name, ...data } = w;
            return (
                <div className={classes.chipContainer}>
                    <Chip
                        label={name}
                        key={id}
                        className={classNames(classes.chip, { [classes.chipSelected]: selectedListId === w.id })}
                        onClick={() => this.handleWorkingListConfigClick(id, data)}
                    />
                </div>
            );
        });
    }

    render() {
        const { workingListConfigs, classes, selectedListId, ...passOnProps } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.workingListConfigsContainer}>
                    {this.renderWorkingListConfigs()}
                </div>
                <EventListLoadWrapper
                    listId={selectedListId}
                    {...passOnProps}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(WorkingListConfigSelector);
