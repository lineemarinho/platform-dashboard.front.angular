export interface StatusConfig {
  value: string;
  label: string;
  type:
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "processing"
    | "completed"
    | "active"
    | "inactive";
  color: string;
  icon?: string;
}

export class StatusUtil {
  private static readonly statusConfigs: StatusConfig[] = [
    {
      value: "approved",
      label: "Aprovado",
      type: "approved",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "pending",
      label: "Pendente",
      type: "pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "rejected",
      label: "Rejeitado",
      type: "rejected",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "cancelled",
      label: "Cancelado",
      type: "cancelled",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "processing",
      label: "Processando",
      type: "processing",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "completed",
      label: "Concluído",
      type: "completed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "active",
      label: "Ativo",
      type: "active",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "inactive",
      label: "Inativo",
      type: "inactive",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "true",
      label: "Ativo",
      type: "active",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "false",
      label: "Inativo",
      type: "inactive",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  static getStatusConfig(status: string): StatusConfig {
    const statusLower = status.toLowerCase();
    const config = this.statusConfigs.find(
      (s) => s.value.toLowerCase() === statusLower
    );

    return config || this.statusConfigs.find((s) => s.value === "pending")!;
  }

  static getStatusType(
    status: string
  ):
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "processing"
    | "completed"
    | "active"
    | "inactive" {
    return this.getStatusConfig(status).type;
  }

  static getStatusClass(status: string): string {
    return this.getStatusConfig(status).color;
  }

  static getStatusLabel(status: string): string {
    return this.getStatusConfig(status).label;
  }

  static getStatusOptions(): Array<{ value: string; label: string }> {
    return this.statusConfigs.map((config) => ({
      value: config.value,
      label: config.label,
    }));
  }

  static getActiveStatusOptions(): Array<{ value: string; label: string }> {
    return this.statusConfigs
      .filter(
        (config) => config.type === "active" || config.type === "inactive"
      )
      .map((config) => ({
        value: config.value,
        label: config.label,
      }));
  }

  static getPaymentStatusOptions(): Array<{ value: string; label: string }> {
    return this.statusConfigs
      .filter((config) =>
        [
          "approved",
          "pending",
          "rejected",
          "cancelled",
          "processing",
          "completed",
        ].includes(config.type)
      )
      .map((config) => ({
        value: config.value,
        label: config.label,
      }));
  }

  static mapBooleanToStatus(value: boolean): string {
    return value ? "active" : "inactive";
  }

  static mapStatusToBoolean(status: string): boolean {
    return ["active", "approved", "completed"].includes(status.toLowerCase());
  }
}
