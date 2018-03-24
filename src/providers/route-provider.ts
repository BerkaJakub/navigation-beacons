import { Injectable } from '@angular/core';
import { Platform, Events } from 'ionic-angular';

import { BeaconModel } from '../models/beacon-model';
import { BeaconProvider } from '../providers/beacon-provider';

import { Vibration } from '@ionic-native/vibration';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';

@Injectable()
export class RouteProvider {
    beaconsData: BeaconModel[] = [];
    routeGraph: any;
    routeBeacons: object;
    zone: any;
    state: any;
    activeSegment: any;
    activeSegmentIndex: number;
    nextBeacon: object;
    actualDescription: string;
    actualNode: any;
    actualID: string;
    history: Array<any>;
    errorBeacons: Array<any>;
    didNotificate: boolean; // true if we notficated user already
    isApproaching: boolean; //
    rssiArray: Array<any>; // to store rssi values of ranged beacon
    showNext: boolean;
    showPrev: boolean;
    isScanning: boolean;
    segmentNumber: string;

    constructor(public beaconProvider: BeaconProvider, public events: Events, public mobileAccessibility: MobileAccessibility, private platform: Platform, private vibration: Vibration, private tts: TextToSpeech, ) {
        this.routeGraph = {
            routeDescription: "Trasa z adresy Karlovo náměstí 557/30 na adresu Karlovo náměstí 293/13 do místnosti 317 v budově E areálu ČVUT. Trasa je asi 700 metrů dlouhá a vede přes 3 přechody. Součástí trasy je jízda tramvají ze zastávky Štěpánská na zastávku Novoměstská radnice. Postav se tak, ať máš budovy za zády.",
            startNode: "a",
            endNode: "d",
            "adjacency": { //mapping each node identifier to an array of edge identifiers, each corresponds to an edge going out of the node.
                "a": ["1"],
                "b": ["2"],
                "c": ["3", "4", "6"],
                "d": [],
                "e": ["5"],
                "f": ["7"]
            },
            "nodes": {
                "a": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "b": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "c": {
                    isOnRoute: true,
                    beaconID: "4vXL"
                },
                "d": {
                    isOnRoute: true,
                    beaconID: "ODUM"
                },
                "e": {
                    isOnRoute: false,
                    isEndNode: false,
                    beaconID: "vf3i"
                },
                "f": {
                    isOnRoute: false,
                    beaconID: "y4rk"
                }
            },
            "edges": {
                "1": {
                    "from": "a", "to": "b",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "1. úsek ze 3",
                        description: "Plošina asi 5 metrů dlouhá. Povrch gumová rohož. Na konci plošiny je přímé schodiště nahoru.",
                        action: "Dojdi ke schodišti na konec plošiny."
                    }
                },
                "2": {
                    "from": "b", "to": "c",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "2. úsek ze 3",
                        description: "Přímé kamenné schodiště. Hned nad schodištěm jsou dřevěné lítačky.",
                        action: "Vyjdi nahoru a projdi dveřmi. Pozor plošina nad schodištěm je velmi krátká."
                    }
                },
                "3": {
                    "from": "c", "to": "d",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "3. úsek ze 3",
                        description: "Plošina hlavního schodiště v přízemí. Povrch dlaždice. Před tebou jsou schody nahoru. Vlevo jsou dřevěné dveře se skleněnou výplní.",
                        action: "Otoč se vlevo a dojdi ke dveřím. Pozor, vpravo i vlevo od schodiště nahoru jsou schody dolů."
                    }
                },
                "4": {
                    "from": "c", "to": "e",
                    isOnRoute: false,
                    "data": {
                        description: "",
                        action: ""
                    }
                },
                "5": {
                    "from": "f", "to": "c",
                    isOnRoute: false,
                    "data": {
                        description: "Sešel jsi z trasy.",
                        action: "Vrať se na předchozí úsek."
                    }
                },
                "6": {
                    "from": "c", "to": "f",
                    isOnRoute: false,
                    "data": {
                        description: "",
                        action: ""
                    }
                },
                "7": {
                    "from": "f", "to": "c",
                    isOnRoute: false,
                    "data": {
                        description: "Sešel jsi z trasy.",
                        action: "Vrať se na předchozí úsek."
                    }
                }
            }

        }

        this.routeBeacons = {
            "4vXL": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 200, rssiTrigger: -80, rssiArray: [] },
            "ODUM": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 100, rssiTrigger: -80, rssiArray: [] },
            "vf3i": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 300, rssiTrigger: -80, rssiArray: [] },
            "y4rk": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 400, rssiTrigger: -80, rssiArray: [] }
        }
        this.actualNode = this.routeGraph.startNode;
        this.actualDescription = this.routeGraph.routeDescription;
        this.history = [];
        this.errorBeacons = [];
        this.didNotificate = false;
        this.showNext = true;
        this.showPrev = false;
        this.segmentNumber = "Popis trasy";


    }

    getInitState() {
        console.log("getInitState")
        return {
            actualNode: this.routeGraph.startNode,
            actualDescription: this.routeGraph.routeDescription,
            segmentNumber: this.segmentNumber,
            showNext: true,
            showPrev: false
        }

    }


    nextSegment() {
        this.showNext = true;
        this.showPrev = true;
        this.rssiArray = [];
        this.didNotificate = false;
        var outEdges = this.routeGraph.adjacency[this.actualNode];
        if (outEdges.length > 0) { // if we are not in final segment, i.e. no edges go out from node
            this.history.push({ node: this.actualNode, description: this.actualDescription, segmentNumber: this.segmentNumber, errorBeacons: this.errorBeacons, actualID: this.actualID });
        }
        this.errorBeacons = [];

        outEdges.forEach(edgeID => {
            var edge = this.routeGraph.edges[edgeID];

            if (edge.isOnRoute) {
                this.actualDescription = edge.data.description + edge.data.action;
                this.actualNode = edge.to;
                this.segmentNumber = edge.data.segmentNumber;
                this.actualID = this.routeGraph.nodes[this.actualNode].beaconID;

            } else { // error edge
                var ID = this.routeGraph.nodes[edge.to].beaconID;
                this.errorBeacons.push(this.routeBeacons[ID]);
            }
        });
        if (this.actualNode == this.routeGraph.endNode) { // end of the route, dont show next segment button
            this.showNext = false;
        }

        return { // return state
            actualDescription: this.actualDescription,
            actualNode: this.actualNode,
            segmentNumber: this.segmentNumber,
            showNext: this.showNext,
            showPrev: this.showPrev,

        }

    }

    previousSegment() {
        this.rssiArray = [];
        this.didNotificate = false;
        var previous = this.history.pop();
        this.actualNode = previous.node;
        this.actualDescription = previous.description;
        this.segmentNumber = previous.segmentNumber;
        this.errorBeacons = previous.errorBeacons;
        this.actualID = previous.actualID;
        this.showNext = true;
        if (this.actualNode == this.routeGraph.startNode) { // start of the route, dont show previous segment button
            this.showPrev = false;
        }

        return { // return state
            actualDescription: this.actualDescription,
            actualNode: this.actualNode,
            segmentNumber: this.segmentNumber,
            showNext: this.showNext,
            showPrev: this.showPrev
        }

    }

    startScan() {
        this.platform.ready().then(() => {
            this.beaconProvider.initialise().then((isInitialised) => {
                if (isInitialised) {
                    this.events.subscribe('didRangeBeaconsInRegion', this.filterBeaconsHandler);
                    this.isScanning = true;

                }
            });
        });

    }

    filterBeaconsHandler: any = (data) => {
        this.beaconsData = data.beacons;
        // console.log("beaconsData", this.beaconsData);
        data.beacons.map((beacon) => {
            if (this.routeBeacons[this.actualID] != undefined) {
                //console.log(this.routeBeacons[actualID]);
                if (beacon.minor == this.routeBeacons[this.actualID].minor &&
                    beacon.major == this.routeBeacons[this.actualID].major) {
                    this.routeBeacons[this.actualID].rssiArray.push(beacon.rssi);
                }
            }
        });

        this.filterErrorBeacons(data.beacons);
        this.checkErrorBeacons();
        if (!this.didNotificate) {
            if(this.routeBeacons[this.actualID] != undefined){
                this.checkCorrectBeacon();
            }
            
        }


    }

    filterErrorBeacons(beacons) {

        beacons.map((beacon) => {
            for (let index = 0; index < this.errorBeacons.length; index++) {
                if (beacon.minor == this.errorBeacons[index].minor && beacon.major == this.errorBeacons[index].major) {
                    this.errorBeacons[index].rssiArray.push(beacon.rssi);
                    console.log(beacon.major, beacon.minor, beacon.rssi);

                }
            }
        });
    }

    checkErrorBeacons() {
        this.errorBeacons.forEach(beacon => {
            if (beacon.rssiArray.length == 3) {
                beacon.rssiArray.sort((a, b) => a - b);
                let median = beacon.rssiArray[1];
                if (median > beacon.rssiTrigger) {
                    console.log(median, " > ", beacon.rssiTrigger);
                    this.vibration.vibrate([100, 100, 100]);
                    this.mobileAccessibility.speak("Jsi na špatné cestě, vrať se zpět na začátek úseku", 20);

                }
                beacon.rssiArray = [];
            }
        });
    }

    checkCorrectBeacon() {
        let beacon = this.routeBeacons[this.actualID];
        if (beacon.rssiArray.length == 3) {
            beacon.rssiArray.sort((a, b) => a - b);
            let median = beacon.rssiArray[1];
            if (median > beacon.rssiTrigger) {
                console.log(median, " > ", beacon.rssiTrigger);
                this.vibration.vibrate([100, 100, 100]);
                this.mobileAccessibility.speak("Jsi blízko konce tohoto úseku", 10);
                this.didNotificate = true;
            }
            this.routeBeacons[this.actualID].rssiArray = [];
        }

    }

}