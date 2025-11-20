export interface Logger {
  info(msg: string, ctx?: Record<string, unknown>): void
  warn(msg: string, ctx?: Record<string, unknown>): void
  error(msg: string, ctx?: Record<string, unknown>): void
}

export class ConsoleLogger implements Logger {
  info(msg: string, ctx?: Record<string, unknown>): void { console.log(format('INFO', msg, ctx)) }
  warn(msg: string, ctx?: Record<string, unknown>): void { console.warn(format('WARN', msg, ctx)) }
  error(msg: string, ctx?: Record<string, unknown>): void { console.error(format('ERROR', msg, ctx)) }
}

function format(level: string, msg: string, ctx?: Record<string, unknown>): string {
  const base = `[CENTAURO:${level}] ${msg}`
  return ctx ? `${base} ${JSON.stringify(ctx)}` : base
}