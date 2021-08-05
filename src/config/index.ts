import * as gcs from '@google-cloud/storage';
const path = require('path')

let serviceKey;
if (process.env.GCS_KEYFILE) {
    serviceKey = JSON.parse(process.env.GCS_KEYFILE);
} else {
    serviceKey = path.join(__dirname, "..", "..", "..", 'carbon-relic-321816-34b4aa34d0fd.json');
}

export const gcsStorage = new gcs.Storage({ 
    keyFilename: serviceKey,
    projectId: "carbon-relic-321816",
 });


