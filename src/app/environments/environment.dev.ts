export const environment = {
  production: true,
  env: "DEV",
  azureAD: {
    auth: {
      gowd: {
        tenantId: "335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        domain: "gowd.com",
        clientId: "c2527bae-4bed-453d-bfec-6cc4c19d3983",
        authority:
          "https://login.microsoftonline.com/335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        redirectUri: "https://platform.gowd-dev.diffstech.com.br",
        scope: "c2527bae-4bed-453d-bfec-6cc4c19d3983/.default",
        logo: "assets/images/logo-gowd.png",
        ico: "assets/images/favicon-gowd.ico",
        titlePage: "DEV - Gowd",
        api: {
          host: "https://api-dev.diffstech.com.br",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      zimba: {
        clientId: "",
        authority: "",
        redirectUri: "",
        scope: "",
        logo: "assets/images/zimba.png",
        ico: "assets/images/favicon-zimba.ico",
        titlePage: "DEV - Zimba",
        api: {
          host: "",
          context: "",
        },
        key: "",
      },
      apoloPagDiffs: {
        tenantId: "335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        domain: "apolopag.com",
        clientId: "a6c57d0f-b596-48f8-bf8a-e042485e5e0c",
        authority:
          "https://login.microsoftonline.com/335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        redirectUri: "https://platform.apolopag-dev.diffstech.com.br",
        scope: "a6c57d0f-b596-48f8-bf8a-e042485e5e0c/.default",
        logo: "assets/images/apoloPag.png",
        ico: "assets/images/favicon-apoloPag.ico",
        titlePage: "DEV - ApoloPag Backoffice",
        api: {
          host: "https://api-dev.diffstech.com.br",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      sulPaymentsDiffs: {
        tenantId: "335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        domain: "sulpayments.ch",
        clientId: "c3d8b6ad-6b3a-4a28-9f08-1b48cabd9cec",
        authority:
          "https://login.microsoftonline.com/335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        redirectUri: "https://platform.sulpayments-dev.diffstech.com.br",
        scope: "c3d8b6ad-6b3a-4a28-9f08-1b48cabd9cec/.default",
        logo: "assets/images/sulPayments.png",
        ico: "assets/images/favicon-sulPayments.ico",
        titlePage: "DEV - Sulpayments Backoffice",
        api: {
          host: "https://api-dev.diffstech.com.br",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      finSoft: {
        tenantId: "335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        domain: "finsoft.com.cy",
        clientId: "4c7042e4-09bb-416c-84db-3d84d8dbbba5",
        authority:
          "https://login.microsoftonline.com/335f05ae-c8b2-44cf-be82-1c05dcd8e51c",
        redirectUri: "https://platform.finsoft-dev.diffstech.com.br",
        scope: "4c7042e4-09bb-416c-84db-3d84d8dbbba5/.default",
        logo: "assets/images/finSoft.png",
        ico: "assets/images/favicon-finSoft.ico",
        titlePage: "DEV - FinSoft",
        api: {
          host: "https://api-dev.diffstech.com.br",
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
