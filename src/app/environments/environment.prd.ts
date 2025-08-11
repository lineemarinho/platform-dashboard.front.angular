export const environment = {
  production: true,
  env: "PRD",
  azureAD: {
    auth: {
      gowd: {
        tenantId: "e4ab64c0-e4d3-4eca-a68a-0a477395b430",
        domain: "gowd.com",
        clientId: "5d735a76-a09d-45bb-a10e-4ff1e738f03b",
        authority:
          "https://login.microsoftonline.com/e4ab64c0-e4d3-4eca-a68a-0a477395b430",
        redirectUri: "https://platform.gowd.com",
        scope: "5d735a76-a09d-45bb-a10e-4ff1e738f03b/.default",
        logo: "assets/images/logo-gowd.png",
        ico: "assets/images/favicon-gowd.ico",
        titlePage: "Gowd",
        api: {
          host: "https://api-platform.gowd.com",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      zimba: {
        tenantId: "38524200-7dd6-4049-ac0b-79e57dc221ab",
        domain: "zimba.net",
        clientId: "20a91c13-fa57-47c9-a846-2aeab9d9e539",
        authority:
          "https://login.microsoftonline.com/38524200-7dd6-4049-ac0b-79e57dc221ab",
        redirectUri: "https://platform.zimba.net",
        scope: "20a91c13-fa57-47c9-a846-2aeab9d9e539/.default",
        logo: "assets/images/zimba.png",
        ico: "assets/images/favicon-zimba.ico",
        titlePage: "Zimba",
        api: {
          host: "https://api-platform.zimba.net",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      apoloPag: {
        tenantId: "d3cd7a7b-c3c0-45f9-8d59-dc5c9a18c72e",
        domain: "apolopag.com",
        clientId: "c3ba8222-7e20-4f84-a22e-3f9f4e9f0428",
        authority:
          "https://login.microsoftonline.com/d3cd7a7b-c3c0-45f9-8d59-dc5c9a18c72e",
        redirectUri: "https://platform.apolopag.com",
        scope: "c3ba8222-7e20-4f84-a22e-3f9f4e9f0428/.default",
        logo: "assets/images/apoloPag.png",
        ico: "assets/images/favicon-apoloPag.ico",
        titlePage: "ApoloPag Backoffice",
        api: {
          host: "https://api-platform.apolopag.com",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      sulPayments: {
        tenantId: "74008298-8afd-438c-a319-ca8a6eb86e78",
        domain: "sulpayments.ch",
        clientId: "16d350ed-32a7-4f31-a15c-30bf24b1fc7c",
        authority:
          "https://login.microsoftonline.com/74008298-8afd-438c-a319-ca8a6eb86e78",
        redirectUri: "https://platform.sulpayments.ch",
        scope: "16d350ed-32a7-4f31-a15c-30bf24b1fc7c/.default",
        logo: "assets/images/sulPayments.png",
        ico: "assets/images/favicon-sulPayments.ico",
        titlePage: "Sulpayments Backoffice",
        api: {
          host: "https://api-platform.sulpayments.ch",
          context: "/platform-dashboard-bff",
        },
        key: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----",
      },
      finSoft: {
        tenantId: "231cf536-0f5e-4d3a-a6c0-7034dd00c235",
        domain: "finsoft.com.cy",
        clientId: "217f6321-fb2b-43ed-8324-9a5449f1c251",
        authority:
          "https://login.microsoftonline.com/231cf536-0f5e-4d3a-a6c0-7034dd00c235",
        redirectUri: "https://platform.finsoft.com.cy",
        scope: "217f6321-fb2b-43ed-8324-9a5449f1c251/.default",
        logo: "assets/images/finSoft.png",
        ico: "assets/images/favicon-finSoft.ico",
        titlePage: "FinSoft",
        api: {
          host: "https://api-platform.finsoft.com.cy",
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
