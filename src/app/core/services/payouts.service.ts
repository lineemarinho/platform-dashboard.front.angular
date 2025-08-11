import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { PayoutsResponse } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PayoutsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getPayouts(skip: number = 0, take: number = 10): Observable<PayoutsResponse> {
    return this.http.post<PayoutsResponse>(`${this.baseUrl}/v1/payout/order`, {
      skip,
      take,
    });
  }
}
