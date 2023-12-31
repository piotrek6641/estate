import { EventBus } from "@estates/event-bus";
import { ServiceBuilder } from "./serviceBuilder";

export async function start() {
    const serviceBuilder = new ServiceBuilder();
    const eventBus = EventBus.getInstance();

    eventBus.subscribe("init-state", () => {
        serviceBuilder.emit("finished");
    });

    serviceBuilder.buildServiceManager();

    await serviceBuilder.startServiceManager();

    await serviceBuilder.waitForFinishBooting();
}

start();
