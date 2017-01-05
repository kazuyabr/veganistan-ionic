import { Component } from "@angular/core";
import { NavController, NavParams, LoadingController } from "ionic-angular";
import { PlacesService } from "../../providers/places-service/places-service";

@Component({
  templateUrl: "./place.html"
})

export class PlacePage {
  public place: any;
  public id: any;
  public loader:any;

  constructor(
    private navController: NavController,
    private navParams: NavParams,
    public loadingCtrl: LoadingController,
    public placesService: PlacesService ) {
  		this.id = navParams.get('id');
      this.loader = this.loadingCtrl.create({
        content: "Laddar..."
      });
      this.loader.present();
  	}

  ngAfterViewInit(): void {
    console.log(this.id);
  	this.placesService.loadPlace( this.id )
      .then(data => {
        this.place = data;
        this.loader.dismissAll();
    });
  }
};