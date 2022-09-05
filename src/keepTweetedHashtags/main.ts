import { extractHashtags } from './extractHashtags'
import { onComposerDisabledStateChange } from './onComposerDisabledStateChange'
import { onComposerShown } from './onComposerShown'
import { sleep } from './sleep'

(function () {
  const SELECTOR_COMPOSER = 'textarea.js-compose-text'

  const main = async (): Promise<void> => {
    // NOTE: すぐに実行するとうまくいかないので1秒待っている
    // TODO: イベントやMutationObserverを使ってもっといい感じに書きたい
    await sleep(1000)

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

  main().catch((error: unknown) => console.error(error))
})()