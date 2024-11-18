import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {PriceRangeSliderComponent} from "./ui-components/price-range-slider/price-range-slider.component";
import {ItemCardComponent} from "./ui-components/item-card/item-card.component";
import {RouterTestingModule} from "@angular/router/testing";

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent, PriceRangeSliderComponent, ItemCardComponent]
  }));

  beforeEach(() => jasmine.addMatchers(toHaveNoViolations));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
    expect(await axe(fixture.nativeElement)).toHaveNoViolations();
  });

  it(`should have as title 'accessibilityApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('accessibilityApp');
  });
});
