const SELECTOR_COMPOSER = 'textarea.js-compose-text'

export const onComposerShown = (callback: (visible: boolean) => void): () => void => {
  const drawer = document.querySelector('.app-content')

  if (drawer === null) {
    throw new Error('Not found drawer (`.app-content`)')
  }

  let visible: boolean | undefined

  const onChange = (mutations: MutationRecord[]): void => {
    if (mutations.length > 0) {
      const added = mutations.some(({ addedNodes }) => {
        return Array.from(addedNodes).some((node) => node instanceof HTMLElement && node.querySelector(SELECTOR_COMPOSER) !== null)
      })
      const removed = mutations.some(({ removedNodes }) => {
        return Array.from(removedNodes).some((node) => node instanceof HTMLElement && node.querySelector(SELECTOR_COMPOSER) !== null)
      })

      // If we're here, it means the composer got removed and added in a single operation, so we need to do something a big different..
      if (removed && added) {
        // eslint-disable-next-line n/no-callback-literal
        callback(false)
        visible = false
        requestAnimationFrame(() => {
          // eslint-disable-next-line n/no-callback-literal
          callback(true)
          visible = true
        })
        return
      }
    }

    const composers = drawer?.querySelectorAll<HTMLTextAreaElement>(SELECTOR_COMPOSER) ?? []

    if (composers.length !== 1) {
      if (visible === true || visible === undefined) {
        // eslint-disable-next-line n/no-callback-literal
        callback(false)
      }

      visible = false
      return
    }

    if (visible === false || visible === undefined) {
      // eslint-disable-next-line n/no-callback-literal
      callback(true)
    }

    visible = true
  }

  const observer = new MutationObserver(onChange)
  observer.observe(drawer, {
    childList: true,
    subtree: true
  })
  onChange([])
  return () => {
    observer.disconnect()
  }
}
