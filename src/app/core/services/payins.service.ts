import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { PayinsResponse } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PayinsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getPayins(skip: number = 0, take: number = 10): Observable<PayinsResponse> {
    return this.http.post<PayinsResponse>(`${this.baseUrl}/v1/payin/order`, {
      skip,
      take,
    });
  }
}
