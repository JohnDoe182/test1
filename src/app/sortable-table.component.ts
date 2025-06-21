
import { Component, Input, input, Output, EventEmitter } from '@angular/core';
type Row = Array<number | string>;
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'sortable-table',
  templateUrl: './sortable-table.component.html',
  styleUrl: './sortable-table.component.scss'
})
export class SortableTableComponent {

  headers = input<Row>();
  @Input()
  set rows(value: Row[]) {
    this._rows = [...value];
  }
  get rows(): Row[] {
    return this._rows;
  }

  private _rows: Row[] = [];
  sortDirection: SortDirection = 'desc';
  sortColumn = -1;
  @Output() rowsChange = new EventEmitter<Row[]>();

  sort(i: number) {
    this.sortColumn = i;
    this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
    this.rows = sortRowsByColumn(this.rows, i, this.sortDirection);
    this.rowsChange.emit(this.rows);
  }
}

function sortRowsByColumn(
  rows: Row[],
  columnIndex: number,
  direction: SortDirection = 'asc'
): Row[] {
  // Create a copy to avoid mutating the original array
  const sortedRows = [...rows];

  sortedRows.sort((rowA, rowB) => {
    const a = rowA[columnIndex];
    const b = rowB[columnIndex];

    // Handle undefined/null values
    if (a == null) return direction === 'asc' ? -1 : 1;
    if (b == null) return direction === 'asc' ? 1 : -1;
    if (a == null && b == null) return 0;

    // Number comparison
    if (typeof a === 'number' && typeof b === 'number') {
      return direction === 'asc' ? a - b : b - a;
    }

    // Convert to strings for IP/string comparison
    const strA = a.toString();
    const strB = b.toString();

    // Check if they're IP addresses (including CIDR)
    const isIpA = isIpOrCidr(strA);
    const isIpB = isIpOrCidr(strB);

    // If both are IPs, compare as IPs
    if (isIpA && isIpB) {
      const ipComparison = compareIps(strA, strB);
      return direction === 'asc' ? ipComparison : -ipComparison;
    }

    // Mixed types - IPs come before strings
    if (isIpA !== isIpB) {
      const comparison = isIpA ? -1 : 1;
      return direction === 'asc' ? comparison : -comparison;
    }

    // Regular string comparison
    const stringComparison = strA.localeCompare(strB);
    return direction === 'asc' ? stringComparison : -stringComparison;
  });

  return sortedRows;
}

// Helper function to compare IPs by octets
function compareIps(a: string, b: string): number {
  // Remove CIDR portion if exists
  const ipA = a.split('/')[0];
  const ipB = b.split('/')[0];

  // Split into octets
  const octetsA = ipA.split('.').map(Number);
  const octetsB = ipB.split('.').map(Number);

  // Compare each octet sequentially
  for (let i = 0; i < 4; i++) {
    if (octetsA[i] !== octetsB[i]) {
      return octetsA[i] - octetsB[i];
    }
  }

  // If all octets are equal, compare the CIDR mask if exists
  const cidrA = a.includes('/') ? parseInt(a.split('/')[1]) : 32;
  const cidrB = b.includes('/') ? parseInt(b.split('/')[1]) : 32;
  return cidrA - cidrB;
}

// IP/CIDR validation
function isIpOrCidr(input: string): boolean {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
  return ipv4Regex.test(input);
}
