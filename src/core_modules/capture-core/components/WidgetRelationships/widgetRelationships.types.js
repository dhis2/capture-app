// @flow
import type { OutputRelationship, InputRelationship } from '../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export type WidgetTeisProps = {|
    relationships: Array<InputRelationship>,
    onAddRelationship: () => void,
    teiId: string,
    ...CssClasses,
|};

export type Props = {|
    relationships: Array<OutputRelationship>,
    title: string,
    onAddRelationship: () => void,
    ...CssClasses,
|}
