import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CompaniesResponse } from "../../shared/interfaces";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class CompaniesService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getCompanies(
    skip: number = 0,
    take: number = 10
  ): Observable<CompaniesResponse> {
    return this.http.post<CompaniesResponse>(`${this.baseUrl}/v1/company`, {
      skip,
      take,
    });
  }
}
