import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PayinsResponse } from "../../shared/interfaces";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class PayinsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getPayins(skip: number = 0, take: number = 10): Observable<PayinsResponse> {
    return this.http.post<PayinsResponse>(`${this.baseUrl}/v1/payin/order`, {
      skip,
      take,
    });
  }
}
