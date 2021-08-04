import * as gcs from '@google-cloud/storage';
const path = require('path')

const serviceKey = path.join(__dirname, "..", "..", "..", 'credentials/carbon-relic-321816-34b4aa34d0fd.json')

export const gcsStorage = new gcs.Storage({ 
    keyFilename: serviceKey,
    projectId: "carbon-relic-321816",
 });


