import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flagIcon',
  standalone: true,
})
export class FlagIconPipe implements PipeTransform {
  transform(currency: string): string {
    const flags: { [key: string]: string } = {
      BRL: 'assets/flags/brl.svg',
      CLP: 'assets/flags/clp.svg',
      USDT: 'assets/flags/usdt.svg',
      ARS: 'assets/flags/ars.svg',
      PEN: 'assets/flags/pen.svg',
      MXN: 'assets/flags/mxn.svg',
      COB: 'assets/flags/cop.svg',
      USD: 'assets/flags/usd.svg',
      EUR: 'assets/flags/eur.svg',
    };

    return flags[currency] || currency;
  }
}
