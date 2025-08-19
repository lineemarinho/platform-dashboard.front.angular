import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LocalePipe } from "../../pipes/locale.pipe";
import { AppButtonComponent } from "../app-button/app-button.component";
import { AppInputComponent } from "../app-input/app-input.component";

export interface EditNicknameData {
  type: string;
  nickname: string;
}

@Component({
  selector: "app-edit-nickname-modal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppButtonComponent,
    AppInputComponent,
    LocalePipe,
  ],
  templateUrl: "./edit-nickname-modal.component.html",
  styleUrls: ["./edit-nickname-modal.component.css"],
})
export class EditNicknameModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() data: EditNicknameData | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<string>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      type: ["", Validators.required],
      nickname: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        type: this.data.type,
        nickname: this.data.nickname,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isOpen"] && changes["isOpen"].currentValue) {
    }
    if (changes["data"] && changes["data"].currentValue) {
      this.form.patchValue({
        type: this.data?.type || "",
        nickname: this.data?.nickname || "",
      });
    }
  }

  onCloseClick(): void {
    this.onClose.emit();
  }

  onSaveClick(): void {
    if (this.form.valid) {
      this.onSave.emit(this.form.get("nickname")?.value);
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCloseClick();
    }
  }
}
