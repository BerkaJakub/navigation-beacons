import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { NgZone } from "@angular/core";

import { Vibration } from '@ionic-native/vibration';
import { TextToSpeech } from '@ionic-native/text-to-speech';

import { BeaconProvider } from '../../providers/beacon-provider';

import { BeaconModel } from '../../models/beacon-model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  beaconsData: BeaconModel[] = [];
  zone: any;

  route: any;
  activeSegment: any;
  activeSegmentIndex: number;


  constructor(private change: ChangeDetectorRef, private vibration: Vibration, private tts: TextToSpeech, private platform: Platform,
    public navCtrl: NavController, public beaconProvider: BeaconProvider, public events: Events) {
    this.zone = new NgZone({ enableLongStackTrace: false });

    this.route = {
      routeDescription: "Trasa z adresy Karlovo náměstí 293/13  na adresu Karlovo náměstí 293/13 do učebny Ká 328 v budově E. Trasa je dlouhá asi 1000 metrů a vede přes 5 přechodů. Součástí trasy je cesta tramvají ze zastávky Jiráskovo náměstí na zastávku Myslíkova. Postav se tak, abys měl budovy za zády.",
      segments: [
        {
          description: "Jsi ve vstupní hale budovy A, ČVUT.",
          action: "Jdi rovně asi 5 metrů volným prostorem k turniketům před tebou.",
          startBeacon: "4vXL",
          endBeacon: "ODUM"

        },
        {
          description: "Vstupní turnikety uprostřed vstupní haly. Čtečka karet je ve výšce pasu po levé ruce u každého z celkem 4 turniketů.",
          action: "Projdi turnikety",
          startBeacon: "ODUM",
          endBeacon: undefined
        },
        {
          description: "Volný prostor asi 6 metrů dlouhý, po levé i pravé ruce schodiště nahoru. Poté dva sloupy vlevo i vpravo. Na konci prostoru jsou dřevěné dveře se skleněnou výplní, většinou otevřené.",
          action: "Jdi rovně a projdi dveřmi.",
          startBeacon: undefined,
          endBeacon: "vf3i"

        },
        {
          description: "Úzká rovná chodba asi 10 m dlouhá, před koncem chodby většinou otevřené dvojkřídlé skleněné dveře s madlem.",
          action: "Jdi chodbou ke dveřím a projdi.",
          startBeacon: "vf3i",
          endBeacon: "y4Wl"

        }
      ],
      routeBeacons: [
        { id: "4vXL", uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 12345, minor: 3775 },
        { id: "ODUM", uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 13796, minor: 64969 },
        { id: "vf3i", uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 999, minor: 300 },
        { id: "y4Wl", uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 2000, minor: 202 }
      ]
    }

    this.activeSegmentIndex = 0;
    this.activeSegment = this.route.segments[this.activeSegmentIndex];

  }

  nextSegment() {
    if(this.activeSegmentIndex < this.route.segments.length - 1){
      this.activeSegmentIndex++;
    }
    this.activeSegment = this.route.segments[this.activeSegmentIndex];
  }


  previousSegment() {
    if (this.activeSegmentIndex > 0) {
      this.activeSegmentIndex--;
    }
    this.activeSegment = this.route.segments[this.activeSegmentIndex];
  }

  startScan() {
    this.platform.ready().then(() => {
      this.beaconProvider.initialise(this.route.routeBeacons[0]).then((isInitialised) => {
        if (isInitialised) {

          this.listenToBeaconEvents();


        }
      });
    });



  }



  listenToBeaconEvents() {
    this.events.subscribe('didRangeBeaconsInRegion', (data) => {
      console.log(data);
      this.zone.run(() => {
        this.beaconsData = data.beacons;
        console.log(this.beaconsData);
        this.beaconsData.forEach((beacon) => {
          console.log(beacon);
          if (beacon.major == 12345 && beacon.minor == 3775) {
            if (beacon.proximity == 'ProximityImmediate') {
              this.vibration.vibrate(100);
            }
          }

        });

      });

    });

  }


}
