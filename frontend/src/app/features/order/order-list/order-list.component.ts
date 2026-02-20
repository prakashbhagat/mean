import { Component, signal, OnInit } from '@angular/core';
import { AllOrder, Order, OrderService } from '../../../services/order/order.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { PaginationComponent } from '../../../shared/component/pagination/pagination';

@Component({
  selector: 'app-order-list.component',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent, PaginationComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  orders = signal<AllOrder[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  limit = signal<number>(10);

  showDeleteModal = false;
  selectedOrderId: string | null = null;

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(page: number = 1): void {
    this.orderService.getOrders(page, this.limit()).subscribe((response) => {
      this.orders.set(response.data);
      this.currentPage.set(response.meta.page);
      this.totalPages.set(response.meta.totalPages);
      this.totalItems.set(response.meta.total);
    });
  }

  onPageChange(page: number): void {
    this.loadOrders(page);
  }

  dashboard(): void {
    this.router.navigate(['/']);
  }

  addOrder(): void {
    this.router.navigate(['/orders/add']);
  }

  editOrder(id: string): void {
    this.router.navigate(['/orders/edit', id]);
  }

  openDeleteModal(id: string) {
    this.selectedOrderId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.selectedOrderId) return;

    this.orderService.deleteOrder(this.selectedOrderId).subscribe(() => {
      this.orders.set(this.orders().filter(o => o.id !== this.selectedOrderId));
      this.showDeleteModal = false;
    });
  }
}
