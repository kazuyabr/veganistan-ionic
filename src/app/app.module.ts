import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { MapPage } from "../pages/map/map";
import { PlacePage } from "../pages/place/place";
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { PlacesService } from "../providers/places-service/places-service";

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    PlacePage,
    TabsPage,
    AboutPage,
    ContactPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    PlacePage,
    TabsPage,
    AboutPage,
    ContactPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, PlacesService]
})
export class AppModule {}
