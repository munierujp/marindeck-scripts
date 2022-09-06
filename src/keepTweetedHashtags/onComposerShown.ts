import { hasComposer } from './hasComposer'

export const onComposerShown = (callback: (visible: boolean) => void): () => void => {
  /* eslint-disable n/no-callback-literal */
  const content = document.querySelector('.app-content')

  if (content === null) {
    throw new Error('Not found content.')
  }

  let visible: boolean | undefined

  const updateVisible = (): void => {
    const composers = content.querySelectorAll<HTMLTextAreaElement>('textarea.js-compose-text')

    if (composers.length === 0) {
      if (visible === true || visible === undefined) {
        callback(false)
      }

      visible = false
      return
    }

    if (visible === false || visible === undefined) {
      callback(true)
    }

    visible = true
  }

  const observer = new MutationObserver((mutations) => {
    if (mutations.length === 0) {
      updateVisible()
      return
    }

    const hasAddedComposer = mutations.some(({ addedNodes }) => Array.from(addedNodes).some((node) => hasComposer(node)))
    const hasRemovedComposer = mutations.some(({ removedNodes }) => Array.from(removedNodes).some((node) => hasComposer(node)))

    // If we're here, it means the composer got removed and added in a single operation, so we need to do something a big different..
    if (hasRemovedComposer && hasAddedComposer) {
      callback(false)
      visible = false

      requestAnimationFrame(() => {
        callback(true)
        visible = true
      })

      return
    }

    updateVisible()
  })
  observer.observe(content, {
    childList: true,
    subtree: true
  })
  updateVisible()
  return () => {
    observer.disconnect()
  }
  /* eslint-enable n/no-callback-literal */
}
