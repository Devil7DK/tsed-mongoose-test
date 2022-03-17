import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { MongoMemoryServer } from "mongodb-memory-server";

import { Server } from "./Server";

async function bootstrap() {
  try {
    const mongodbServer = await MongoMemoryServer.create();

    const url = mongodbServer.getUri();

    $log.info("MongoDB URL", url);

    const platform = await PlatformExpress.bootstrap(Server, {
      mongoose: {
        url,
        connectionOptions: {},
      },
    });
    await platform.listen();

    process.on("SIGINT", () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({ event: "SERVER_BOOTSTRAP_ERROR", error });
  }
}

bootstrap();
