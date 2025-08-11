export interface FilterCondition {
  field: string;
  operator:
    | "="
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | "contains"
    | "startsWith"
    | "endsWith"
    | "in"
    | "notIn";
  value: any;
}

export interface FilterGroup {
  conditions: (FilterCondition | FilterGroup)[];
  operator: "and" | "or";
}

export interface ApiFilterRequest {
  skip: number;
  take: number;
  requireTotalCount: boolean;
  filter: any[]; // Mudou para any[] para aceitar o formato array da API
  sort: any;
  group: any;
}

export class FilterBuilderUtil {
  /**
   * Constrói um filtro simples
   */
  static buildFilter(
    field: string,
    operator: FilterCondition["operator"],
    value: any
  ): FilterCondition {
    return { field, operator, value };
  }

  /**
   * Constrói um grupo de filtros com operador AND
   */
  static buildAndGroup(
    conditions: (FilterCondition | FilterGroup)[]
  ): FilterGroup {
    return { conditions, operator: "and" };
  }

  /**
   * Constrói um grupo de filtros com operador OR
   */
  static buildOrGroup(
    conditions: (FilterCondition | FilterGroup)[]
  ): FilterGroup {
    return { conditions, operator: "or" };
  }

  /**
   * Constrói a requisição completa de filtro para a API
   */
  static buildApiRequest(
    skip: number,
    take: number,
    filters: (FilterCondition | FilterGroup)[],
    requireTotalCount: boolean = true,
    sort: any = null,
    group: any = null
  ): ApiFilterRequest {
    // Converte os filtros para o formato array da API
    const apiFilters = this.convertToApiFormat(filters);
    
    return {
      skip,
      take,
      requireTotalCount,
      filter: apiFilters,
      sort,
      group,
    };
  }

  /**
   * Converte filtros do formato objeto para o formato array da API
   */
  private static convertToApiFormat(filters: (FilterCondition | FilterGroup)[]): any[] {
    return filters.map(filter => {
      if (this.isFilterCondition(filter)) {
        // Filtro simples: [field, operator, value]
        return [filter.field, filter.operator, filter.value];
      } else {
        // Grupo de filtros: [conditions, operator]
        const convertedConditions = this.convertToApiFormat(filter.conditions);
        return [convertedConditions, filter.operator];
      }
    });
  }

  /**
   * Constrói filtros para campos de texto com operador 'contains'
   */
  static buildTextFilter(field: string, value: string): FilterCondition | null {
    if (!value || value.trim() === "") return null;
    return this.buildFilter(field, "contains", value.trim());
  }

  /**
   * Constrói filtros para campos de seleção com operador '='
   */
  static buildSelectFilter(field: string, value: any): FilterCondition | null {
    if (!value || value === "") return null;
    return this.buildFilter(field, "=", value);
  }

  /**
   * Constrói filtros para datas
   */
  static buildDateRangeFilter(
    startField: string,
    endField: string,
    startDate: string,
    endDate: string
  ): FilterCondition[] {
    const filters: FilterCondition[] = [];

    if (startDate) {
      filters.push(this.buildFilter(startField, ">=", startDate));
    }

    if (endDate) {
      filters.push(this.buildFilter(endField, "<=", endDate));
    }

    return filters;
  }

  /**
   * Constrói filtros para documentos (tipo + número)
   */
  static buildDocumentFilter(
    documentType: string,
    documentNumber: string
  ): FilterCondition[] {
    const filters: FilterCondition[] = [];

    if (documentType) {
      filters.push(this.buildFilter("document.type", "=", documentType));
    }

    if (documentNumber) {
      filters.push(this.buildFilter("document.number", "=", documentNumber));
    }

    return filters;
  }

  /**
   * Filtra valores vazios e constrói a lista final de filtros
   */
  static buildFinalFilters(
    filters: (FilterCondition | FilterGroup)[]
  ): (FilterCondition | FilterGroup)[] {
    return filters.filter((filter) => {
      if (this.isFilterCondition(filter)) {
        return (
          filter.value !== null &&
          filter.value !== undefined &&
          filter.value !== ""
        );
      }
      return filter.conditions.length > 0;
    });
  }

  /**
   * Verifica se é uma condição de filtro
   */
  private static isFilterCondition(
    filter: FilterCondition | FilterGroup
  ): filter is FilterCondition {
    return "field" in filter && "operator" in filter && "value" in filter;
  }
}
