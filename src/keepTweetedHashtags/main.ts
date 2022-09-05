/** @see https://github.com/eramdam/BetterTweetDeck/blob/main/src/features/keepTweetedHashtags.ts */

import { extractHashtags } from './extractHashtags'
import { onComposerShown } from './onComposerShown'
import { sleep } from './sleep'

(function () {
  const SELECTOR_COMPOSER = 'textarea.js-compose-text'

  const onComposerDisabledStateChange = (callback: (disabled: boolean) => void): void => {
    const observer = new MutationObserver(() => {
      const composer = document.querySelector<HTMLTextAreaElement>(`.drawer[data-drawer="compose"] ${SELECTOR_COMPOSER}`)
      const disabled = composer?.disabled ?? false
      callback(disabled)
    })
    onComposerShown((visible) => {
      if (!visible) {
        observer.disconnect()
        return
      }

      const composer = document.querySelector<HTMLTextAreaElement>(`.drawer[data-drawer="compose"] ${SELECTOR_COMPOSER}`)

      if (composer === null) {
        return
      }

      observer.observe(composer, {
        attributes: true,
        attributeFilter: ['disabled']
      })
    })
  }

  const main = async (): Promise<void> => {
    // NOTE: すぐに実行するとうまくいかないので5秒待っている
    // TODO: イベントやMutationObserverを使ってもっといい感じに書きたい
    await sleep(5000)

    let hashtags: string[] = []

    // Save hashtags when typing.
    document.body.addEventListener(
      'keyup',
      ({ target }) => {
        if (!(target instanceof HTMLTextAreaElement) || !target.matches(SELECTOR_COMPOSER)) {
          return
        }

        const extractedHashtags = extractHashtags(target.value)
        hashtags = extractedHashtags
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

  main().catch(error => console.error(error))
})()
