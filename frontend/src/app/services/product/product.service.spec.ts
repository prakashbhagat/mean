import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService, Product, CreateProduct } from './product.service';
import { environment } from '../../../environments/environment.development';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch paginated products', () => {
    const mockResponse = {
      data: [{ _id: '1', name: 'Product 1', price: 10, description: 'Desc' }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
    };

    service.getProducts(2, 5).subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.meta.page).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url === `${environment.apiUrl}products`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('limit')).toBe('5');
    req.flush(mockResponse);
  });

  it('should fetch a single product by id', () => {
    const mockProduct: Product = { _id: '1', name: 'Product 1', price: 10, description: 'Desc' };

    service.getProductById('1').subscribe(res => {
      expect(res.name).toBe('Product 1');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}products/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should create a product', () => {
    const newProduct: CreateProduct = { name: 'New P', price: 20, description: 'Test' };
    const mockProduct: Product = { _id: '2', ...newProduct };

    service.createProduct(newProduct).subscribe(res => {
      expect(res._id).toBe('2');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    service.deleteProduct('1').subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}products/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
