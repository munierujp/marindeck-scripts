// @ts-check

/*
The MIT License (MIT)

Copyright (c) 2014 Damien Erambert
Copyright (c) 2021 Munieru

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/** @see https://github.com/eramdam/BetterTweetDeck/blob/main/src/features/keepTweetedHashtags.ts */

(function () {
  'use strict'

  /**
   * @param {number} timeout
   * @returns {Promise<void>}
   */
  const sleep = async (timeout) => {
    return await new Promise((resolve) => {
      setTimeout(resolve, timeout)
    })
  }

  /**
   * @param {string} text
   * @returns {string[]}
   */
  const extractHashtags = (text) => {
    // @ts-expect-error
    const hashtags = window.twttrTxt.extractHashtags(text)
    return hashtags
  }

  /**
   * @param {(visible: boolean) => void} callback
   * @returns {() => void}
   */
  const onComposerShown = (callback) => {
    const drawer = document.querySelector('.app-content')
    /** @type {boolean | undefined} */
    let visible

    /**
     * @param {MutationRecord[]} mutations
     */
    const onChange = (mutations) => {
      if (mutations.length > 0) {
        const hasRemovedComposer = mutations.some(({ removedNodes }) =>
          Array.from(removedNodes).some((node) => node instanceof HTMLElement && node.querySelector('textarea.js-compose-text') !== null)
        )
        const hasAddedComposer = mutations.some(({ addedNodes }) =>
          Array.from(addedNodes).some((node) => node instanceof HTMLElement && node.querySelector('textarea.js-compose-text') !== null)
        )

        // If we're here, it means the composer got removed and added in a single operation, so we need to do something a big different..
        if (hasRemovedComposer && hasAddedComposer) {
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

      const composers = drawer?.querySelectorAll('textarea.js-compose-text') || []
      const hasComposer = composers.length === 1

      if (!hasComposer) {
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
    // @ts-ignore
    observer.observe(drawer, {
      childList: true,
      subtree: true
    })
    onChange([])
    return () => {
      observer.disconnect()
    }
  }

  /**
   * @param {(disabled: boolean) => void} callback
   */
  const onComposerDisabledStateChange = (callback) => {
    const observer = new MutationObserver(() => {
      /** @type {HTMLTextAreaElement | null} */
      const composer = document.querySelector('.drawer[data-drawer="compose"] textarea.js-compose-text')
      const disabled = composer?.disabled ?? false
      callback(disabled)
    })

    onComposerShown((visible) => {
      if (!visible) {
        observer.disconnect()
        return
      }

      const composer = document.querySelector('.drawer[data-drawer="compose"] textarea.js-compose-text')

      if (composer === null) {
        return
      }

      observer.observe(composer, {
        attributes: true,
        attributeFilter: ['disabled']
      })
    })
  }

  const main = () => {
    /** @type {string[]} */
    let hashtags = []

    // Save hashtags when typing.
    document.body.addEventListener('keyup', ({ target }) => {
      if (target === null || !(target instanceof HTMLTextAreaElement) || !target.matches('textarea.js-compose-text')) {
        return
      }

      const extractedHashtags = extractHashtags(target.value)
      hashtags = extractedHashtags
    }, true)

    const pasteHashtags = () => {
      if (hashtags.length === 0) {
        return
      }

      /** @type {HTMLTextAreaElement | null} */
      const textarea = document.querySelector('textarea.js-compose-text')

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

  // NOTE: すぐに実行するとうまくいかないので1秒待っている
  // TODO: イベントやMutationObserverを使ってもっといい感じに書きたい
  sleep(1000).then(() => {
    main()
  })
})()
