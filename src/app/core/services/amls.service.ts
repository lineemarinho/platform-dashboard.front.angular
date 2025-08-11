import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { AmlsResponse } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AmlsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getAmls(skip: number = 0, take: number = 10): Observable<AmlsResponse> {
    return this.http.post<AmlsResponse>(`${this.baseUrl}/v1/aml/limit/list`, {
      skip,
      take,
    });
  }
}
