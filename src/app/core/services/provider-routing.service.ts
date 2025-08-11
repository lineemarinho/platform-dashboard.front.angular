import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProviderRoutingResponse } from "../../shared/interfaces";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class ProviderRoutingService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getProviderRoutings(
    skip: number = 0,
    take: number = 10
  ): Observable<ProviderRoutingResponse> {
    return this.http.post<ProviderRoutingResponse>(
      `${this.baseUrl}/v1/provider-router/router/list`,
      {
        skip,
        take,
      }
    );
  }
}
