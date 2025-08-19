import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface AccountFilter {
  type: string;
  nickname: string;
  hasEdit: boolean;
}

@Component({
  selector: "app-account-filter-tab",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./account-filter-tab.component.html",
  styleUrls: ["./account-filter-tab.component.css"],
})
export class AccountFilterTabComponent {
  @Input() filters: AccountFilter[] = [];
  @Input() selectedFilter: string = "";
  @Output() onFilterSelect = new EventEmitter<string>();
  @Output() onEditNickname = new EventEmitter<AccountFilter>();

  onFilterClick(filter: AccountFilter): void {
    this.onFilterSelect.emit(filter.type);
  }

  onEditClick(event: Event, filter: AccountFilter): void {
    event.stopPropagation();
    this.onEditNickname.emit(filter);
  }
}
