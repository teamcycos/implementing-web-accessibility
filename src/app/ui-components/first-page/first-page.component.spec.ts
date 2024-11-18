import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FirstPageComponent} from './first-page.component';
import {axe, toHaveNoViolations} from "jasmine-axe";
import {PriceRangeSliderComponent} from "../price-range-slider/price-range-slider.component";
import {ItemCardComponent} from "../item-card/item-card.component";

describe('FirstPageComponent', () => {
  let component: FirstPageComponent;
  let fixture: ComponentFixture<FirstPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FirstPageComponent, PriceRangeSliderComponent, ItemCardComponent]
    });
    fixture = TestBed.createComponent(FirstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should render title', () => {
    const fixture = TestBed.createComponent(FirstPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.innerText).toContain('Products App');
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });
});

