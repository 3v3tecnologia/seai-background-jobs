(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    const { fetchEquipmentsMeasurementsService } = await import("../equipments/services/factories/fetch-measurements.service.js");

    await fetchEquipmentsMeasurementsService.execute()
})()