import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { environments } from 'src/environment/environments';
import { Word, PaginatedResponse, Pagination } from '../interfaces/word.interface';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private readonly baseUrl: string = environments.baseUrl;

  private _words = signal<Word[]>([]);
  private _pagination = signal<Pagination>({countItems: 0, totalPages: 0});
  words = computed(() => this._words());
  pagination = computed(() => this._pagination());

  constructor(private http: HttpClient) {}

  findAllWords(startRow: number, itemsPerPage: number = 10) {
    const url = `${this.baseUrl}/words?skip=${startRow}&limit=${itemsPerPage}`;
    return this.http
      .get<PaginatedResponse<Word>>(url)
      .pipe(
        map(response => {
          this._pagination.set({countItems: response.countItems, totalPages: response.totalPages})
          this._words.set(response.words)
        }),
      );
  }

  findWordByName(word: string) {
    const url = `${this.baseUrl}/words`;
    return this.http.get(`${url}/${word}`);
  }

  createWord(
    word: Word
  ): Observable<{ englishWord: string; translation: string; id: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = `${this.baseUrl}/words`;
    return this.http.post<{
      englishWord: string;
      translation: string;
      id: string;
    }>(`${url}`, word, { headers });
  }
}
