import Docker = require("dockerode");
import { Logger } from "logger";
const docker = new Docker();

const containerName = "mongo-db";

const envVariables = [
    "MONGO_INITDB_ROOT_USERNAME: root",
    "MONGO_INITDB_ROOT_PASSWORD: example"
];

export class DockerClient{
    logger = new Logger("DockerClient");
    async pullDBImage() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<string>(async (res, rej) => {
            try {
                const stream = await docker.createImage({
                    fromImage: "mongo:7.0"
                });
                stream.pipe(process.stdout);

                stream.on("end", () => {
                    this.logger.info("Image creation finished.");
                    res("finished");
                });

                stream.on("error", (err) => {
                    this.logger.error("Image creation error:" + err);
                    rej(err);
                });
            } catch(e) {
                rej(e);
            }
        });
    }
    async createAndStartDockerContainer() {
        try {
            try {
                const existingContainer = docker.getContainer(containerName);
                if (existingContainer) await existingContainer.remove({ force: true });
            } catch {
                // do nothing
            }
            const container = await docker.createContainer({
                name: containerName,
                Image: "mongo:7.0",
                Env: envVariables,
                ExposedPorts: { "27017/tcp": {} },
                HostConfig: {
                    PortBindings: { "27017/tcp": [{ HostPort: "27017" }] }
                },
            });
            await container.start();
            this.logger.info("Container created and started successfully.");
        } catch (error) {
            this.logger.error("Error creating and starting the container:" + error);
        }
    }
    async waitForContainerToBoot() {
        const maxAttempts = 30;
        let attempts = 0;
        const interval = 1000;

        while (attempts < maxAttempts) {
            try {
                const container = docker.getContainer(containerName);
                const containerInfo = await container.inspect();
                if (containerInfo.State?.Status === "running") {
                    this.logger.info("Container is healthy and booted successfully.");
                    return;
                }
            } catch (error) {
            // Container may not be available immediately, so retry
            }

            attempts++;
            this.logger.debug(`Waiting for container to boot... (Attempt ${attempts}/${maxAttempts})`);

            await new Promise((resolve) => setTimeout(resolve, interval));
        }

        this.logger.error("Container did not boot successfully within the specified time.");
    }
}
