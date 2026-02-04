import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { axe, toHaveNoViolations } from "jasmine-axe";
import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { ItemCardComponent } from "./ui-components/item-card/item-card.component";
import { PriceRangeSliderComponent } from "./ui-components/price-range-slider/price-range-slider.component";

describe("AppComponent", () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [RouterModule.forRoot(appRoutes), PriceRangeSliderComponent, ItemCardComponent, AppComponent],
			declarations: [],
		}),
	);

	beforeEach(() => jasmine.addMatchers(toHaveNoViolations));

	it("should create the app", async () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		fixture.detectChanges();
		expect(app).toBeTruthy();
		expect(await axe(fixture.nativeElement)).toHaveNoViolations();
	});

	it(`should have as title 'accessibilityApp'`, () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app.title).toEqual("accessibilityApp");
	});
});
