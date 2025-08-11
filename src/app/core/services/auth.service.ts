import { computed, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import {
  AccountInfo,
  AuthenticationResult,
  BrowserAuthError,
  BrowserCacheLocation,
  InteractionRequiredAuthError,
  PublicClientApplication,
} from "@azure/msal-browser";
import { environment } from "../../environments/environment";
import { authOrganizationSettings } from "../../shared/utils/organization-auth.util";

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  roles?: string[];
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private msalInstance!: PublicClientApplication;
  private _isAuthenticated = signal(false);
  private _user = signal<User | null>(null);
  private _isLoading = signal(false);
  private _isInitialized = signal(false);

  public isAuthenticated = computed(() => this._isAuthenticated());
  public user = computed(() => this._user());
  public isLoading = computed(() => this._isLoading());
  public isInitialized = computed(() => this._isInitialized());

  constructor(private router: Router) {
    this.initializeMsal();
  }

  private async initializeMsal(): Promise<void> {
    try {
      const config = authOrganizationSettings();

      this.msalInstance = new PublicClientApplication({
        auth: {
          clientId: config.clientId,
          authority: config.authority,
          redirectUri: config.redirectUri,
          navigateToLoginRequestUrl: true,
        },
        cache: {
          cacheLocation: BrowserCacheLocation.SessionStorage,
          storeAuthStateInCookie: false,
        },
        system: {
          loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
              if (containsPii) {
                return;
              }
              switch (level) {
                case 0:
                  console.error(message);
                  break;
                case 1:
                  console.warn(message);
                  break;
                case 2:
                  console.info(message);
                  break;
                case 3:
                  console.debug(message);
                  break;
                default:
                  console.log(message);
                  break;
              }
            },
            logLevel: 2,
          },
        },
      });

      await this.msalInstance.initialize();

      try {
        const response = await this.msalInstance.handleRedirectPromise();
        if (response) {
          this.handleAuthResponse(response);
        }
      } catch (error) {
        this.clearUserData();
      }

      await this.checkAuthState();

      this._isInitialized.set(true);
    } catch (error) {
      console.error("Error initializing MSAL:", error);
      this._isInitialized.set(true);
    }
  }

  private async checkAuthState(): Promise<void> {
    try {
      const accounts = this.msalInstance.getAllAccounts();

      if (accounts.length > 0) {
        const account = accounts[0];
        const token = await this.getAccessToken(account);
        if (token) {
          this.processUserData(account, token);
        }
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    }
  }

  private async getAccessToken(account: AccountInfo): Promise<string | null> {
    try {
      const config = authOrganizationSettings();
      const request = {
        scopes: [config.scope],
        account: account,
      };

      const response = await this.msalInstance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        return null;
      }
      if (
        error instanceof BrowserAuthError &&
        error.errorCode === "no_token_request_cache_error"
      ) {
        this.clearUserData();
        return null;
      }
      console.error("Error acquiring token:", error);
      return null;
    }
  }

  private handleAuthResponse(response: AuthenticationResult): void {
    if (response.account) {
      this.processUserData(response.account, response.accessToken);
    }
  }

  private processUserData(account: AccountInfo, accessToken: string): void {
    try {
      const tokenPayload = this.decodeJwtToken(accessToken);

      const user: User = {
        id: account.localAccountId || account.homeAccountId,
        name: account.name || tokenPayload.name || "",
        email: account.username || tokenPayload.email || "",
        company: tokenPayload.company || "GOWD",
        roles: tokenPayload.roles || [],
      };

      this.saveUserData(user, accessToken);
      this._user.set(user);
      this._isAuthenticated.set(true);

      const originalUrl = sessionStorage.getItem("originalUrl");
      if (originalUrl) {
        sessionStorage.removeItem("originalUrl");
        this.router.navigateByUrl(originalUrl);
      } else {
        this.router.navigate(["/holdings"]);
      }
    } catch (error) {
      console.error("Error processing user data:", error);
      this.clearUserData();
    }
  }

  private decodeJwtToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return {};
    }
  }

  private saveUserData(user: User, token: string): void {
    try {
      const config = environment.sessionStorage;
      sessionStorage.setItem(config.user, JSON.stringify(user));
      sessionStorage.setItem("accessToken", token);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }

  public async login(): Promise<void> {
    if (!this._isInitialized()) {
      await new Promise<void>((resolve) => {
        const checkInit = () => {
          if (this._isInitialized()) {
            resolve();
          } else {
            setTimeout(checkInit, 100);
          }
        };
        checkInit();
      });
    }

    this._isLoading.set(true);

    try {
      this.clearUserData();

      const config = authOrganizationSettings();
      const request = {
        scopes: [config.scope],
        prompt: "select_account",
      };

      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      if (isMobile) {
        await this.msalInstance.loginRedirect(request);
      } else {
        const response = await this.msalInstance.loginPopup(request);
        this.handleAuthResponse(response);
      }
    } catch (error) {
      console.error("Login error:", error);
      this._isLoading.set(false);

      if (error instanceof BrowserAuthError) {
        switch (error.errorCode) {
          case "no_token_request_cache_error":
            this.clearUserData();
            setTimeout(() => {
              this.login();
            }, 1000);
            break;
          case "user_cancelled":
            break;
          case "popup_window_error":
            try {
              const config = authOrganizationSettings();
              const request = {
                scopes: [config.scope],
                prompt: "select_account",
              };
              await this.msalInstance.loginRedirect(request);
            } catch (redirectError) {
              console.error("Redirect login also failed:", redirectError);
            }
            break;
          default:
            console.error(
              "Browser auth error:",
              error.errorCode,
              error.errorMessage
            );
            break;
        }
      } else {
        console.error("Generic login error:", error);
      }
    }
  }

  public async logout(): Promise<void> {
    try {
      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );

        if (isMobile) {
          await this.msalInstance.logoutRedirect();
        } else {
          await this.msalInstance.logoutPopup();
        }
      }

      this.clearUserData();
      this._user.set(null);
      this._isAuthenticated.set(false);

      this.router.navigate(["/login"]);
    } catch (error) {
      console.error("Logout error:", error);
      this.clearUserData();
      this._user.set(null);
      this._isAuthenticated.set(false);
      this.router.navigate(["/login"]);
    }
  }

  private clearUserData(): void {
    try {
      const config = environment.sessionStorage;
      sessionStorage.removeItem(config.user);
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("originalUrl");

      this.msalInstance.clearCache();
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }

  public getAccessTokenForAPI(): string | null {
    return sessionStorage.getItem("accessToken");
  }

  public isTokenExpired(): boolean {
    const token = this.getAccessTokenForAPI();
    if (!token) return true;

    try {
      const payload = this.decodeJwtToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const config = environment.config;
      const bufferTime = config.minutesToSubtractTokenExpireDate * 60;

      return payload.exp < currentTime + bufferTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  }

  public refreshTokenIfNeeded(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (this.isTokenExpired()) {
        try {
          const accounts = this.msalInstance.getAllAccounts();
          if (accounts.length > 0) {
            const token = await this.getAccessToken(accounts[0]);
            if (token) {
              this.processUserData(accounts[0], token);
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  }
}
