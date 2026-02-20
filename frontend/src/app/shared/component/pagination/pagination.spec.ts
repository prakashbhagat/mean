import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;

    component.currentPage = 1;
    component.totalPages = 5;
    component.totalItems = 50;
    component.limit = 10;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate pages correctly (1 to 5)', () => {
    component.generatePages();
    expect(component.pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('should emit pageChange on next click', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.totalPages = 5;
    component.onNext();
    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should not emit pageChange on next if already at last page', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 5;
    component.totalPages = 5;
    component.onNext();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit pageChange on previous click', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 2;
    component.onPrevious();
    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should not emit pageChange on previous if at first page', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.onPrevious();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit pageChange when clicking a specific page number', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.onPageChange(3);
    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should ignore ellipsis clicks', () => {
    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.onPageChange('...');
    expect(emitSpy).not.toHaveBeenCalled();
  });
});
