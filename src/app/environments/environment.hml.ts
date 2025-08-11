export const environment = {
  production: true,
  env: "HML",
  azureAD: {
    auth: {
      sulPaymentsDiffs: {
        tenantId: "335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        domain: "sulpayments.ch",
        clientId: "89570733-6652-467b-9e9c-572664715bba",
        authority:
          "https://login.microsoftonline.com/335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        redirectUri: "https://platform.sulpayments-hml.diffstech.com.br",
        scope: "89570733-6652-467b-9e9c-572664715bba/.default",
        logo: "assets/images/sulPayments.png",
        ico: "assets/images/favicon-sulPayments.ico",
        titlePage: "HML - Sulpayments Backoffice",
        api: {
          host: "https://api-hml.diffstech.com.br",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      gowd: {
        tenantId: "e4ab64c0-e4d3-4eca-a68a-0a477395b430",
        domain: "gowd.com",
        clientId: "eaf4034a-f175-41a8-9bcd-5f8888aa45d4",
        authority:
          "https://login.microsoftonline.com/e4ab64c0-e4d3-4eca-a68a-0a477395b430",
        redirectUri: "https://platform-hml.gowd.com",
        scope: "eaf4034a-f175-41a8-9bcd-5f8888aa45d4/.default",
        logo: "assets/images/logo-gowd.png",
        ico: "assets/images/favicon-gowd.ico",
        titlePage: "HML - Gowd",
        api: {
          host: "https://api-platform-hml.latamgateway.com",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      zimba: {
        tenantId: "38524200-7dd6-4049-ac0b-79e57dc221ab",
        domain: "zimba.net",
        clientId: "ab000ec1-0829-4366-bae2-a8f44f62dac7",
        authority:
          "https://login.microsoftonline.com/38524200-7dd6-4049-ac0b-79e57dc221ab",
        redirectUri: "https://platform-hml.zimba.net",
        scope: "ab000ec1-0829-4366-bae2-a8f44f62dac7/.default",
        logo: "assets/images/zimba.png",
        ico: "assets/images/favicon-zimba.ico",
        titlePage: "HML - Zimba",
        api: {
          host: "https://api-platform-hml.zimba.net",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      apoloPag: {
        tenantId: "d3cd7a7b-c3c0-45f9-8d59-dc5c9a18c72e",
        domain: "apolopag.com",
        clientId: "ea1564cd-e73d-4de8-b60c-5ccaf38c30e6",
        authority:
          "https://login.microsoftonline.com/d3cd7a7b-c3c0-45f9-8d59-dc5c9a18c72e",
        redirectUri: "https://platform-hml.apolopag.com",
        scope: "ea1564cd-e73d-4de8-b60c-5ccaf38c30e6/.default",
        logo: "assets/images/apoloPag.png",
        ico: "assets/images/favicon-apoloPag.ico",
        titlePage: "HML - ApoloPag Backoffice",
        api: {
          host: "https://api-platform-hml.apolopag.com",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      sulPayments: {
        tenantId: "74008298-8afd-438c-a319-ca8a6eb86e78",
        domain: "sulpayments.ch",
        clientId: "ad2fcdaa-5b4f-4b8d-8ea4-b12adc8e3630",
        authority:
          "https://login.microsoftonline.com/74008298-8afd-438c-a319-ca8a6eb86e78",
        redirectUri: "https://platform-hml.sulpayments.ch",
        scope: "ad2fcdaa-5b4f-4b8d-8ea4-b12adc8e3630/.default",
        logo: "assets/images/sulPayments.png",
        ico: "assets/images/favicon-sulPayments.ico",
        titlePage: "HML - Sulpayments Backoffice",
        api: {
          host: "https://api-platform-hml.sulpayments.ch",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      finSoft: {
        tenantId: "231cf536-0f5e-4d3a-a6c0-7034dd00c235",
        domain: "finsoft.com.cy",
        clientId: "5f9c892b-5fb9-4ddd-880d-76cd5a94da5d",
        authority:
          "https://login.microsoftonline.com/231cf536-0f5e-4d3a-a6c0-7034dd00c235",
        redirectUri: "https://platform-hml.finsoft.com.cy",
        scope: "5f9c892b-5fb9-4ddd-880d-76cd5a94da5d/.default",
        logo: "assets/images/finSoft.png",
        ico: "assets/images/favicon-finSoft.ico",
        titlePage: "HML - FinSoft",
        api: {
          host: "https://api-platform-hml.finsoft.com.cy",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
    },
  },
  localStorage: {
    common: "platform-common",
  },
  sessionStorage: {
    user: "platform-user",
    common: "platform-user-common",
  },
  config: {
    minutesToSubtractTokenExpireDate: 5,
    hoursToAddFileShareableLinkDate: 1,
    daysToAddFileUploadDate: -1,
    pollingOrderMilliseconds: 1000,
    useHash: true,
  },
};
