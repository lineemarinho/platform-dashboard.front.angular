import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AccountHoldersResponse } from "../../shared/interfaces";

@Injectable({
  providedIn: "root",
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
