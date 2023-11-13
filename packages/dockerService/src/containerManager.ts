import { DockerClient } from "./docker";

export class ContainerManager {
    private dockerClient: DockerClient;
    constructor(dockerClient: DockerClient) {
        this.dockerClient = dockerClient;
        // eslint-disable-next-line no-undef
    }
    async startContainer() {
        try {
            await this.pullImage();
            await this.startImage();
            //await this.sendHandshake();
        } catch (error) {
            this.dockerClient.logger.error("Error starting container", error);
            throw error;
        }
    }
    private async pullImage() {
        return this.dockerClient.pullDBImage()
            .catch((e) => {
                this.dockerClient.logger.error("failed to pull db image");
                throw new Error(e);
            });
    }
    private async startImage() {
        return this.dockerClient.createAndStartDockerContainer()
            .then(async () => {
                return await this.dockerClient.waitForContainerToBoot();
            });
    }
    public async waitForContainerToExit() {
        return new Promise<void>((res, rej) => {
            this.dockerClient.container?.wait((err, data) => {
                if(err) rej(err);
                this.dockerClient.logger.info("Docker container exited", data);
                res();
            });
        });
    }
    public async killContainer() {
        return new Promise<void>((res, rej) => {
            this.dockerClient.container?.kill((err) => {
                if(err) rej(err);
                this.dockerClient.logger.info("Docker container killed");
                res();
            });
        });
    }
}
