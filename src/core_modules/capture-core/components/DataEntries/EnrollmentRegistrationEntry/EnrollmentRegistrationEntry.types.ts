import type { ReactNode } from 'react';
import type { RenderCustomCardActions } from '../../CardList';
import type { SaveForDuplicateCheck } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import type { ExistingUniqueValueDialogActionsComponent } from '../withErrorMessagePostProcessor';
import type { InputAttribute } from './hooks/useFormValues';
import { RenderFoundation, ProgramStage, Enrollment } from '../../../metaData';
import type { RelatedStageRefPayload } from '../../WidgetRelatedStages';
import { relatedStageActions } from '../../WidgetRelatedStages';

type TrackedEntityAttributes = Array<{
    attribute: string;
    value: any;
}>;

export type EnrollmentPayload = {
    trackedEntity: string;
    trackedEntityType: string;
    orgUnit: string;
    geometry: any;
    attributes: TrackedEntityAttributes;
    enrollments: [
        {
            occurredAt: string;
            orgUnit: string;
            program: string;
            status: string;
            enrolledAt: string;
            events: Array<{
                orgUnit: string;
            }>;
            attributes: TrackedEntityAttributes;
            geometry: any;
        }
    ];
    relationships?: [
        {
            relationshipType: string;
            from: {
                event: {
                    event: string;
                };
            };
            to: {
                event: {
                    event: string;
                };
            };
        }
    ];
};

export type OwnProps = {
    id: string;
    orgUnitId: string;
    selectedScopeId: string;
    fieldOptions?: Record<string, unknown>;
    onSave: SaveForDuplicateCheck;
    onCancel: () => void;
    duplicatesReviewPageSize: number;
    renderDuplicatesCardActions?: RenderCustomCardActions;
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave?: () => void) => ReactNode;
    ExistingUniqueValueDialogActions: ExistingUniqueValueDialogActionsComponent;
    teiId?: string;
    skipDuplicateCheck?: boolean;
    trackedEntityInstanceAttributes?: Array<InputAttribute>;
    saveButtonText: (trackedEntityName: string) => string;
    firstStageMetaData?: { stage: ProgramStage };
    relatedStageRef?: { current: RelatedStageRefPayload | null };
    relatedStageActionsOptions?: {
        [key in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
};

type ContainerProps = {
    ready: boolean;
    orgUnitId: string;
    orgUnit: any;
    onCancel: () => void;
    isUserInteractionInProgress: boolean;
    isSavingInProgress: boolean;
    enrollmentMetadata: Enrollment;
    formFoundation: RenderFoundation;
    formId: string | null;
    saveButtonText: string;
};

export type Props = Omit<OwnProps, 'saveButtonText'> & ContainerProps;

type PropsAddedInHOC = {
    onPostProcessErrorMessage: (message: string) => string;
    onSave: (saveType?: string) => void;
} & any;

type PropsRemovedInHOC = {
    renderDuplicatesCardActions?: RenderCustomCardActions;
    renderDuplicatesDialogActions?: (onCancel: () => void, onSave?: () => void) => ReactNode;
    duplicatesReviewPageSize: number;
    onSave: SaveForDuplicateCheck;
};

export type PlainProps = Omit<Props, keyof PropsRemovedInHOC> & PropsAddedInHOC;
