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
    selectedTemplateId: string,
    showMainPage: boolean,
    ...CssClasses,
|}>;

export type Props = $ReadOnly<{|
    ...PassOnProps,
    ...PlainProps,
    error: boolean,
    ready: boolean,
    trackedEntityTypeId?: string,
    displayFrontPageList?: boolean,
    selectedCategories: ?{ [categoryId: string]: { writeAccess: boolean } },
|}>;
