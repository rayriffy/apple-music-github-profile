export interface ResponseBuilder<T = never> {
  message: string
  data: T
}
