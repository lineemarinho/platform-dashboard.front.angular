import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AccountHolder, ApiResponse } from "../../shared/interfaces";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class AccountHoldersService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getAccountHoldersList(
    request: AccountHolder = {} as AccountHolder
  ): Observable<ApiResponse<AccountHolder[]>> {
    return this.http.post<ApiResponse<AccountHolder[]>>(
      `${this.baseUrl}/v1/account/holders`,
      request
    );
  }

  getAccountHolderById(id: string): Observable<ApiResponse<AccountHolder>> {
    return this.http.get<ApiResponse<AccountHolder>>(
      `${this.baseUrl}/v1/account/holders/${id}`
    );
  }

  searchAccountHolders(
    searchTerm: string,
    filters: Partial<AccountHolder> = {}
  ): Observable<ApiResponse<AccountHolder[]>> {
    const queryParams: Record<string, any> = {
      search: searchTerm,
      ...filters,
    };

    const queryString = Object.keys(queryParams)
      .filter(
        (key) => queryParams[key] !== undefined && queryParams[key] !== null
      )
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join("&");

    return this.http.get<ApiResponse<AccountHolder[]>>(
      `${this.baseUrl}/v1/account/holders/search?${queryString}`
    );
  }

  getAccountHoldersByCompany(
    companyId: string,
    request: AccountHolder = {} as AccountHolder
  ): Observable<ApiResponse<AccountHolder[]>> {
    return this.http.post<ApiResponse<AccountHolder[]>>(
      `${this.baseUrl}/v1/account/holders/company/${companyId}`,
      request
    );
  }
}
