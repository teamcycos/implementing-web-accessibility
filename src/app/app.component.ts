import { Component, type OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import type { ItemCard } from "./ui-components/item-card/item-card.component";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterModule],
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	title = "accessibilityApp";
	priceRange!: number;
	selectedPrice = 150;
	filteredItems: ItemCard[] = [];

	onPriceRangeChanged(event: Event) {
		this.selectedPrice = Number((event.target as HTMLInputElement).value);
		this.onPriceChanged(this.selectedPrice);
	}

	minValue = 1;
	maxValue = 200;
	items: ItemCard[] = [
		{
			name: "Ukulele",
			image: "./assets/images/ukulele.jpg",
			link: "link/to/Item1",
			description: "Beautiful Ukulele imported from Spain",
			price: 150,
		},
		{
			name: "Guiro",
			image: "./assets/images/guiro.jpg",
			link: "link/to/Item2",
			description: "This is a latin instrument imported from Mexico",
			price: 100,
		},
		{
			name: "Sax",
			image: "./assets/images/sax.jpg",
			link: "link/to/Item3",
			description: "Professional Saxophone",
			price: 99,
		},
		{
			name: "Accordion",
			image: "./assets/images/acordeon.jpg",
			link: "link/to/Item4",
			description: "This acordeon was donated by Celso Piña",
			price: 115,
		},
	];

	ngOnInit(): void {
		this.priceRange = 160;
		this.filteredItems = [...this.items];
	}

	onPriceChanged(price: number) {
		this.priceRange = price;
		this.filteredItems = this.items.filter((item) => {
			return item.price <= this.priceRange;
		});
	}
}
