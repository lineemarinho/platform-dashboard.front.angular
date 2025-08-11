export const environment = {
  production: true,
  env: 'DEV',
  azureAD: {
    auth: {
      gowd: {
        tenantId: '335f05ae-c8b2-44cf-be82-1c05dcd8e51c',
        domain: 'latamgateway.com',
        clientId: 'c2527bae-4bed-453d-bfec-6cc4c19d3983',
        authority:
          'https://login.microsoftonline.com/335f05ae-c8b2-44cf-be82-1c05dcd8e51c',
        redirectUri: 'http://localhost:4200',
        scope: 'c2527bae-4bed-453d-bfec-6cc4c19d3983/.default',
        logo: 'assets/images/latamGateway.png',
        ico: 'assets/images/favicon-latamGateway.ico',
        titlePage: 'Latam Backoffice',
        api: {
          host: 'https://api-dev.diffstech.com.br',
          context: '/platform-dashboard-bff',
          // host: 'http://127.0.0.1:5050',
          // context: '',
        },
        key: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz1M3BPryYOMNst4PzIh6\nXHj/sSIw/49ir1WEsH84oVK6CJyQys93zxwsTUOtZiGN9x2x89V6MgOjeQZ+bUHB\nMy84Dk8rISmmWHkQ4T3tTtbgEYtSmvseR9VyoF6zIeRRjyAVBq/AdP5tAoLoxUfd\nO2Rl0IgSZBnqizH2UEF9lweDrCkM985/ZL/PKIETgxVywj2NOwvGCk1fa2toczmP\nsnnu956vWGYe2k6uAP5KjTQbLGp8MtvOMCzntSNc6SfbsVzBhACyFYQTFOj4w1oz\nDZhtfQYI7sHFmZj6FBBG0mrb8zM/HUlb/Cp+zmL/Ykod3wMLvWYmrw4YkG66SATH\n4wIDAQAB\n-----END PUBLIC KEY-----',
      },
    },
    localStorage: {
      common: 'partner-platform-common',
    },
    sessionStorage: {
      user: 'partner-platform-user',
      common: 'partner-platform-user-common',
    },
    config: {
      minutesToSubtractTokenExpireDate: 5,
      hoursToAddFileShareableLinkDate: 1,
      daysToAddFileUploadDate: -1,
      pollingOrderMilliseconds: 1000,
      useHash: true,
    },
  },
};
