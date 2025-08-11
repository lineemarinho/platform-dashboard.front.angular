import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.dev";
import { PayoutsResponse } from "../../shared/interfaces";
import { FilterBuilderUtil } from "../../shared/utils/filter-builder.util";

@Injectable({
  providedIn: "root",
})
export class PayoutsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getPayouts(
    skip: number = 0,
    take: number = 10,
    filters?: any
  ): Observable<PayoutsResponse> {
    // Se não houver filtros, usa o formato simples
    if (!filters || filters.length === 0) {
      return this.http.post<PayoutsResponse>(
        `${this.baseUrl}/v1/payout/order`,
        {
          skip,
          take,
        }
      );
    }

    // Se houver filtros, usa o formato completo da API
    const payload = FilterBuilderUtil.buildApiRequest(skip, take, filters);

    console.log("=== ENVIANDO PAYLOAD PAYOUTS PARA API ===");
    console.log("Payload:", payload);

    return this.http.post<PayoutsResponse>(
      `${this.baseUrl}/v1/payout/order`,
      payload
    );
  }

  getPayoutDetails(payoutId: string): Observable<any> {
    const url = `${this.baseUrl}/v1/payin/order/${payoutId}`;

    console.log("=== BUSCANDO DETALHES DO PAYOUT ===");
    console.log("URL:", url);
    console.log("ID:", payoutId);

    return this.http.get(url);
  }
}
