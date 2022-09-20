import { onComposerDisabledStateChange } from './onComposerDisabledStateChange'
import { onComposerShown } from './onComposerShown'

const SELECTOR_COMPOSER = 'textarea.js-compose-text'

export const handleReady = (): void => {
  let hashtags: string[] = []

  // Save hashtags when typing.
  document.body.addEventListener(
    'keyup',
    ({ target }) => {
      if (!(target instanceof HTMLTextAreaElement) || !target.matches(SELECTOR_COMPOSER)) {
        return
      }

      hashtags = window.twttrTxt.extractHashtags(target.value)
    },
    true
  )

  const pasteHashtags = (): void => {
    if (hashtags.length === 0) {
      return
    }

    const textarea = document.querySelector<HTMLTextAreaElement>(SELECTOR_COMPOSER)

    if (textarea === null) {
      return
    }

    textarea.value = ` ${hashtags.map((tag) => `#${tag}`).join(' ')}`
    textarea.selectionStart = 0
    textarea.selectionEnd = 0
    textarea.dispatchEvent(new Event('change'))
  }

  // Re-instate hashtags when the composer is enabled again.
  onComposerDisabledStateChange((disabled) => {
    if (!disabled) {
      pasteHashtags()
    }
  })

  // Re-add hashtags when the composer is back.
  onComposerShown((visible) => {
    if (visible) {
      pasteHashtags()
    }
  })
}
