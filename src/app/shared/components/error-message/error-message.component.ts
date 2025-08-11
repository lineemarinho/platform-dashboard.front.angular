import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-error-message",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./error-message.component.html",
  styleUrls: ["./error-message.component.css"],
})
export class ErrorMessageComponent {
  @Input() error: string | null = null;
  @Input() title: string = "Erro ao carregar dados";
  @Input() showRetry: boolean = true;
  @Input() retryText: string = "Tentar novamente";
  @Input() iconClass: string = "w-12 h-12";
  @Input() containerClass: string = "p-4 lg:p-6";
  
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
