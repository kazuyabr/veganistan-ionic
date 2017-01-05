import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { MapPage } from '../pages/map/map';
import { PlacesService } from "../providers/places-service/places-service";

@Component({
  template: "<ion-nav [root]='mapPage'></ion-nav>",
  providers: [PlacesService]
})
export class MyApp {
  tabsPage = TabsPage;
  mapPage = MapPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.overlaysWebView(true);
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
