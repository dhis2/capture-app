// @flow

export type ContainerProps = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
    selectedTemplateId?: string,
    trackedEntityTypeId?: string,
    displayFrontPageList?: boolean,
    onChangeTemplate?: (selectedTemplateId?: string) => void,
    setShowAccessible: () => void,
    MainPageStatus: boolean,
    selectedTemplateId: string,
    error: boolean,
    ready: boolean,
|}
>;

export type Props = $ReadOnly<{|
    ...ContainerProps,
    ...CssClasses
|}>;
