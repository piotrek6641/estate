import { serviceProcessSpawner } from "./serviceProcessSpawner";

async function startProcess() {
    const processSpawner = serviceProcessSpawner.getInstance();
    await processSpawner.startProcess();
    await processSpawner.isFinished;
}
startProcess();
