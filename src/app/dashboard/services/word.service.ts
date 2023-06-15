import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { environments } from 'src/environment/environments';
import { Word } from '../interfaces/word.interface';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private readonly baseUrl: string = environments.baseUrl;

  private _words = signal<Word[]>([]);
  words = computed(()=> this._words());


  constructor(private http: HttpClient) { }

  findAllWords() {
    const url = `${this.baseUrl}/words`
    return this.http.get(url)
  }

  findWordByName(word: string) {
    const url = `${this.baseUrl}/words`
    return this.http.get(`${url}/${word}`)
  }
  
  createWord(word: Word) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const url = `${this.baseUrl}/words`
    return this.http.post(`${url}`, word, { headers });
  }

}
