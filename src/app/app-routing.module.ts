import {isDevMode, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FirstPageComponent} from "./ui-components/first-page/first-page.component";
import {SecondPageComponent} from "./ui-components/second-page/second-page.component";

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: isDevMode() })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
