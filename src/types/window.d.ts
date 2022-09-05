import type { extractHashtags } from 'twitter-text'

declare global {
  interface Window {
    twttrTxt: {
      extractHashtags: typeof extractHashtags
    }
  }
}
