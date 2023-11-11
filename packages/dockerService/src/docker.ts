import Docker = require("dockerode");
import { Logger } from "@estates/logger";
import process = require("process");
import { DockerEnvVariable } from "@estates/types";
const docker = new Docker();

export class DockerClient {
    logger = new Logger("DockerClient");
    envVariables: DockerEnvVariable[];
    containerName: string;
    imageName: string;
    exposedPort: number;
    hostPort: number;
    container?: Docker.Container;
    constructor(
        dockerEnvVaraibles: DockerEnvVariable[],
        containerName: string,
        imageName: string,
        exposedPort: number,
        hostPort: number) {
        this.envVariables = dockerEnvVaraibles;
        this.containerName = containerName;
        this.imageName = imageName;
        this.exposedPort = exposedPort;
        this.hostPort = hostPort;
    }
    async pullDBImage() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<void>(async (res, rej) => {
            try {
                const stream = await docker.createImage({
                    fromImage: this.imageName,
                });
                stream.pipe(process.stdout);

                stream.on("end", () => {
                    this.logger.info("Image creation finished.");
                    res();
                });

                stream.on("error", (err) => {
                    this.logger.error("Image creation error:" + err);
                    rej(err);
                });
            } catch (e) {
                rej(e);
            }
        });
    }
    async createAndStartDockerContainer() {
        try {
            try {
                const existingContainer = docker.getContainer(this.containerName);
                if (existingContainer) await existingContainer.remove({ force: true });
            } catch {
                // do nothing
            }
            const container = await docker.createContainer({
                name: this.containerName,
                Image: this.imageName,
                Env: this.envVariables,
                ExposedPorts: { [`${this.exposedPort}/tcp`]: {} },
                HostConfig: {
                    PortBindings: { [`${this.exposedPort}/tcp`]: [{ HostPort: this.hostPort.toString() }] },
                },
            });
            await container.start();
            this.container = container;
            this.logger.info("Container created and started successfully.");
        } catch (error) {
            throw new Error("Error creating and starting the container:" + error);
        }
    }
    async waitForContainerToBoot() {
        const maxAttempts = 30;
        let attempts = 0;
        const interval = 1000;

        while (attempts < maxAttempts) {
            try {
                const container = docker.getContainer(this.containerName);
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
