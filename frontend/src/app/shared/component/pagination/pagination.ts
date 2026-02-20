import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() totalItems: number = 0;
  @Input() limit: number = 10;

  @Output() pageChange = new EventEmitter<number>();

  pages: (number | string)[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['totalPages'] || changes['totalItems']) {
      this.generatePages();
    }
  }

  generatePages(): void {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      
      pages.push(1);

      let startFrom = Math.max(2, this.currentPage - 1);
      let endAt = Math.min(this.totalPages - 1, this.currentPage + 1);

      if (this.currentPage <= 3) {
        endAt = 4;
      }

      if (this.currentPage >= this.totalPages - 2) {
        startFrom = this.totalPages - 3;
      }

      if (startFrom > 2) {
        pages.push('...');
      }

      for (let i = startFrom; i <= endAt; i++) {
        pages.push(i);
      }

      if (endAt < this.totalPages - 1) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }

    this.pages = pages;
  }

  onPageChange(page: number | string): void {
    if (page === '...' || page === this.currentPage) return;
    this.pageChange.emit(page as number);
  }

  onPrevious(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
