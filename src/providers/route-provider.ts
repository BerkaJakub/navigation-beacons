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
            routeDescription: "Trasa z bodu A do bodu B, dlouhá asi 100 metrů.",
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
                    "from": "e", "to": "c",
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
                    "from": "e", "to": "c",
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
            "4vXL": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 200 },
            "ODUM": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 100 },
            "vf3i": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 300 },
            "y4rk": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 1000, minor: 400 }
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
            this.history.push({ node: this.actualNode, description: this.actualDescription, segmentNumber: this.segmentNumber });
        }
        this.errorBeacons = [];
        outEdges.forEach(edgeID => {
            var edge = this.routeGraph.edges[edgeID];
            if (this.routeGraph.nodes[edge.to].beaconID != undefined) {
                var ID = this.routeGraph.nodes[edge.to].beaconID;
                this.errorBeacons.push(this.routeBeacons[ID]);
            }
            if (edge.isOnRoute) {
                this.actualDescription = edge.data.description + edge.data.action;
                this.actualNode = edge.to;
                this.segmentNumber = edge.data.segmentNumber;
                this.mobileAccessibility.isScreenReaderRunning().then((isRunning) => {
                    if (isRunning) {
                        console.log("TalkBack Is Running");

                    }
                });

            }
        });
        if (this.actualNode == this.routeGraph.endNode) {
            this.showNext = false;
        }

        return {
            actualDescription: this.actualDescription,
            actualNode: this.actualNode,
            segmentNumber: this.segmentNumber,
            showNext: this.showNext,
            showPrev: this.showPrev
        }

    }

    previousSegment() {
        this.rssiArray = [];
        this.didNotificate = false;
        var previous = this.history.pop();
        this.actualNode = previous.node;
        this.actualDescription = previous.description;
        this.segmentNumber = previous.segmentNumber;    
        this.showNext = true;
        if (this.actualNode == this.routeGraph.startNode) {
            this.showPrev = false;
        }

        return {
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
        console.log("beaconsData", this.beaconsData);
        var filtered = data.beacons.filter((beacon) => {
            var actualID = this.routeGraph.nodes[this.actualNode].beaconID;
            console.log(this.actualNode, actualID);
            if (this.routeBeacons[actualID] != undefined) {
                console.log(this.routeBeacons[actualID]);
                return beacon.minor == this.routeBeacons[actualID].minor;
            } else {
                return false;
            }
        });
        console.log("filtered ", filtered);
        if (!this.didNotificate) {
            this.checkFilteredBeacons(filtered);
        }


    }

    checkFilteredBeacons(filtered) {
        filtered.forEach(beacon => {
            this.rssiArray.push(beacon.rssi);
            //console.log(this.getRange(beacon.tx, beacon.rssi));
            console.log(this.rssiArray);
            if (this.rssiArray.length == 3) {
                var sum = this.rssiArray.reduce((a, b) => { return a + b; })
                var rssiAvg = sum / this.rssiArray.length;
                this.rssiArray = [];
                if (rssiAvg > - 82) {
                    this.mobileAccessibility.speak("Jsi blízko majáčku" + beacon.minor, 1);
                    this.vibration.vibrate([30, 40, 50]);
                    this.didNotificate = true;
                }
            }
        });
    }

    getRange(txCalibratedPower, rssi) {
        var ratio_db = txCalibratedPower - rssi;
        var ratio_linear = Math.pow(10, ratio_db / 10);

        var r = Math.sqrt(ratio_linear);
        return r;
    }








}