// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';

export const CacheExpired = () => (
  <div>
    {
      // keeping this on one line due to issues with i18n
      i18n.t(
        'You opened another version of the Capture App in the same domain. Currently, the Capture App only supports running one version concurrently (in the same domain). Please refresh this page if you would like to use this version again, but be aware that this will close other versions.',
      )
    }
  </div>
);
