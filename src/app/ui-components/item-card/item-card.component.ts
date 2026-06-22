import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

export interface ItemCard {
	name: string;
	link: string;
	image: string;
	description: string;
	price: number;
}

@Component({
	selector: "app-item-card",
	templateUrl: "./item-card.component.html",
	styleUrls: ["./item-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.Eager,
	standalone: true,
})
export class ItemCardComponent {
	@Input() name = "";
	@Input() link = "";
	@Input() image = "";
	@Input() description = "";
	@Input() price = 0;
	@Input() index = 0;
}
