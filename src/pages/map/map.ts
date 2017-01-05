import { Component, trigger, state, style, transition, animate } from "@angular/core";
import { Events, NavController, Platform, LoadingController } from "ionic-angular";
import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, GoogleMapsMarker, CameraPosition, Geolocation } from "ionic-native";
import { PlacesService } from "../../providers/places-service/places-service";
import { PlacePage } from "../place/place";
import "rxjs/add/operator/map";

@Component({
  templateUrl: "./map.html",
  animations: [
    trigger('heroState', [
      state('inactive', style({
        transform: 'translateY(145%)'
      })),
      state('active',   style({
        transform: 'translateY(0)'
      })),
      state('unfolded',   style({
        height: 'calc(100% - 20px)'
      })),
      transition('inactive => active', animate('250ms ease-in')),
      transition('active => inactive', animate('100ms ease-out')),
      transition('active => unfolded', animate('250ms ease-out')),
      transition('unfolded => active', animate('100ms ease-out'))
    ])
  ]
})

export class MapPage {
  private map: GoogleMap;
  public places: any;
  public place: any;
  public foldState: 'unfolded';
  public placeState: any = 'inactive';
  public userposition: GoogleMapsLatLng;
  public markers: Array<GoogleMapsMarker>;
  public timer: any;
  public loader:any;

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private platform: Platform,
    public loadingCtrl: LoadingController,
    public placesService: PlacesService ) {
      this.loader = this.loadingCtrl.create({
        content: "Laddar..."
      });
      this.loader.present();
  }
  
  loadMap() {
    this.platform.ready()
      .then(() => {
        GoogleMap.isAvailable()
          .then((isAvailable: boolean) => {
            if (!isAvailable) return;
            this.map = new GoogleMap("map_canvas");

            this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(() => {
              this.events.publish("icon:change", null);
              this.placeState = 'inactive';
              setTimeout(()=>{
                this.place = null;
              }, 150);
            });

            this.loadPlaces();
            this.locateUser();
          });
      });
  }

  locateUser(): void {
    let watch = Geolocation.watchPosition();
    let latlng: GoogleMapsLatLng = new GoogleMapsLatLng(0,0);

    let markerOptions: any = {
      "position": latlng,
      "icon": {
        "url": "assets/images/user-marker.png",
        "size": {
          "width": 20,
          "height": 20
        }
      }
    };

    this.map.addMarker(markerOptions).then( (marker: GoogleMapsMarker) => {
      Geolocation.getCurrentPosition().then((resp) => {
        this.userposition = new GoogleMapsLatLng(resp.coords.latitude, resp.coords.longitude);
        marker.setPosition(this.userposition);

        let position: CameraPosition = {
          target: this.userposition,
          zoom: 15,
          tilt: 0
        };
        this.map.moveCamera(position);
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      watch.subscribe((data) => {
        this.userposition = new GoogleMapsLatLng(data.coords.latitude, data.coords.longitude);
        marker.setPosition(this.userposition);
      });
    });
  }

  loadPlaces(): void {
    this.placesService.loadAll()
    .then(data => {
      this.places = data;

      /*
      this.place = data[0]; // WEB MODE
      this.placeState = 'active'; // WEB MODE
      */
      /*
      WEB MODE ON
      */
      this.places.map(function(place){
        this.addMarker(place);
      }, this);

      this.loader.dismissAll();
    });
  }

  addMarker(place): void {
    let latlng: GoogleMapsLatLng = new GoogleMapsLatLng(place.loc[1], place.loc[0]);
    let markerOptions: any = {
      "position": latlng,
      "disableAutoPan": true,
      "icon": {
        "url": "assets/images/icon-big.png",
        "size": {
          "width": 20,
          "height": 22
        }
      }
    };

    this.map.addMarker(markerOptions).then( (marker: GoogleMapsMarker) => {
      this.events.subscribe("icon:change", (currentPlace) => {
        if ( currentPlace == place ) {
          marker.setIcon({
            "url": "assets/images/icon-big.png",
            "size": {
              "width": 40,
              "height": 44
            }
          });
        } else {
          marker.setIcon({
            "url": "assets/images/icon-big.png",
            "size": {
              "width": 20,
              "height": 22
            }
          });
        }
      });

      // Waiting for the the marker to be clicked
      marker.addEventListener(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.map.animateCamera({
          'target': latlng,
          'zoom': 17,
          'duration': 250
        });

        this.placeState = 'active';
        this.events.publish("icon:change", place);

        this.placeState = 'inactive';
        setTimeout(()=>{
          this.place = place;
          this.placeState = 'active';
        }, 150);


        this.events.publish("icon:change", place);
      });
    });
  }

  toggleFoldedState(): void {
    // push another page onto the history stack
    // causing the nav controller to animate the new page in
    this.placeState = (this.placeState == 'unfolded' ) ? 'active' : 'unfolded';
    setTimeout(()=>{
      this.map.refreshLayout();
    }, 300);
  }

  distance(lat1, lon1, lat2, lon2, unit): number {
    // calculates the distance between two geolocations
    // and returns the answer in either Miles (US), Kilometers och Meters
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="M") { dist = dist * 1,609.344 }
    return dist
  }

  ngAfterViewInit(): void {
    //this.loadPlaces(); // WEB MODE
    
    /*
    WEB MODE ON
    */
    this.loadMap();
    
  }
};