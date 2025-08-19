import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AccountHoldersResponse } from "../../shared/interfaces";
import { FilterBuilderUtil } from "../../shared/utils/filter-builder.util";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class HoldingsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getHoldings(
    skip: number = 0,
    take: number = 10,
    filters?: any
  ): Observable<AccountHoldersResponse> {
    if (!filters || filters.length === 0) {
      return this.http.post<AccountHoldersResponse>(
        `${this.baseUrl}/v1/account/holders`,
        {
          skip,
          take,
        }
      );
    }

    const payload = FilterBuilderUtil.buildApiRequest(skip, take, filters);

    console.log("=== ENVIANDO PAYLOAD PARA API ===");
    console.log("Payload:", payload);

    return this.http.post<AccountHoldersResponse>(
      `${this.baseUrl}/v1/account/holders`,
      payload
    );
  }
}
