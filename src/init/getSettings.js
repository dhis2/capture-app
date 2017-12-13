// @flow
import getD2 from 'd2-tracker/d2/d2Instance';

export default async function getSystemSettings() {
    const systemSettings = await getD2().system.settings.all();
    return systemSettings;
}
