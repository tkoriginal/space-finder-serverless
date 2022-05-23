import { S3, config } from "aws-sdk";
import { CreateSpaceState } from "./../components/spaces/CreateSpace";
import { Space } from "../model/Model";
import { config as appConfig } from "./config";
import { generateRandomId } from "../utils/utils";

config.update({
  region: appConfig.REGION,
});

export class DataService {
  public async getSpaces(): Promise<Space[]> {
    const requestUrl = appConfig.api.spacesUrl
    const requestResult = await fetch(requestUrl, {
        method: 'GET'
    })
    const requestJSON = await requestResult.json()
    return requestJSON
  }

  public async reserveSpace(spaceId: string): Promise<string | undefined> {
    if (spaceId === "123") {
      return "5555";
    } else {
      return undefined;
    }
  }

  public async createSpace(spaceData: CreateSpaceState) {
    if (spaceData.photo) {
      const photoUrl = await this.uploadPublicFile(
        spaceData.photo,
        appConfig.SPACE_PHOTOS_BUCKET
      );
      spaceData.photoUrl = photoUrl;
    }
    const requestUrl = appConfig.api.spacesUrl;
    const requestOptions: RequestInit = {
      method: "POST",
      body: JSON.stringify({
        name: spaceData.name,
        location: spaceData.location,
        describe: spaceData.description,
        photoUrl: spaceData.photoUrl,
      }),
    };
    try {
      const requestResult = await fetch(requestUrl, requestOptions);
      const result = await requestResult.json();
      console.log({ result });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  private async uploadPublicFile(file: File, bucket: string) {
    const filename = generateRandomId(file.name);
    const uploadResult = await new S3({
      region: appConfig.REGION,
    })
      .upload({
        Bucket: bucket,
        Key: filename,
        Body: file,
        ACL: "public-read",
      })
      .promise();
    return uploadResult.Location;
  }
}
