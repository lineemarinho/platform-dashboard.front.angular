import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { ProviderRoutingResponse } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProviderRoutingService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getProviderRoutings(
    skip: number = 0,
    take: number = 10
  ): Observable<ProviderRoutingResponse> {
    return this.http.post<ProviderRoutingResponse>(
      `${this.baseUrl}/v1/provider-router/router/list`,
      {
        skip,
        take,
      }
    );
  }
}
