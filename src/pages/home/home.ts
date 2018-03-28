import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, Events, NavParams } from 'ionic-angular';
import { NgZone } from "@angular/core";


import { BeaconProvider } from '../../providers/beacon-provider';
import { RouteProvider } from '../../providers/route-provider';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
 
  zone: any;
  state: any;


  constructor(private change: ChangeDetectorRef, private platform: Platform,  public navParams: NavParams,
    public navCtrl: NavController, public routeProvider: RouteProvider, public events: Events) {
    this.zone = new NgZone({ enableLongStackTrace: false });
    if(navParams.get("state") != undefined){
      this.state = navParams.get("state");
    }else{
      this.state = this.routeProvider.getInitState();
    }
  }

  nextSegment() {
    let state = this.routeProvider.nextSegment();
    this.navCtrl.push(HomePage, {
      state: state
    });

  }

  previousSegment() {
    let state = this.routeProvider.previousSegment();
    this.navCtrl.push(HomePage, {
      state: state
    });
  }

  ionViewDidLoad() {
    document.title = this.state.segmentNumber;
    if(!this.routeProvider.isScanning){
      this.routeProvider.startScan();
    } 
  }


}

