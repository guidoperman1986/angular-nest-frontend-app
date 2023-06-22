export interface Word {
  englishWord: string;
  translation: string;
  _id?: string;
}

export interface PaginatedResponse<T> {
  countItems: number;
  words: T[];
  totalPages: number;
}

export type Pagination = Pick<PaginatedResponse<Word>,'countItems' | 'totalPages'>
