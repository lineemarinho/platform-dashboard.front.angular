import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { CompaniesResponse } from "../../shared/interfaces";

@Injectable({
  providedIn: "root",
})
export class CompaniesService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
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
