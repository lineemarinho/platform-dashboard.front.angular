import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { AccountHoldersResponse } from '../../shared/interfaces';
import { ApiFilterRequest } from '../../shared/utils/filter-builder.util';
import { FilterBuilderUtil } from '../../shared/utils/filter-builder.util';

@Injectable({
  providedIn: 'root',
})
export class HoldingsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getHoldings(
    skip: number = 0,
    take: number = 10,
    filters?: any
  ): Observable<AccountHoldersResponse> {
    // Se não houver filtros, usa o formato simples
    if (!filters || filters.length === 0) {
      return this.http.post<AccountHoldersResponse>(
        `${this.baseUrl}/v1/account/holders`,
        {
          skip,
          take,
        }
      );
    }

    // Se houver filtros, usa o formato completo da API
    const payload = FilterBuilderUtil.buildApiRequest(skip, take, filters);

    console.log("=== ENVIANDO PAYLOAD PARA API ===");
    console.log("Payload:", payload);

    return this.http.post<AccountHoldersResponse>(
      `${this.baseUrl}/v1/account/holders`,
      payload
    );
  }
}
