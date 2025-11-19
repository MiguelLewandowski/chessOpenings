import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { mapLicaoIn, mapLicaoOut } from '@/server/mappers'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = await prisma.licao.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(mapLicaoOut(item))
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = mapLicaoIn(await request.json())
  const item = await prisma.licao.update({ where: { id: params.id }, data })
  return NextResponse.json(mapLicaoOut(item))
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.licao.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
