import { Logger } from '../../../shared/logger.js'
export function pgBossWorker(service) {
    return async (props) => {
        const result = await service.execute(props)

        if (result.isError()) {
            Logger.error(response.error())
            // return an error message to pg-boss to retry the operation
            throw response.error()
        }
    }
}

