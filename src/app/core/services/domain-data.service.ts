import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { DomainDataResponse } from "../../shared/interfaces";

@Injectable({
  providedIn: "root",
})
export class DomainDataService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getDomainData(
    skip: number = 0,
    take: number = 10
  ): Observable<DomainDataResponse> {
    return this.http.post<DomainDataResponse>(
      `${this.baseUrl}/v1/domain-service/enum-domain/list`,
      {
        skip,
        take,
      }
    );
  }
}
