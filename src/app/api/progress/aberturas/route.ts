import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

export async function POST(request: Request) {
  const body = await request.json()
  const { aberturaId, currentLicaoIndex, totalScore, totalTime, isCompleted, userId } = body
  const uid = userId || 'default'
  const existing = await prisma.aberturaProgress.findFirst({ where: { userId: uid, aberturaId } })
  const data = { userId: uid, aberturaId, currentLicaoIndex, totalScore, totalTime, isCompleted }
  const item = existing
    ? await prisma.aberturaProgress.update({ where: { id: existing.id }, data })
    : await prisma.aberturaProgress.create({ data })
  return NextResponse.json(item)
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const aberturaId = url.searchParams.get('aberturaId')
  const userId = url.searchParams.get('userId') || 'default'
  if (!aberturaId) return NextResponse.json({ error: 'aberturaId requerido' }, { status: 400 })
  await prisma.aberturaProgress.deleteMany({ where: { aberturaId, userId } })
  await prisma.licaoProgress.deleteMany({ where: { userId, licao: { aberturaId } } })
  return NextResponse.json({ ok: true })
}
