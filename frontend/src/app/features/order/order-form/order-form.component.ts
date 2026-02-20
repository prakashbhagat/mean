import { Component, signal } from '@angular/core';
import { Order, OrderService } from '../../../services/order/order.service';
import { Product, ProductService } from '../../../services/product/product.service';
import { UserService } from '../../../services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-form.component',
  imports: [FormsModule, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent {
  order: Order = { _id: '', userId: 0, productIds: [], totalAmount: 0 };
  users: any[] = [];
  products = signal<Product[]>([]);
  isEdit = false;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
    this.productService.getProducts(1, 100).subscribe(response => this.products.set(response.data));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.orderService.getOrder(id).subscribe(order => {
        this.order = order;
      });
    }
  }

  back(): void {
    this.router.navigate(['/orders']);
  }

  saveOrder(): void {
    if (this.order.userId === 0 || this.order.productIds.length === 0) {
      alert('Please select user and at least one product');
      return;
    }

    if (this.isEdit) {
      this.orderService.updateOrder(this.order._id!, this.order).subscribe(() => {
        this.router.navigate(['/orders']);
      });
    } else {
      this.orderService.createOrder(this.order).subscribe(() => {
        this.router.navigate(['/orders']);
      });
    }
  }
}
