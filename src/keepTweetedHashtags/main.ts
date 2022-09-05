/** @see https://github.com/eramdam/BetterTweetDeck/blob/main/src/features/keepTweetedHashtags.ts */

import { extractHashtags } from './extractHashtags'
import { sleep } from './sleep'

(function () {
  const SELECTOR_COMPOSER = 'textarea.js-compose-text'

  const onComposerShown = (callback: (visible: boolean) => void): () => void => {
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
