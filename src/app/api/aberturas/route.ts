import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'
import { mapAberturaIn, mapAberturaOut } from '@/server/mappers'

export async function GET() {
  const items = await prisma.abertura.findMany({ orderBy: { nome: 'asc' } })
  return NextResponse.json(items.map(mapAberturaOut))
}

export async function POST(request: Request) {
  const data = mapAberturaIn(await request.json())
  const item = await prisma.abertura.create({ data })
  return NextResponse.json(mapAberturaOut(item), { status: 201 })
}
