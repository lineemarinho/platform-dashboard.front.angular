import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AmlsResponse } from "../../shared/interfaces";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class AmlsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getAmls(skip: number = 0, take: number = 10): Observable<AmlsResponse> {
    return this.http.post<AmlsResponse>(`${this.baseUrl}/v1/aml/limit/list`, {
      skip,
      take,
    });
  }
}
