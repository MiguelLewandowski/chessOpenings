import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { dificuldadeFromEnum, dificuldadeToEnum } from '@/server/mappers'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const licaoId = url.searchParams.get('licaoId')
  const where = licaoId ? { licaoId } : {}
  const items = await prisma.exercicio.findMany({ where, orderBy: { ordem: 'asc' } })
  return NextResponse.json(items.map(i => ({
    ...i,
    dificuldade: dificuldadeFromEnum(i.dificuldade as unknown as string)
  })))
}

export async function POST(request: Request) {
  const body = await request.json()
  const data = { ...body, dificuldade: dificuldadeToEnum(body.dificuldade) }
  const item = await prisma.exercicio.create({ data })
  return NextResponse.json({
    ...item,
    dificuldade: dificuldadeFromEnum(item.dificuldade as unknown as string)
  }, { status: 201 })
}
