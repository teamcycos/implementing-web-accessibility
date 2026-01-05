import {Routes} from '@angular/router';
import {FirstPageComponent} from "./ui-components/first-page/first-page.component";
import {SecondPageComponent} from "./ui-components/second-page/second-page.component";

export const appRoutes: Routes = [
	{
		path: 'first-page',
		component: FirstPageComponent,
		data: { title: 'Page 1' }
	},
	{
		path: 'second-page',
		component: SecondPageComponent,
		data: { title: 'Page 2' },
	},
	{ path: '**', component: FirstPageComponent } // This must be the last route in the array!
];

