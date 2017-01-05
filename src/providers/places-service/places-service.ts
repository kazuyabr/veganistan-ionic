import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

/*
  Generated class for the PlacesService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PlacesService {
  data: any;

  constructor(private http: Http) {}

  loadNear( position ) {
    let query = {
      "loc" : {
        "$near" : [ position.lng, position.lat ],
        "$maxDistance" : 0.00999640028
      }
    };
    let querystring = JSON.stringify(query);

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get("https://dry-wildwood-59859.herokuapp.com/places?query=" + querystring)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }

  loadPlace( id ) {
    let query = {
      "_id" : id
    };
    let querystring = JSON.stringify(query);

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get("https://vegokoll-rest.herokuapp.com/api/v1/place/?query=" + querystring + "&limit=" + 1)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data[0];
          resolve(this.data);
        });
    });
  }

  loadAll() {
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get("https://vegokoll-rest.herokuapp.com/api/v1/place/?sort=title")
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }

  loadBound( box, limit = 100 ) {
    let query = {
      "loc" : {
        "$geoWithin" : {
          "$box" : [ [ box[0] , box[1] ] , [ box[2] , box[3] ] ]
        }
      }
    };
    let querystring = JSON.stringify(query);

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get("https://vegokoll-rest.herokuapp.com/api/v1/place/?query=" + querystring + "&limit=" + limit)
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.data = data;
          resolve(this.data);
        });
    });
  }

}