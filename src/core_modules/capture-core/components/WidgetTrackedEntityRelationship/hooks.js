// @flow
import { useMemo, useRef, useState } from 'react';
import {
    getCachedResourceAsync,
} from '../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../storageControllers/stores';
import type { RelationshipType } from './WidgetTrackedEntityRelationship.types';

export const useRelationshipTypes = () => {
    const [cachedTypes, setCachedTypes] = useState();
    const [loading, setLoading] = useState(true);
    const error = useRef();
    useMemo(() => {
        getCachedResourceAsync(userStores.RELATIONSHIP_TYPES)
            .then((relationshipTypes) => {
                setCachedTypes(relationshipTypes?.response);
                setLoading(false);
            })
            .catch((e) => {
                console.error(e);
            });
    }, []);

    return {
        loading,
        error: error.current,
        relationshipTypes: cachedTypes,
    };
};

export const useFilteredRelationshipTypes = (relationshipTypes: Array<RelationshipType>, trackedEntityType: string, programId: string) =>
    // $FlowFixMe
    useMemo(() => relationshipTypes?.filter((type) => {
        const { toConstraint, fromConstraint } = type;
        if (type.bidirectional) {
            if (toConstraint.trackedEntityType?.id === trackedEntityType || fromConstraint.trackedEntityType?.id === trackedEntityType) {
                let fromConstraintValid = true;
                let toConstraintValid = true;
                if (fromConstraint.program) {
                    if ((fromConstraint.program?.id !== programId) || (fromConstraint.trackedEntityType?.id !== trackedEntityType)) {
                        fromConstraintValid = false;
                    }
                }
                if (toConstraint.program) {
                    if ((toConstraint.program?.id !== programId) || (toConstraint.trackedEntityType?.id !== trackedEntityType)) {
                        toConstraintValid = false;
                    }
                }

                if (fromConstraintValid || toConstraintValid) {
                    return true;
                }
                return false;
            }
            return false;
        }
        if (fromConstraint.trackedEntityType?.id === trackedEntityType) {
            if (fromConstraint.program) {
                if (fromConstraint.program.id !== programId) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }), [relationshipTypes, programId, trackedEntityType]);
