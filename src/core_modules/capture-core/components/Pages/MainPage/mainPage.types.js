// @flow

type PassOnProps = $ReadOnly<{|
    programId: string,
    orgUnitId: string,
    selectedTemplateId?: string,
    onChangeTemplate?: (selectedTemplateId?: string) => void,
|}>;

export type PlainProps = $ReadOnly<{|
    ...PassOnProps,
    setShowAccessible: () => void,
    MainPageStatus: boolean,
    trackedEntityTypeId?: string,
    displayFrontPageList?: boolean,
    selectedTemplateId: string,
    selectedCategories: ?{ [categoryId: string]: { writeAccess: boolean } },
    ...CssClasses,
|}>;

export type Props = $ReadOnly<{|
    ...PassOnProps,
    ...PlainProps,
    error: boolean,
    ready: boolean,
|}>;
