import { hasComposer } from './hasComposer'

export const onReady = async (): Promise<void> => {
  await new Promise((resolve) => {
    const observer = new MutationObserver((mutations, observer) => {
      const hasAddedComposer = mutations.some(({ addedNodes }) => Array.from(addedNodes).some((node) => hasComposer(node)))

      if (hasAddedComposer) {
        observer.disconnect()
        resolve()
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}
