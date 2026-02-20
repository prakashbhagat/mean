import { Component, OnInit, signal } from '@angular/core';
import { ProductService, CreateProduct, Product } from '../../../services/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {

  product = signal<Product | CreateProduct>({ name: '', price: 0, description: '' });
  isEdit = false;
  productId: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log('Product ID from route:', this.productId);
    
    if (this.productId) {
      this.isEdit = true;
      this.productService.getProductById(this.productId).subscribe({
        next: (product) => this.product.set(product),
        error: (err) => console.error('Could not fetch product', err)
      });
    }
  }

  backToList(): void {
    this.router.navigate(['/products']);
  }

  saveProduct(): void {
    if (this.isEdit && this.productId) {
      this.productService.updateProduct(this.productId, this.product() as Product).subscribe(() => {
        this.router.navigate(['/products']);
      });
    } else {
      this.productService.createProduct(this.product() as CreateProduct).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }
}