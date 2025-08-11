# ErrorMessage Component

Componente reutilizável para exibir mensagens de erro com botão de retry.

## Uso Básico

```html
<app-error-message
  [error]="errorMessage"
  (retry)="onRetry()"
></app-error-message>
```

## Propriedades (Inputs)

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `error` | `string \| null` | `null` | Mensagem de erro a ser exibida |
| `title` | `string` | `"Erro ao carregar dados"` | Título do erro |
| `showRetry` | `boolean` | `true` | Se deve mostrar o botão de retry |
| `retryText` | `string` | `"Tentar novamente"` | Texto do botão de retry |
| `iconClass` | `string` | `"w-12 h-12"` | Classes CSS para o ícone |
| `containerClass` | `string` | `"p-4 lg:p-6"` | Classes CSS para o container |

## Eventos (Outputs)

| Evento | Tipo | Descrição |
|--------|------|-----------|
| `retry` | `EventEmitter<void>` | Emitido quando o botão de retry é clicado |

## Exemplos de Uso

### Uso Simples
```html
<app-error-message
  [error]="'Erro ao carregar usuários'"
  (retry)="loadUsers()"
></app-error-message>
```

### Personalizado
```html
<app-error-message
  [error]="errorMessage"
  title="Falha na conexão"
  retryText="Reconectar"
  [showRetry]="true"
  (retry)="reconnect()"
></app-error-message>
```

### Sem Botão de Retry
```html
<app-error-message
  [error]="'Erro fatal do sistema'"
  [showRetry]="false"
></app-error-message>
```

## Estilos

O componente inclui:
- Animações de fade-in
- Hover effects no botão
- Transições suaves
- Design responsivo
- Cores de erro consistentes
