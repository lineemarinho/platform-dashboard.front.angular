import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WithdrawalsResponse } from "../../shared/interfaces";
import { FilterBuilderUtil } from "../../shared/utils/filter-builder.util";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class WithdrawalsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getWithdrawals(
    skip: number = 0,
    take: number = 10,
    filters?: any[]
  ): Observable<WithdrawalsResponse> {
    if (!filters || filters.length === 0) {
      return this.http.post<WithdrawalsResponse>(
        `${this.baseUrl}/v1/withdraw/list`,
        { skip, take }
      );
    }

    const payload = FilterBuilderUtil.buildApiRequest(skip, take, filters);
    return this.http.post<WithdrawalsResponse>(
      `${this.baseUrl}/v1/withdraw/list`,
      payload
    );
  }
}
