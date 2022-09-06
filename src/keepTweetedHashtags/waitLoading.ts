import { hasComposer } from './hasComposer'

export const waitLoading = async (): Promise<void> => {
  return await new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      const hasAddedComposer = mutations.some(({ addedNodes }) => Array.from(addedNodes).some((node) => hasComposer(node)))

      if (hasAddedComposer) {
        resolve()
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}
