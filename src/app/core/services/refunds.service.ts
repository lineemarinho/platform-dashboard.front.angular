import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { RefundsResponse } from "../../shared/interfaces";

@Injectable({
  providedIn: "root",
})
export class RefundsService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getRefunds(skip: number = 0, take: number = 10): Observable<RefundsResponse> {
    return this.http.post<RefundsResponse>(
      `${this.baseUrl}/v1/payin/order/refund/list`,
      {
        skip,
        take,
      }
    );
  }
}
