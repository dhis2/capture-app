// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button } from '@dhis2/ui';
import DataEntry from '../../../DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/DataEntry/DataEntry.container';
import EventsList from '../../../DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/RecentlyAddedEventsList/RecentlyAddedEventsList.container';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';

const getStyles = () => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexEnd: {
        justifyContent: 'flex-end',
        marginLeft: 'auto',
    },
});

type Props = {
    ...CssClasses,
    formHorizontal: ?boolean,
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void,
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
}


class NewEventDataEntryWrapperPlain extends React.Component<Props> {
    cancelButtonInstance: ?any;

    setCancelButtonInstance = (cancelButtonInstance: ?any) => {
        this.cancelButtonInstance = cancelButtonInstance;
    }

    render() {
        const {
            classes,
            formFoundation,
            formHorizontal,
            stage,
            onFormLayoutDirectionChange,
        } = this.props;

        return (
            <>
                <div className={classes.flexContainer}>
                    <div className={classes.flexEnd}>
                        {
                            !formFoundation || formFoundation.customForm ?
                                null
                                :
                                <Button
                                    onClick={() => onFormLayoutDirectionChange(!formHorizontal)}
                                    small
                                >
                                    {
                                        formHorizontal
                                            ?
                                            i18n.t('Switch to form view')
                                            :
                                            i18n.t('Switch to row view')
                                    }
                                </Button>

                        }
                    </div>
                </div>
                <DataEntry
                    stage={stage}
                    cancelButtonRef={this.setCancelButtonInstance}
                    formFoundation={formFoundation}
                    formHorizontal={formHorizontal}
                />
                <EventsList />
            </>
        );
    }
}

export const NewEventDataEntryWrapperComponent = withStyles(getStyles)(NewEventDataEntryWrapperPlain);
