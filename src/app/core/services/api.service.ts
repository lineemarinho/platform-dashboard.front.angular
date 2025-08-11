import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string;
  private readonly companyId: string;
  private readonly version: string = 'v1';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
    this.companyId = '813a4ba0-32e6-5aa4-9699-e98f72abd0eb';
  }

  protected get<TResponse>(
    route: string,
    queryParams: any = {}
  ): Observable<TResponse> {
    const url = this.buildUrl(route, queryParams);
    return this.http.get<TResponse>(url, { headers: this.getHeaders() });
  }

  protected post<TBody, TResponse>(
    body: TBody,
    route: string = '',
    queryParams: any = {}
  ): Observable<TResponse> {
    const url = this.buildUrl(route, queryParams);
    return this.http.post<TResponse>(url, body, { headers: this.getHeaders() });
  }

  protected put<TBody, TResponse>(
    body: TBody,
    route: string = '',
    queryParams: any = {},
    customHeaders: any = {}
  ): Observable<TResponse> {
    const url = this.buildUrl(route, queryParams);
    const headers = { ...this.getHeadersRaw(), ...customHeaders };
    return this.http.put<TResponse>(url, body, {
      headers: new HttpHeaders(headers),
    });
  }

  protected delete<TResponse>(
    route: string,
    queryParams: any = {},
    customHeaders: any = {}
  ): Observable<TResponse> {
    const url = this.buildUrl(route, queryParams);
    const headers = { ...this.getHeadersRaw(), ...customHeaders };
    return this.http.delete<TResponse>(url, {
      headers: new HttpHeaders(headers),
    });
  }

  private buildUrl(route: string, queryParams: any = {}): string {
    const fullRoute = route ? `/${route}` : '';
    const url = `${this.baseUrl}/${this.version}${fullRoute}`;

    if (Object.keys(queryParams).length === 0) {
      return url;
    }

    const queryString = Object.keys(queryParams)
      .filter(
        (key) => queryParams[key] !== undefined && queryParams[key] !== null
      )
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
      )
      .join('&');

    return `${url}?${queryString}`;
  }

  private getHeadersRaw(): any {
    const token = this.authService.getAccessTokenForAPI();

    return {
      'Content-Type': 'application/json',
      'Company-Id': this.companyId,
      Authorization: token ? `Bearer ${token}` : 'Bearer 123123123',
    };
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders(this.getHeadersRaw());
  }
}
