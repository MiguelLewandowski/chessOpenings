import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { mapLicaoIn, mapLicaoOut } from '@/server/mappers'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const aberturaId = url.searchParams.get('aberturaId')
  const where = aberturaId ? { aberturaId } : {}
  const items = await prisma.licao.findMany({ where, orderBy: { ordem: 'asc' } })
  return NextResponse.json(items.map(mapLicaoOut))
}

export async function POST(request: Request) {
  const data = mapLicaoIn(await request.json())
  const item = await prisma.licao.create({ data })
  return NextResponse.json(mapLicaoOut(item), { status: 201 })
}
