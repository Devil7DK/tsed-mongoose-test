import { Model } from "@tsed/mongoose";
import { Property } from "@tsed/schema";

import { IImage } from "../interfaces";

@Model({collection: "images_tsed"})
export class ImageModel implements IImage{
  @Property(Buffer)
  image: Buffer;

  @Property(String)
  mimeType: string;
}
