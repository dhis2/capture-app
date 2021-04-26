// @flow
import { useSelector } from 'react-redux';

export const useProfileInfo = () => {
    const profileInformation = useSelector(({ enrollmentPage }) => enrollmentPage.profileInformation) ?? [];
    return { attributes: profileInformation };
};
