import { onComposerShown } from './onComposerShown'

const getComposerElement = (): HTMLTextAreaElement | undefined => {
  return document.querySelector<HTMLTextAreaElement>('.drawer[data-drawer="compose"] textarea.js-compose-text') ?? undefined
}

export const onComposerDisabledStateChange = (callback: (disabled: boolean) => void): void => {
  const observer = new MutationObserver(() => {
    const composer = getComposerElement()
    const disabled = composer?.disabled ?? false
    callback(disabled)
  })

  onComposerShown((visible) => {
    if (!visible) {
      observer.disconnect()
      return
    }

    const composer = getComposerElement()

    if (composer === undefined) {
      return
    }

    observer.observe(composer, {
      attributes: true,
      attributeFilter: ['disabled']
    })
  })
}
