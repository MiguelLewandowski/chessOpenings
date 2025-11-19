import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { mapAberturaIn, mapAberturaOut } from '@/server/mappers'

export async function GET(_: Request, context: unknown) {
  const { params } = context as { params: { id: string } }
  const item = await prisma.abertura.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(mapAberturaOut(item))
}

export async function PUT(request: Request, context: unknown) {
  const { params } = context as { params: { id: string } }
  const data = mapAberturaIn(await request.json())
  const item = await prisma.abertura.update({ where: { id: params.id }, data })
  return NextResponse.json(mapAberturaOut(item))
}

export async function DELETE(_: Request, context: unknown) {
  const { params } = context as { params: { id: string } }
  await prisma.abertura.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
