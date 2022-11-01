(function () {
    'use strict';

    const handleError = (error) => {
        throw error;
    };

    const hasComposer = (node) => {
        return node instanceof HTMLElement && node.querySelector('textarea.js-compose-text') !== null;
    };

    const onComposerShown = (callback) => {
        /* eslint-disable n/no-callback-literal */
        const content = document.querySelector('.app-content');
        if (content === null) {
            throw new Error('Not found content.');
        }
        let visible;
        const updateVisible = () => {
            const composers = content.querySelectorAll('textarea.js-compose-text');
            if (composers.length === 0) {
                if (visible === true || visible === undefined) {
                    callback(false);
                }
                visible = false;
                return;
            }
            if (visible === false || visible === undefined) {
                callback(true);
            }
            visible = true;
        };
        const observer = new MutationObserver((mutations) => {
            if (mutations.length === 0) {
                updateVisible();
                return;
            }
            const hasAddedComposer = mutations.some(({ addedNodes }) => Array.from(addedNodes).some((node) => hasComposer(node)));
            const hasRemovedComposer = mutations.some(({ removedNodes }) => Array.from(removedNodes).some((node) => hasComposer(node)));
            // If we're here, it means the composer got removed and added in a single operation, so we need to do something a big different..
            if (hasRemovedComposer && hasAddedComposer) {
                callback(false);
                visible = false;
                requestAnimationFrame(() => {
                    callback(true);
                    visible = true;
                });
                return;
            }
            updateVisible();
        });
        observer.observe(content, {
            childList: true,
            subtree: true
        });
        updateVisible();
        return () => {
            observer.disconnect();
        };
        /* eslint-enable n/no-callback-literal */
    };

    const getComposerElement = () => {
        return document.querySelector('.drawer[data-drawer="compose"] textarea.js-compose-text') ?? undefined;
    };
    const onComposerDisabledStateChange = (callback) => {
        const observer = new MutationObserver(() => {
            const composer = getComposerElement();
            const disabled = composer?.disabled ?? false;
            callback(disabled);
        });
        onComposerShown((visible) => {
            if (!visible) {
                observer.disconnect();
                return;
            }
            const composer = getComposerElement();
            if (composer === undefined) {
                return;
            }
            observer.observe(composer, {
                attributes: true,
                attributeFilter: ['disabled']
            });
        });
    };

    const SELECTOR_COMPOSER = 'textarea.js-compose-text';
    const handleReady = () => {
        let hashtags = [];
        // Save hashtags when typing.
        document.body.addEventListener('keyup', ({ target }) => {
            if (!(target instanceof HTMLTextAreaElement) || !target.matches(SELECTOR_COMPOSER)) {
                return;
            }
            hashtags = window.twttrTxt.extractHashtags(target.value);
        }, true);
        const pasteHashtags = () => {
            if (hashtags.length === 0) {
                return;
            }
            const textarea = document.querySelector(SELECTOR_COMPOSER);
            if (textarea === null) {
                return;
            }
            textarea.value = ` ${hashtags.map((tag) => `#${tag}`).join(' ')}`;
            textarea.selectionStart = 0;
            textarea.selectionEnd = 0;
            textarea.dispatchEvent(new Event('change'));
        };
        // Re-instate hashtags when the composer is enabled again.
        onComposerDisabledStateChange((disabled) => {
            if (!disabled) {
                pasteHashtags();
            }
        });
        // Re-add hashtags when the composer is back.
        onComposerShown((visible) => {
            if (visible) {
                pasteHashtags();
            }
        });
    };

    const onReady = async () => {
        return await new Promise((resolve) => {
            const observer = new MutationObserver((mutations, observer) => {
                const hasAddedComposer = mutations.some(({ addedNodes }) => Array.from(addedNodes).some((node) => hasComposer(node)));
                if (hasAddedComposer) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    onReady()
        .then(handleReady)
        .catch(handleError);

})();
