import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { environments } from 'src/environment/environments';
import { Word } from '../interfaces/word.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private readonly baseUrl: string = environments.baseUrl;

  private _words = signal<Word[]>([]);
  words = computed(() => this._words());

  constructor(private http: HttpClient) {}

  findAllWords() {
    const url = `${this.baseUrl}/words`;
    return this.http.get<Word[]>(url).pipe(
      map(words=>this._words.set(words))
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
