export type StockfishOptions = { skill?: number; movetime?: number }

export class StockfishEngine {
  private worker: Worker | null = null
  private ready = false

  async init() {
    if (this.worker) return
    try {
      const res = await fetch('https://unpkg.com/stockfish@16.1.0/stockfish.js')
      if (!res.ok) throw new Error('fetch failed')
      const code = await res.text()
      const blob = new Blob([code], { type: 'text/javascript' })
      const url = URL.createObjectURL(blob)
      this.worker = new Worker(url)
      await this.sendAndWait('uci', 'uciok')
      await this.sendAndWait('isready', 'readyok')
      this.ready = true
    } catch {
      this.dispose()
      this.ready = false
    }
  }

  dispose() {
    if (this.worker) {
      this.worker.terminate()
      this.worker = null
      this.ready = false
    }
  }

  async bestmove(fen: string, opts: StockfishOptions = {}) {
    if (!this.worker || !this.ready) await this.init()
    if (!this.worker || !this.ready) return ''
    const skill = Math.max(0, Math.min(20, opts.skill ?? 2))
    const movetime = Math.max(100, Math.min(3000, opts.movetime ?? 600))
    await this.send(`ucinewgame`)
    await this.sendAndWait('isready', 'readyok')
    await this.send(`setoption name Skill Level value ${skill}`)
    await this.send(`position fen ${fen}`)
    const move = await this.go(movetime)
    return move || ''
  }

  private send(cmd: string) {
    this.worker?.postMessage(cmd)
  }

  private sendAndWait(cmd: string, expect: string): Promise<void> {
    return new Promise(resolve => {
      const onMsg = (e: MessageEvent) => {
        const text = String(e.data)
        if (text.includes(expect)) {
          this.worker?.removeEventListener('message', onMsg as any)
          resolve()
        }
      }
      this.worker?.addEventListener('message', onMsg as any)
      this.send(cmd)
    })
  }

  private go(movetime: number): Promise<string> {
    return new Promise(resolve => {
      let best: string | null = null
      const onMsg = (e: MessageEvent) => {
        const text = String(e.data)
        if (text.startsWith('bestmove')) {
          const parts = text.split(' ')
          best = parts[1]
          this.worker?.removeEventListener('message', onMsg as any)
          resolve(best || '')
        }
      }
      this.worker?.addEventListener('message', onMsg as any)
      this.send(`go movetime ${movetime}`)
    })
  }
}
