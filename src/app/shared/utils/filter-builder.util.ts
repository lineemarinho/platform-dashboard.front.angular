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
  filter: any[];
  sort: any;
  group: any;
}

export class FilterBuilderUtil {
  static buildFilter(
    field: string,
    operator: FilterCondition["operator"],
    value: any
  ): FilterCondition {
    return { field, operator, value };
  }

  static buildAndGroup(
    conditions: (FilterCondition | FilterGroup)[]
  ): FilterGroup {
    return { conditions, operator: "and" };
  }

  static buildOrGroup(
    conditions: (FilterCondition | FilterGroup)[]
  ): FilterGroup {
    return { conditions, operator: "or" };
  }

  static buildApiRequest(
    skip: number,
    take: number,
    filters: (FilterCondition | FilterGroup)[],
    requireTotalCount: boolean = true,
    sort: any = null,
    group: any = null
  ): ApiFilterRequest {
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

  private static convertToApiFormat(
    filters: (FilterCondition | FilterGroup)[]
  ): any[] {
    return filters.map((filter) => {
      if (this.isFilterCondition(filter)) {
        return [filter.field, filter.operator, filter.value];
      } else {
        const convertedConditions = this.convertToApiFormat(filter.conditions);
        return [convertedConditions, filter.operator];
      }
    });
  }

  static buildTextFilter(field: string, value: string): FilterCondition | null {
    if (!value || value.trim() === "") return null;
    return this.buildFilter(field, "contains", value.trim());
  }

  static buildSelectFilter(field: string, value: any): FilterCondition | null {
    if (!value || value === "") return null;
    return this.buildFilter(field, "=", value);
  }

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

  private static isFilterCondition(
    filter: FilterCondition | FilterGroup
  ): filter is FilterCondition {
    return "field" in filter && "operator" in filter && "value" in filter;
  }
}
