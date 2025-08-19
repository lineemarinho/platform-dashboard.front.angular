import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { InfoFieldComponent } from "../../shared/components/info-field/info-field.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { LocalePipe } from "../../shared/pipes/locale.pipe";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    AppButtonComponent,
    LocalePipe,
    InfoFieldComponent,
  ],
})
export class ProfileComponent {
  personalInfo = [
    { label: "name", value: "Aline Marinho" },
    { label: "email", value: "aline.marinho@diffs.tech" },
    { label: "document", value: "421.245.789-99" },
  ];

  accounts = [
    {
      agency: "0001",
      account: "67431832743710101004",
      alias: "Transacional",
    },
    {
      agency: "0001",
      account: "67431832743710101004",
      alias: "Proprietaria",
    },
  ];

  onSaveAccount(accountIndex: number, alias: string): void {
    this.accounts[accountIndex].alias = alias;
  }
}
