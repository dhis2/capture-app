// @flow

import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';

type Props = {|
  programId: string,
|}

export const ProgramAccessLevels = Object.freeze({
    OPEN: 'OPEN',
    AUDITED: 'AUDITED',
    PROTECTED: 'PROTECTED',
    CLOSED: 'CLOSED',
});

export const useProgramAccessLevel = ({ programId }: Props) => {
    const { data: program, isLoading } = useApiMetadataQuery(
        ['programProtectionLevel', programId],
        {
            resource: 'programs',
            id: programId,
            params: {
                fields: 'accessLevel',
            },
        },
        {
            enabled: !!programId,
        },
    );

    return {
        accessLevel: program?.accessLevel,
        isLoading,
    };
};
