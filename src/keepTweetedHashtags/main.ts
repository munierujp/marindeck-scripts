import { handleReady } from './handleReady'
import { onReady } from './onReady'

onReady()
  .then(handleReady)
  .catch((error: unknown) => console.error(error))
