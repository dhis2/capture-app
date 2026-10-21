import * as React from 'react';
import type { RenderFoundation } from '../../metaData';
import { addEventSaveTypes } from '../WidgetEnrollmentEventNew/DataEntry/addEventSaveTypes';
import { relatedStageActions } from '../WidgetRelatedStages';
import type { RelatedStageRefPayload } from '../WidgetRelatedStages';

type Props = {
    onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: string) => void;
    onSaveAndAskToCreateNew: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void;
    allowGenerateNextVisit?: boolean;
    askCompleteEnrollmentOnEventComplete?: boolean;
    availableProgramStages?: Array<Record<string, any>>;
    isCompleted?: boolean;
    relatedStageRef?: { current: RelatedStageRefPayload | null };
};

// The question itself is asked on the enrollment dashboard after the event has been saved
const askToCreateNewComponent = (InnerComponent: React.ComponentType<any>) =>
    class AskToCreateNewHOC extends React.Component<Props> {
        innerInstance: any;
        constructor(props: Props) {
            super(props);
            this.handleOnSave = this.handleOnSave.bind(this);
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        handleOnSave(eventId: string, dataEntryId: string, formFoundation: RenderFoundation, saveType?: string) {
            const { linkMode } = this.props.relatedStageRef?.current?.getLinkedStageValues() ?? {};
            if (this.props.allowGenerateNextVisit &&
                this.props.availableProgramStages &&
                this.props.availableProgramStages.length > 0 &&
                (this.props.isCompleted || saveType === addEventSaveTypes.COMPLETE) &&
                !this.props.askCompleteEnrollmentOnEventComplete &&
                linkMode !== relatedStageActions.ENTER_DATA
            ) {
                this.props.onSaveAndAskToCreateNew(eventId, dataEntryId, formFoundation);
            } else {
                this.props.onSave(eventId, dataEntryId, formFoundation, saveType);
            }
        }

        render() {
            const { onSave, onSaveAndAskToCreateNew, isCompleted, ...passOnProps } = this.props;

            return (
                <InnerComponent
                    ref={(innerInstance: any) => { this.innerInstance = innerInstance; }}
                    onSave={this.handleOnSave}
                    {...passOnProps}
                />
            );
        }
    };


export const withAskToCreateNew = () => (InnerComponent: React.ComponentType<any>) =>
    askToCreateNewComponent(InnerComponent);
