export class ApiResponse<T> {
  private response: { data: T, errors: string[] }

  constructor(response: { data: T, errors: string[] }) {
    this.response = response
  }

  public get data(): T {
    return this.response.data
  }

  get errors(): string[] {
    return this.response.errors
  }

  get isErrored(): boolean {
    return this.response.errors.length > 0
  }
}
