import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { OrderService, Order, AllOrder } from './order.service';
import { environment } from '../../../environments/environment.development';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch paginated orders', () => {
    const mockResponse = {
      data: [{ id: 'o1', userId: 1, name: 'Product A', price: 50 }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
    };

    service.getOrders(1, 10).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.meta.total).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url === `${environment.apiUrl}orders`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('limit')).toBe('10');
    req.flush(mockResponse);
  });

  it('should fetch a single order by id', () => {
    const mockOrder: Order = { _id: 'o1', userId: 1, productIds: ['p1'], totalAmount: 50 };

    service.getOrder('o1').subscribe(res => {
      expect(res.totalAmount).toBe(50);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders/o1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should create an order', () => {
    const newOrder: Order = { _id: 'o2', userId: 1, productIds: ['p2'], totalAmount: 100 };

    service.createOrder(newOrder).subscribe(res => {
      expect(res._id).toBe('o2');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrder);
    req.flush(newOrder);
  });

  it('should delete an order', () => {
    service.deleteOrder('o1').subscribe(res => {
      expect(res).toBeFalsy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders/o1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
