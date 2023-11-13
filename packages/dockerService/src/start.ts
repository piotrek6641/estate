import { DockerEnvVariable } from "@estates/types";
import { DockerClient } from "./docker";
import { ContainerManager } from "./containerManager";

const containerName = "mongo-db";

const envVariables: DockerEnvVariable[] = [
    "MONGO_INITDB_ROOT_USERNAME: root",
    "MONGO_INITDB_ROOT_PASSWORD: example",
];
const imageName = "mongo:7.0";


async function start() {
    const dockerClient = new DockerClient(envVariables, containerName, imageName, 27017, 27017 );
    const containerManager = new ContainerManager(dockerClient);
    process.once("SIGINT", async () => {
        await containerManager.killContainer();
    });
    await containerManager.startContainer();
    await containerManager.waitForContainerToExit();
}

start();
