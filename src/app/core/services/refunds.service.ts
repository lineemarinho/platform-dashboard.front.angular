import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { RefundsResponse } from '../../shared/interfaces';
import { FilterBuilderUtil } from '../../shared/utils/filter-builder.util';

@Injectable({
  providedIn: 'root',
})
export class RefundsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getRefunds(
    skip: number = 0,
    take: number = 10,
    filters?: any
  ): Observable<RefundsResponse> {
    // Se não houver filtros, usa o formato simples
    if (!filters || filters.length === 0) {
      return this.http.post<RefundsResponse>(
        `${this.baseUrl}/v1/payin/order/refund/list`,
        {
          skip,
          take,
        }
      );
    }

    // Se houver filtros, usa o formato completo da API
    const payload = FilterBuilderUtil.buildApiRequest(skip, take, filters);

    console.log("=== ENVIANDO PAYLOAD REFUNDS PARA API ===");
    console.log("Payload:", payload);

    return this.http.post<RefundsResponse>(
      `${this.baseUrl}/v1/payin/order/refund/list`,
      payload
    );
  }
}
