import {
  MulterOptions,
  MultipartFile,
  PathParams,
  PlatformMulterFile,
  Res,
} from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { MongooseModel, MongooseService } from "@tsed/mongoose";
import { Get, Post } from "@tsed/schema";
import { Model, Schema } from "mongoose";
import { memoryStorage } from "multer";

import { IImage } from "../interfaces";
import { ImageModel } from "../models";

@Controller("/")
export class ImageController {
  @Inject(ImageModel)
  private imageModel: MongooseModel<ImageModel>;

  private imageMongooseModel: Model<IImage>;

  constructor(mongooseService: MongooseService) {
    const schema = new Schema<IImage>({
      image: Buffer,
      mimeType: String,
    });

    this.imageMongooseModel = mongooseService
      .get()!
      .model("images_mongoose", schema);
  }

  @Post("/using-tsed-model")
  @MulterOptions({
    storage: memoryStorage(),
  })
  async createUsingTSEDModel(
    @MultipartFile("image", 1) image: PlatformMulterFile
  ) {
    const imageItem = await this.imageModel.create({
      image: image.buffer,
      mimeType: image.mimetype,
    });
    return imageItem.id;
  }

  @Get("/using-tsed-model/:id")
  async getUsingTSEDModel(@PathParams("id") id: string, @Res() res: Res) {
    const imageItem = await this.imageModel.findById(id);

    if (!imageItem) {
      throw new NotFound("Image not found!");
    }

    res.contentType(imageItem.mimeType);

    return imageItem.image;
  }

  @Post("/using-mongoose-model")
  @MulterOptions({
    storage: memoryStorage(),
  })
  async createUsingMongooseModel(
    @MultipartFile("image") image: PlatformMulterFile
  ) {
    const imageItem = await this.imageMongooseModel.create({
      image: image.buffer,
      mimeType: image.mimetype,
    });
    return imageItem.id;
  }

  @Get("/using-mongoose-model/:id")
  async getUsingMongooseModel(@PathParams("id") id: string, @Res() res: Res) {
    const imageItem = await this.imageMongooseModel.findById(id);

    if (!imageItem) {
      throw new NotFound("Image not found!");
    }

    res.contentType(imageItem.mimeType);

    return imageItem.image;
  }
}
