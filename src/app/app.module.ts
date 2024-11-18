import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ItemCardComponent} from './ui-components/item-card/item-card.component';
import {PriceRangeSliderComponent} from './ui-components/price-range-slider/price-range-slider.component';
import {FirstPageComponent} from './ui-components/first-page/first-page.component';
import {SecondPageComponent} from './ui-components/second-page/second-page.component';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    ItemCardComponent,
    PriceRangeSliderComponent,
    FirstPageComponent,
    SecondPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
