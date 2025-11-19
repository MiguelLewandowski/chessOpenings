import { NextResponse } from 'next/server'
import { prisma } from '@/server/db'

export async function POST(request: Request) {
  const body = await request.json()
  const { licaoId, isCompleted, totalScore, totalTime, completedAt, userId } = body
  const uid = userId || 'default'
  const existing = await prisma.licaoProgress.findFirst({ where: { userId: uid, licaoId } })
  const data: { userId: string; licaoId: string; isCompleted: boolean; totalScore: number; totalTime: number; completedAt?: Date } = { userId: uid, licaoId, isCompleted, totalScore, totalTime }
  if (completedAt) data.completedAt = new Date(completedAt)
  const item = existing
    ? await prisma.licaoProgress.update({ where: { id: existing.id }, data })
    : await prisma.licaoProgress.create({ data })
  return NextResponse.json(item)
}

export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const licaoId = url.searchParams.get('licaoId')
  const userId = url.searchParams.get('userId') || 'default'
  if (!licaoId) return NextResponse.json({ error: 'licaoId requerido' }, { status: 400 })
  await prisma.licaoProgress.deleteMany({ where: { licaoId, userId } })
  return NextResponse.json({ ok: true })
}
