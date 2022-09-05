export const extractHashtags = (text: string): string[] => {
  // @ts-expect-error
  const hashtags = window.twttrTxt.extractHashtags(text)
  return hashtags
}
