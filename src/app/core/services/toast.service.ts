import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { ToastComponent } from '../../shared/components/toast/toast.component';

export interface ToastConfig {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private injector: Injector) {}

  show(config: ToastConfig): void {
    this.hide();

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .top('20px')
        .right('20px'),
      hasBackdrop: false,
      panelClass: 'toast-overlay',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });

    const portal = new ComponentPortal(ToastComponent, null, this.injector);
    const componentRef = this.overlayRef.attach(portal);

    componentRef.instance.config = {
      type: 'success',
      duration: 3000,
      ...config,
    };

    setTimeout(() => {
      this.hide();
    }, config.duration || 3000);
  }

  success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }

  hide(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
