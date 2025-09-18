import { useSelector } from 'react-redux';

export const useCurrentProgramInfo = () => ({ 
    id: useSelector(({ currentSelections }: any) => currentSelections.programId),
});
