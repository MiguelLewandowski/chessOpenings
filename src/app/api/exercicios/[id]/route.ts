import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { dificuldadeFromEnum, dificuldadeToEnum } from '@/server/mappers'

export async function GET(_: Request, context: unknown) {
  const { params } = context as { params: { id: string } }
  const item = await prisma.exercicio.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    ...item,
    dificuldade: dificuldadeFromEnum(item.dificuldade as unknown as string)
  })
}

export async function PUT(request: Request, context: unknown) {
  const { params } = context as { params: { id: string } }
  const body = await request.json()
  const data = { ...body, dificuldade: dificuldadeToEnum(body.dificuldade) }
  const item = await prisma.exercicio.update({ where: { id: params.id }, data })
  return NextResponse.json({
    ...item,
    dificuldade: dificuldadeFromEnum(item.dificuldade as unknown as string)
  })
}

export async function DELETE(_: Request, context: unknown) {
  const { params } = context as { params: { id: string } }
  await prisma.exercicio.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
