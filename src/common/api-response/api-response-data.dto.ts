export class ApiResponseDataDTO<T = any> {
  constructor(public data: T) {}
}

export class ApiResponsePagenationDataDTO<T, D = any> {
  constructor(
    public meta: {
      perPage: number;
      currentPage: number;
      pageItemCount: number;
    } & T,
    public data: D,
  ) {}
}
