import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PayoutsResponse } from "../../shared/interfaces";
import { getApiUrl } from "../../shared/utils/organization-auth.util";

@Injectable({
  providedIn: "root",
})
export class PayoutsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = getApiUrl();
  }

  getPayouts(skip: number = 0, take: number = 10): Observable<PayoutsResponse> {
    return this.http.post<PayoutsResponse>(`${this.baseUrl}/v1/payout/order`, {
      skip,
      take,
    });
  }
}
