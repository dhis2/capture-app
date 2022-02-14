// @flow
import type { OutputRelationship } from '../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export type Props = {|
    relationships: Array<OutputRelationship>,
    title: string,
    onAddRelationship: () => void,
    ...CssClasses,
|};
