import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownQuantityComponent } from './drop-down-quantity.component';

describe('DropDownQuantityComponent', () => {
  let component: DropDownQuantityComponent;
  let fixture: ComponentFixture<DropDownQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropDownQuantityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropDownQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
