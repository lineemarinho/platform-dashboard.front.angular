import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FeesResponse } from "../../shared/interfaces";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class FeesService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getFees(skip: number = 0, take: number = 10): Observable<FeesResponse> {
    return this.http.post<FeesResponse>(`${this.baseUrl}/v1/fee/list`, {
      skip,
      take,
    });
  }
}
