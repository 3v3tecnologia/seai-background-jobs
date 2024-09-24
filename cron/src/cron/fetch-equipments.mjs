
(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    const { fetchEquipmentsService } = await import("../equipments/services/factories/fetch-equipments.service.js");

    await fetchEquipmentsService.execute()
})()