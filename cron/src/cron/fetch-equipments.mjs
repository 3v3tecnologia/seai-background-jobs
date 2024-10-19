
(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    try {
        const { fetchEquipmentsService } = await import("../equipments/services/factories/fetch-equipments.service.js");

        await fetchEquipmentsService.execute()
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
})()