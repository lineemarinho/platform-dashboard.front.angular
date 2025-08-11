import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AccountHoldersResponse } from "../../shared/interfaces";
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
    take: number = 10
  ): Observable<AccountHoldersResponse> {
    return this.http.post<AccountHoldersResponse>(
      `${this.baseUrl}/v1/account/holders`,
      {
        skip,
        take,
      }
    );
  }
}
