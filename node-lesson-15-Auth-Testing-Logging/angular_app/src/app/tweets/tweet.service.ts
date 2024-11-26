import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTweets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tweets`);
  }

  postTweet(data: { content: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/tweets`, data);
  }

  deleteTweet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tweets/${id}`);
  }

  likeTweet(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/tweets/${id}/like`, {});
  }

  getTweetById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tweets/${id}`);
  }
}
