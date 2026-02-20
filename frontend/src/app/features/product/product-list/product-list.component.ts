import { Component, OnInit, signal } from '@angular/core';
import { ProductService, Product } from '../../../services/product/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { PaginationComponent } from '../../../shared/component/pagination/pagination';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalComponent, PaginationComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  limit = signal<number>(10);

  showDeleteModal = false;
  selectedProductId: string | null = null;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    this.productService.getProducts(page, this.limit()).subscribe((response) => {
      this.products.set(response.data);
      this.currentPage.set(response.meta.page);
      this.totalPages.set(response.meta.totalPages);
      this.totalItems.set(response.meta.total);
    });
  }

  onPageChange(page: number): void {
    this.loadProducts(page);
  }
  dashboard(): void {
    this.router.navigate(['']);
  }
  addProduct(): void {
    this.router.navigate(['products/add']);
  }

  editProduct(id: string): void {
    this.router.navigate([`products/edit/${id}`]);
  }

  openDeleteModal(id: string) {
    this.selectedProductId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.selectedProductId) return;

    this.productService.deleteProduct(this.selectedProductId).subscribe(() => {
      this.products.set(this.products().filter(p => p._id !== this.selectedProductId));
      this.showDeleteModal = false;
    });
  }

}
