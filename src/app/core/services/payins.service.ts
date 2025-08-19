import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PayinsResponse } from "../../shared/interfaces";
import { FilterBuilderUtil } from "../../shared/utils/filter-builder.util";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class PayinsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getPayins(
    skip: number = 0,
    take: number = 10,
    filters?: any
  ): Observable<PayinsResponse> {
    if (!filters || filters.length === 0) {
      return this.http.post<PayinsResponse>(`${this.baseUrl}/v1/payin/order`, {
        skip,
        take,
      });
    }

    const payload = FilterBuilderUtil.buildApiRequest(skip, take, filters);

    console.log("=== ENVIANDO PAYLOAD PARA API PAYINS ===");
    console.log("Payload:", payload);

    return this.http.post<PayinsResponse>(
      `${this.baseUrl}/v1/payin/order`,
      payload
    );
  }

  getPayinById(id: string): Observable<any> {
    console.log("=== BUSCANDO PAYIN POR ID ===");
    console.log("ID:", id);
    console.log("Base URL:", this.baseUrl);
    console.log("URL completa:", `${this.baseUrl}/v1/payin/order/${id}`);

    return this.http.get<any>(`${this.baseUrl}/v1/payin/order/${id}`);
  }
}
