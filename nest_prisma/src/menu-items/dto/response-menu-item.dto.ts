export class ResponseMenuItemDto {
  id: number;

  name: string;

  url: string;

  parentId: number;

  createdAt: Date;

  children: ResponseMenuItemDto[];
}
