import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, spacersNum } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NonBundledDhis2Icon } from '../../../NonBundledDhis2Icon';

const styles: Readonly<any> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp8,
        padding: spacers.dp16,
        paddingTop: 0,
    },
    button: {
        alignSelf: 'start',
    },
    cancelbutton: {
        alignSelf: 'start',
        marginTop: spacersNum.dp16,
    },
};

type ProgramStage = {
    id: string;
    displayName: string;
    dataAccess: {
        write: boolean;
    };
    repeatable: boolean;
    eventCount: number;
    hiddenProgramStage: boolean;
    style?: {
        icon?: string;
        color?: string;
    };
};

type Props = {
    programStages: ProgramStage[];
    onSelectProgramStage: (stageId: string) => void;
    onCancel: () => void;
};

type ProgramStageSelectorPlainProps = Props & WithStyles<typeof styles>;

const ProgramStageSelectorComponentPlain = ({
    programStages,
    onSelectProgramStage,
    onCancel,
    classes,
}: ProgramStageSelectorPlainProps) => (
    <div className={classes.container}>
        {programStages.map((programStage) => {
            const disableStage =
                !programStage.dataAccess.write
                || (!programStage.repeatable && programStage.eventCount > 0)
                || programStage.hiddenProgramStage;
            return (
                <div
                    key={programStage.id}
                >
                    <ConditionalTooltip
                        content={i18n.t('You can\'t add any more {{ programStageName }} events', {
                            programStageName: programStage.displayName,
                            interpolation: { escapeValue: false },
                        })}
                        enabled={disableStage}
                    >
                        <Button
                            className={classes.button}
                            secondary
                            disabled={disableStage}
                            onClick={() => onSelectProgramStage(programStage.id)}
                            dataTest={'program-stage-selector-button'}
                            icon={
                                programStage.style?.icon ? (
                                    <div className={classes.icon}>
                                        <NonBundledDhis2Icon
                                            name={programStage.style?.icon}
                                            color={programStage.style?.color}
                                            width={24}
                                            height={24}
                                            cornerRadius={5}
                                        />
                                    </div>
                                ) : undefined
                            }
                        >
                            {programStage.displayName}
                        </Button>
                    </ConditionalTooltip>
                </div>
            );
        })}
        <Button
            className={classes.cancelbutton}
            secondary
            large
            onClick={onCancel}
        >
            {i18n.t('Cancel without saving')}
        </Button>
    </div>
);

export const ProgramStageSelectorComponent = withStyles(styles)(ProgramStageSelectorComponentPlain);
