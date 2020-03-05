interface Cache {
  set(key: string, value: any): value
  get(key: string): any
  clear(): void
}

interface Expr {
  setConfig(config: { contentSecurityPolicy: boolean }): void

  Cache: {
    new (maxSize: number): Cache
  }

  split(path: string): string[]
  setter(path: string): (data: any, value: any) => any
  getter(path: string): (data: any) => any
  join(segments: string[]): string
  forEach(
    path: string,
    callback: (
      part: string,
      isBracket: boolean,
      isArray: boolean,
      idx: number,
      parts: string[]
    ) => any
  ): void
}

export = Expr
