import { useCallback } from 'react';

type UseAddRelationshipParams = {
    teiId: string;
    onMutate: () => void;
};

type AddRelationshipPayload = {
    apiData: {
        trackedEntities?: any[];
        relationships: Array<{
            relationship: string;
            relationshipType: string;
            from: { trackedEntity: { trackedEntity: string } };
            to: { trackedEntity: { trackedEntity: string } };
        }>;
    };
    clientRelationship: {
        relationship: string;
        relationshipType: string;
        createdAt: string;
        pendingApiResponse: boolean;
        from: { trackedEntity: { trackedEntity: string } };
        to: { trackedEntity: { trackedEntity: string } };
        [key: string]: any;
    };
};

export const useAddRelationship = ({ teiId, onMutate }: UseAddRelationshipParams) => {
    const addRelationship = useCallback((payload: AddRelationshipPayload) => {
        console.log('Adding relationship for teiId:', teiId, 'payload:', payload);
        onMutate();
    }, [teiId, onMutate]);

    return { addRelationship };
};
