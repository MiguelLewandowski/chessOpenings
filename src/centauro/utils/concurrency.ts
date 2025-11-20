export async function runWithConcurrency<T, R>(
  items: T[],
  handler: (item: T, idx: number) => Promise<R>,
  max: number
): Promise<R[]> {
  const results: R[] = []
  let i = 0
  const running: Promise<void>[] = []

  async function runOne(idx: number) {
    try {
      const res = await handler(items[idx], idx)
      results[idx] = res
    } catch {
      // Em caso de erro, manter a posição do resultado como undefined
      // e continuar processamento dos demais itens
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      results[idx] = undefined
    }
  }

  while (i < items.length) {
    while (running.length < Math.max(1, max) && i < items.length) {
      const idx = i++
      const p = runOne(idx).finally(() => {
        const pos = running.indexOf(p)
        if (pos >= 0) running.splice(pos, 1)
      })
      running.push(p)
    }
    await Promise.race(running)
  }
  await Promise.all(running)
  return results
}