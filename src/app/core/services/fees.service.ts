import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { FeesResponse } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FeesService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getFees(skip: number = 0, take: number = 10): Observable<FeesResponse> {
    return this.http.post<FeesResponse>(`${this.baseUrl}/v1/fee/list`, {
      skip,
      take,
    });
  }
}
