import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PriceRangeSliderComponent} from './price-range-slider.component';
import {axe, toHaveNoViolations} from "jasmine-axe";

describe('PriceRangeSliderComponent', () => {
  let component: PriceRangeSliderComponent;
  let fixture: ComponentFixture<PriceRangeSliderComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [PriceRangeSliderComponent]
});
    fixture = TestBed.createComponent(PriceRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});
