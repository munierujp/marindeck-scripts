export const sleep = async (timeout: number): Promise<void> => {
  return await new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}
