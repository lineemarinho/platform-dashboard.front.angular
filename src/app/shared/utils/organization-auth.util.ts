import { environment } from "../../environments/environment";

export const authOrganizationSettings = () => {
  const gowdHosts =
    /(platform\.gowd(?:-dev)?\.diffstech\.com\.br)|(platform(?:|-(hml|prd))\.gowd\.com)|(localhost:4200)/gm;
  const apoloPagDiffsHosts =
    /(platform\.apolopag(?:|-(dev|hml))\.diffstech\.com\.br)|(localhost:4210)/gm;
  const sulPaymentsDiffsHosts =
    /(platform\.sulpayments(?:|-(dev|hml))\.diffstech\.com\.br)|(localhost:4220)/gm;
  const finsoft =
    /(platform\.finsoft(?:-dev)?\.diffstech\.com\.br)|(platform(?:|-(hml|prd))\.finsoft\.com\.cy)|(localhost:4230)/gm;
  const zimbaHosts =
    /(platform\.zimba(?:-dev)?\.diffstech\.com\.br)|(platform(?:|-(hml|prd))\.zimba\.net)|(localhost:4250)/gm;
  const apoloPagHosts =
    /(platform(?:|-(dev|hml))\.apolopag\.com)|(localhost:4310)/gm;
  const sulPaymentsHosts =
    /(platform(?:|-(dev|hml))\.sulpayments\.ch)|(localhost:4320)/gm;

  const host = window.location.host;

  if (gowdHosts.test(host)) return getSettings("gowd");
  else if (zimbaHosts.test(host)) return getSettings("zimba");
  else if (apoloPagDiffsHosts.test(host)) return getSettings("apoloPagDiffs");
  else if (sulPaymentsDiffsHosts.test(host))
    return getSettings("sulPaymentsDiffs");
  else if (finsoft.test(host)) return getSettings("finSoft");
  else if (apoloPagHosts.test(host)) return getSettings("apoloPag");
  else if (sulPaymentsHosts.test(host)) return getSettings("sulPayments");

  throw new Error("Failed to setup project settings!");
};

const getSettings = (prefix: string) => {
  const config = environment.azureAD.auth as any;
  return config[prefix];
};

export const getApiUrl = () => {
  const settings = authOrganizationSettings();
  return settings.api.host + settings.api.context;
};
