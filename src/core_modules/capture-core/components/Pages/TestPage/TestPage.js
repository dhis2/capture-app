import React from 'react';
import { useProgramFromIndexedDB } from '../../../utils/cachedDataHooks/useProgramFromIndexedDB';
import { useSearchGroupForProgram } from '../../../utils/cachedDataHooks/useSearchGroupForProgram';

export const TestPage = () => {
    const { program: data, loading, error } = useProgramFromIndexedDB('IpHINAT79UW');
    // const { data: sg } = useSearchGroupForProgram();

    if (error) {
        return <div>Error: {JSON.stringify(error, null, 2)}</div>;
    }

    return (
        <div>
            <h1>Test Page</h1>
            {loading && <p>Loading...</p>}
            {error && JSON.stringify(error)}
            {/* {data && data.map((program) => <p key={program.id}>{program.displayName}</p>)} */}
            {data && JSON.stringify(data)}
        </div>
    );
};
