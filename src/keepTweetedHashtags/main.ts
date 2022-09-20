import { handleError } from '../lib/handleError'
import { handleReady } from './handleReady'
import { onReady } from './onReady'

onReady()
  .then(handleReady)
  .catch(handleError)
