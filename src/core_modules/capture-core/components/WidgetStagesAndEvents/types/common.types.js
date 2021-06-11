// @flow


type ProgramStageDataElement = {
    dataElements: Array<{id: string, valueType: string, displayName: string}>
}

export type ProgramStageData = {
    id: string,
    programStageDataElements: Array<ProgramStageDataElement>
}

