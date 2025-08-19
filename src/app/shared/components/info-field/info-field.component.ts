import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";

@Component({
  selector: "app-info-field",
  templateUrl: "./info-field.component.html",
  styleUrls: ["./info-field.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class InfoFieldComponent {
  @Input() label: string = "";
  @Input() value: string = "";
  @Input() showCopy: boolean = false;

  constructor(private toastService: ToastService) {}

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.value);
      this.toastService.success(
        `${this.label} copiado para a área de transferência`
      );
    } catch (err) {
      this.toastService.error("Erro ao copiar para a área de transferência");
    }
  }
}
