// @flow
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import type { ProgramStage, RenderFoundation } from '../../../metaData';
import { typeof addEventSaveTypes } from '../DataEntry/addEventSaveTypes';
import { actions as ReferralModes } from '../../WidgetReferral/constants';
import type {
    CommonValidatedProps, ExternalSaveHandler,
    RulesExecutionDependenciesClientFormatted,
} from '../common.types';


export type RequestEvent = {
    dataEntryItemId: string,
    dataEntryId: string,
    formFoundation: Object,
    programId: string,
    orgUnitId: string,
    orgUnitName: string,
    teiId: string,
    enrollmentId: string,
    completed?: boolean,
    onSaveExternal?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
}

export type ReferralDataValueStates = {|
    referralMode: typeof ReferralModes.REFER_ORG,
    scheduledAt: string,
    orgUnit: ?{
        path: string,
        id: string,
        name: string,
    },
|}

export type ContainerProps = {|
    ...CommonValidatedProps,
    orgUnit: OrgUnit,
|};

export type Props = {|
    programName: string,
    stage: ProgramStage,
    formFoundation: RenderFoundation,
    orgUnit: OrgUnit,
    ready: boolean,
    id: string,
    referralDataValues: ReferralDataValueStates,
    setReferralDataValues: (() => Object) => void,
    setSelectedReferralType: (any) => void,
    itemId: string,
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    onCancel: () => void,
    formRef: (formInstance: any) => void,
    dataEntryFieldRef: (instance: any, id: string) => void,
    rulesExecutionDependenciesClientFormatted: RulesExecutionDependenciesClientFormatted,
    ...CssClasses,
|};
