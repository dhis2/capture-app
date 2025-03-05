// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, spacers, spacersNum } from '@dhis2/ui';
import { ConditionalTooltip } from 'capture-core/components/Tooltips/ConditionalTooltip';
import { NonBundledDhis2Icon } from '../../../NonBundledDhis2Icon';


type Props = {
    programStages: Array<{
      id: string,
      displayName: string,
      dataAccess: { write: boolean },
      repeatable: boolean,
      eventCount: number,
      hiddenProgramStage: boolean,
      style?: {
        icon?: string,
        color?: string
      }
    }>,
    onSelectProgramStage: (id: string) => void,
    onCancel: () => void
  };

export const ProgramStageSelectorComponent = ({ programStages, onSelectProgramStage, onCancel }: Props) => (
    <div className="container">
        {programStages.map((programStage) => {
            const disableStage =
                !programStage.dataAccess.write || (!programStage.repeatable && programStage.eventCount > 0) || programStage.hiddenProgramStage;
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
                            className="button"
                            secondary
                            disabled={disableStage}
                            onClick={() => onSelectProgramStage(programStage.id)}
                            dataTest={'program-stage-selector-button'}
                            icon={
                                programStage.style?.icon && (
                                    <div className="icon">
                                        <NonBundledDhis2Icon
                                            name={programStage.style?.icon}
                                            color={programStage.style?.color}
                                            width={24}
                                            height={24}
                                            cornerRadius={5}
                                        />
                                    </div>
                                )
                            }
                        >
                            {programStage.displayName}
                        </Button>
                    </ConditionalTooltip>
                </div>
            );
        })}
        <Button
            className="cancel-button"
            secondary
            big
            onClick={onCancel}
        >
            {i18n.t('Cancel without saving')}
        </Button>

        <style jsx>{`
            .container {
                display: flex;
                flex-direction: column;
                gap: ${spacers.dp8};
                padding: ${spacers.dp16};
                padding-top: 0;
            }
            
            .button {
                align-self: start;
            }
            
            .cancel-button {
                align-self: start;
                margin-top: ${spacersNum.dp16}px;
            }
        `}</style>
    </div>
);
