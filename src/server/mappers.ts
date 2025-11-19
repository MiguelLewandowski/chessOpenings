type CategoriaUI = 'Tática' | 'Posicional' | 'Universal'
type DificuldadeUI = 'Iniciante' | 'Intermediário' | 'Avançado'

export const categoriaToEnum = (v: CategoriaUI | string) => {
  switch (v) {
    case 'Tática': return 'Tatica'
    case 'Posicional': return 'Posicional'
    case 'Universal': return 'Universal'
    default: return v
  }
}

export const categoriaFromEnum = (v: string): CategoriaUI | string => {
  switch (v) {
    case 'Tatica': return 'Tática'
    case 'Posicional': return 'Posicional'
    case 'Universal': return 'Universal'
    default: return v
  }
}

export const dificuldadeToEnum = (v: DificuldadeUI | string) => {
  switch (v) {
    case 'Iniciante': return 'Iniciante'
    case 'Intermediário': return 'Intermediario'
    case 'Avançado': return 'Avancado'
    default: return v
  }
}

export const dificuldadeFromEnum = (v: string): DificuldadeUI | string => {
  switch (v) {
    case 'Iniciante': return 'Iniciante'
    case 'Intermediario': return 'Intermediário'
    case 'Avancado': return 'Avançado'
    default: return v
  }
}

export const mapAberturaIn = <T extends { categoria: string; dificuldade: string }>(data: T): T => ({
  ...data,
  categoria: categoriaToEnum(data.categoria) as string,
  dificuldade: dificuldadeToEnum(data.dificuldade) as string
})

export const mapAberturaOut = <T extends { categoria: string; dificuldade: string }>(data: T): T => ({
  ...data,
  categoria: categoriaFromEnum(data.categoria) as string,
  dificuldade: dificuldadeFromEnum(data.dificuldade) as string
})

export const mapLicaoIn = <T extends { dificuldade: string }>(data: T): T => ({
  ...data,
  dificuldade: dificuldadeToEnum(data.dificuldade) as string
})

export const mapLicaoOut = <T extends { dificuldade: string }>(data: T): T => ({
  ...data,
  dificuldade: dificuldadeFromEnum(data.dificuldade) as string
})
