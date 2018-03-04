import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

/**
 * Generated class for the NextSegmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-next-segment',
  templateUrl: 'next-segment.html',
})
export class NextSegmentPage {
  description: string; 
  state: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private mobileAccessibility: MobileAccessibility, private platform: Platform) {
    
    this.state = navParams.get("state");
    console.log(this.state);
    document.title = "První segment z 15";
    
   
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad NextSegmentPage');
  }

}
