export const hasComposer = (node: Node): boolean => {
  return node instanceof HTMLElement && node.querySelector('textarea.js-compose-text') !== null
}
