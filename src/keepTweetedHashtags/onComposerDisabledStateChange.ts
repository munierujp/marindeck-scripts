import { onComposerShown } from './onComposerShown'

const SELECTOR_COMPOSER = '.drawer[data-drawer="compose"] textarea.js-compose-text'

export const onComposerDisabledStateChange = (callback: (disabled: boolean) => void): void => {
  const observer = new MutationObserver(() => {
    const composer = document.querySelector<HTMLTextAreaElement>(SELECTOR_COMPOSER)
    const disabled = composer?.disabled ?? false
    callback(disabled)
  })

  onComposerShown((visible) => {
    if (!visible) {
      observer.disconnect()
      return
    }

    const composer = document.querySelector<HTMLTextAreaElement>(SELECTOR_COMPOSER)

    if (composer === null) {
      return
    }

    observer.observe(composer, {
      attributes: true,
      attributeFilter: ['disabled']
    })
  })
}
