import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { UsersResponse } from '../../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl =
      environment.azureAD.auth.gowd.api.host +
      environment.azureAD.auth.gowd.api.context;
  }

  getUsers(skip: number = 0, take: number = 10): Observable<UsersResponse> {
    return this.http.post<UsersResponse>(
      `${this.baseUrl}/v1/access-control/list`,
      {
        skip,
        take,
      }
    );
  }
}
