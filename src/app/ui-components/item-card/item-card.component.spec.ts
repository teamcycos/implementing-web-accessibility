import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemCardComponent} from './item-card.component';
import {axe, toHaveNoViolations} from "jasmine-axe";

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [ItemCardComponent]
});
    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.addMatchers(toHaveNoViolations);
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(await axe(fixture.nativeElement, {rules: {
        'empty-heading': { enabled: false }
      }})).toHaveNoViolations();
  });
});
