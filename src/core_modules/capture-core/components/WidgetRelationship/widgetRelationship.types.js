// @flow
import type { OutputRelationship } from '../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export type Props = {|
    relationships: {
        relationshipsByType?: ?Array<OutputRelationship>,
        count: ?number,
    },
    title: string,
    onAddRelationship: () => void,
    ...CssClasses,
|};
