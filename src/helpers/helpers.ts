import { gcsStorage } from "../config"
import { format } from "util"

const util = require('util')
const bucket = gcsStorage.bucket('find-apartment-bucket') // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

export const uploadImage = (file: any): Promise<string> => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const blob = bucket.file(`${Date.now()}-${originalname.replace(/ /g, "_")}`)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (e) => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
});

export const deleteImage = (filename: string) => new Promise((resolve, reject) => {
    bucket
      .file(filename)
      .delete()
      .then((image) => {
        resolve(image)
      })
      .catch((error) => {
        reject(`Cannot delete file ${filename}`);
      })      
  });