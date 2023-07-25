export class SearchPostDto {
  title?: string;
  body?: string;
  orderBy?: 'ASC' | 'DESC';
  tag?: string;
  page?: number;
  limit?: number;
  take?: number;
}
