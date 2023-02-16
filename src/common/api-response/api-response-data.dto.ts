export class ApiResponseDataDTO {
  constructor(public data) {}
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
