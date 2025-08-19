export interface CountryFlag {
  code: string;
  name: string;
  flag: string;
}

export class CountryFlagUtil {
  private static readonly countryFlags: CountryFlag[] = [
    { code: "BRA", name: "Brasil", flag: "assets/flags/brl.svg" },
    { code: "ARG", name: "Argentina", flag: "assets/flags/ars.svg" },
    { code: "CHL", name: "Chile", flag: "assets/flags/clp.svg" },
    { code: "COL", name: "Colômbia", flag: "assets/flags/cop.svg" },
    { code: "MEX", name: "México", flag: "assets/flags/mxn.svg" },
    { code: "PER", name: "Peru", flag: "assets/flags/pen.svg" },
    { code: "USA", name: "Estados Unidos", flag: "assets/flags/usd.svg" },
    { code: "EUR", name: "Europa", flag: "assets/flags/eur.svg" },
    { code: "USDT", name: "USDT", flag: "assets/flags/usdt.svg" },
  ];

  static getCountryFlag(countryCode: string): CountryFlag | null {
    const country = this.countryFlags.find(
      (cf) => cf.code.toUpperCase() === countryCode.toUpperCase()
    );
    return country || null;
  }

  static getCountryName(countryCode: string): string {
    const country = this.getCountryFlag(countryCode);
    return country ? country.name : countryCode;
  }

  static getFlagPath(countryCode: string): string {
    const country = this.getCountryFlag(countryCode);
    return country ? country.flag : "assets/flags/usd.svg";
  }

  static getAllCountries(): CountryFlag[] {
    return [...this.countryFlags];
  }

  static getCountryOptions(): Array<{
    value: string;
    label: string;
    flag: string;
  }> {
    return this.countryFlags.map((country) => ({
      value: country.code,
      label: country.name,
      flag: country.flag,
    }));
  }
}
