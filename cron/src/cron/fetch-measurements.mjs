(async function () {
    const { config } = await import("dotenv")
    config({
        path: '/usr/src/app/.env'
    })
    try {
        const { fetchEquipmentsMeasurementsService } = await import("../equipments/services/factories/fetch-measurements.service.js");

        await fetchEquipmentsMeasurementsService.execute()
        process.exit(0)
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
})()