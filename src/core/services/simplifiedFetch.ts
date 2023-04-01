export const simplifiedFetch = <T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> =>
  fetch(input, init).then(async o => {
    if (!o.ok) {
      throw new Error((await o.json()).message)
    }

    return await o.json()
  })
