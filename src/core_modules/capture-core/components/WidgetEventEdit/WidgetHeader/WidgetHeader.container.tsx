import React, { useState, useEffect, useMemo } from 'react';
import { dataEntryKeys } from 'capture-core/constants';
import { useDispatch } from 'react-redux';
import { spacersNum, Button, IconEdit24, IconMore16, FlyoutMenu, MenuItem, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { FEATURES, useFeature } from 'capture-core-utils';
import { useAuthorities } from 'capture-core/utils/authority/useAuthorities';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { useEnrollmentEditEventPageMode, useProgramExpiryForUser } from 'capture-core/hooks';
import { startShowEditEventDataEntry } from '../WidgetEventEdit.actions';
import { NonBundledDhis2Icon } from '../../NonBundledDhis2Icon';
import { dataElementTypes, getProgramEventAccess } from '../../../metaData';
import { useCategoryCombinations } from '../../DataEntryDhis2Helpers/AOC/useCategoryCombinations';
import { OverflowButton } from '../../Buttons';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import { eventStatuses } from '../constants/status.const';
import type { PlainProps } from './WidgetHeader.types';
import { isValidPeriod } from '../../../utils/validation/validators/form';
import { convertFormToClient } from '../../../converters';

const styles: Readonly<any> = {
    icon: {
        paddingInlineEnd: spacersNum.dp8,
    },
    menu: {
        marginInlineStart: 'auto',
    },
    menuActions: {
        display: 'flex',
        alignItems: 'center',
        gap: spacers.dp4,
    },
    tooltip: {
        display: 'inline-flex',
    },
};

type Props = PlainProps & WithStyles<typeof styles>;

const WidgetHeaderPlain = ({
    eventStatus,
    stage,
    programId,
    orgUnit,
    setChangeLogIsOpen,
    classes,
    occurredAt,
}: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const dispatch = useDispatch();

    const supportsChangelog = useFeature(FEATURES.changelogs);
    const { currentPageMode } = useEnrollmentEditEventPageMode(eventStatus);
    const [actionsIsOpen, setActionsIsOpen] = useState(false);

    const eventAccess = getProgramEventAccess(programId, stage.id);
    const { hasAuthority } = useAuthorities({ authorities: ['F_UNCOMPLETE_EVENT'] });
    const blockEntryForm = stage.blockEntryForm && !hasAuthority && eventStatus === eventStatuses.COMPLETED;

    const expiryPeriod = useProgramExpiryForUser(programId);
    const occurredAtClient = convertFormToClient(occurredAt, dataElementTypes.DATE) as string;
    const { isWithinValidPeriod } = isValidPeriod(occurredAtClient, expiryPeriod);

    const disableEdit = !eventAccess?.write || blockEntryForm || !isWithinValidPeriod;
    const tooltipContent = useMemo(() => {
        if (blockEntryForm) {
            return i18n.t('The event cannot be edited after it has been completed');
        }
        if (!eventAccess?.write) {
            return i18n.t('You don\'t have access to edit this event');
        }
        if (!isWithinValidPeriod) {
            return i18n.t('{{occurredAt}} belongs to an expired period. Event cannot be edited', {
                occurredAt,
                interpolation: { escapeValue: false },
            });
        }
        return '';
    }, [blockEntryForm, eventAccess?.write, isWithinValidPeriod, occurredAt]);

    const { programCategory } = useCategoryCombinations(programId);

    const { icon, name } = stage;

    return (
        <>
            {icon && (
                <div className={classes.icon}>
                    <NonBundledDhis2Icon
                        name={icon?.name}
                        color={icon?.color}
                        width={30}
                        height={30}
                        cornerRadius={2}
                    />
                </div>
            )}
            <span> {name} </span>
            <div className={classes.menu}>
                {currentPageMode === dataEntryKeys.VIEW && (
                    <div className={classes.menuActions}>
                        <ConditionalTooltip
                            content={tooltipContent}
                            enabled={disableEdit}
                            wrapperClassName={classes.tooltip}
                        >
                            <Button
                                small
                                secondary
                                disabled={disableEdit}
                                icon={<IconEdit24 />}
                                onClick={() => dispatch(startShowEditEventDataEntry(orgUnit, programCategory))}
                                data-test="widget-enrollment-event-edit-button"
                            >
                                {i18n.t('Edit event')}
                            </Button>
                        </ConditionalTooltip>

                        {supportsChangelog && (
                            <OverflowButton
                                open={actionsIsOpen}
                                onClick={() => setActionsIsOpen(prev => !prev)}
                                icon={<IconMore16 />}
                                small
                                secondary
                                dataTest={'tracker-program-event-overflow-button'}
                                component={
                                    <FlyoutMenu
                                        dense
                                        maxWidth="250px"
                                        dataTest={'tracker-program-event-overflow-menu'}
                                    >
                                        <MenuItem
                                            label={i18n.t('View changelog')}
                                            suffix=""
                                            onClick={() => {
                                                setChangeLogIsOpen(true);
                                                setActionsIsOpen(false);
                                            }}
                                        />
                                    </FlyoutMenu>
                                }
                            />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export const WidgetHeader = withStyles(styles)(WidgetHeaderPlain);
