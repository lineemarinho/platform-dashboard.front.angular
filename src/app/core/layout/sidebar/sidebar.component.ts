import { CommonModule } from "@angular/common";
import {
  Component,
  HostListener,
  OnInit,
  computed,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { LocalePipe } from "../../../shared/pipes/locale.pipe";
import { AuthService } from "../../services/auth.service";
import { SidebarService } from "../../services/sidebar.service";
import { TranslationService } from "../../services/translation.service";

interface NavigationItem {
  path: string;
  label: string;
  icon: string;
  image?: string;
  active: boolean;
  hasDropdown?: boolean;
  dropdownItems?: NavigationItem[];
}

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, LocalePipe],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  currentPath = signal("");
  isCollapsed = signal(false);
  isMobile = signal(false);

  user = computed(() => this.authService.user());
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {
    this.checkScreenSize();
    this.setupSidebarSubscription();
  }

  private setupSidebarSubscription() {
    this.sidebarService.isCollapsed$.subscribe((value) => {
      this.isCollapsed.set(value);
    });

    this.sidebarService.isMobile$.subscribe((value) => {
      this.isMobile.set(value);
    });
  }

  @HostListener("window:resize")
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth < 1024;
    this.sidebarService.setMobile(isMobile);
  }

  ngOnInit() {
    this.currentPath.set(this.router.url);
    this.router.events.subscribe(() => {
      this.currentPath.set(this.router.url);
      if (this.isMobile()) {
        this.sidebarService.closeSidebar();
      }
    });
  }

  get brandConfig() {
    const port = window.location.port;
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      switch (port) {
        case "4200":
          return {
            name: "Gowd",
            primary: "bg-slate-900",
            secondary: "bg-orange-500",
            text: "text-white",
          };
        case "4210":
          return {
            name: "Zimba",
            primary: "bg-gray-900",
            secondary: "bg-purple-500",
            text: "text-white",
          };
        case "4220":
          return {
            name: "SulPayments",
            primary: "bg-blue-900",
            secondary: "bg-blue-400",
            text: "text-white",
          };
        default:
          return {
            name: "Gowd",
            primary: "bg-blue-900",
            secondary: "bg-orange-500",
            text: "text-white",
          };
      }
    }

    return {
      name: "Gowd",
      primary: "bg-blue-900",
      secondary: "bg-orange-500",
      text: "text-white",
    };
  }

  get userName(): string {
    return this.user()?.name || "Usuário";
  }

  getUserInitials(): string {
    return this.userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  navigationItems = computed((): NavigationItem[] => [
    {
      path: "/holdings",
      label: "holdings",
      icon: "business",
      active: this.currentPath() === "/holdings",
    },
    {
      path: "/payins",
      label: "payIns",
      icon: "payments",
      active:
        this.currentPath() === "/payins" ||
        this.currentPath().startsWith("/payins/"),
    },
    {
      path: "/payouts",
      label: "payouts",
      icon: "account_balance_wallet",
      active:
        this.currentPath() === "/payouts" ||
        this.currentPath().startsWith("/payouts/"),
    },
    {
      path: "/refunds",
      label: "refunds",
      icon: "money_off",
      active: this.currentPath() === "/refunds",
    },
    {
      path: "/account-holders",
      label: "accountHolders",
      icon: "people",
      active:
        this.currentPath() === "/account-holders" ||
        this.currentPath().startsWith("/account-holders/"),
    },
    {
      path: "/companies",
      label: "companies",
      icon: "corporate_fare",
      active: this.currentPath() === "/companies",
    },
    {
      path: "/fees",
      label: "fees",
      icon: "attach_money",
      active: this.currentPath() === "/fees",
    },
    {
      path: "/withdrawals",
      label: "withdrawals",
      icon: "account_balance",
      active:
        this.currentPath() === "/withdrawals" ||
        this.currentPath().startsWith("/withdrawals/"),
    },
    {
      path: "/amls",
      label: "amls",
      icon: "security",
      active: this.currentPath() === "/amls",
    },
    {
      path: "/domain-data",
      label: "domainData",
      icon: "dns",
      active: this.currentPath() === "/domain-data",
    },
    {
      path: "/provider-routing",
      label: "providerRouting",
      icon: "route",
      active: this.currentPath() === "/provider-routing",
    },
    {
      path: "/users",
      label: "users",
      icon: "person",
      active: this.currentPath() === "/users",
    },
    {
      path: "/reports",
      label: "reports",
      icon: "assessment",
      active: this.currentPath() === "/reports",
    },
  ]);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    }
  }
}
