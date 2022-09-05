import type twttrTxt from 'twitter-text'

declare global {
  interface Window {
    twttrTxt: typeof twttrTxt
  }
}
