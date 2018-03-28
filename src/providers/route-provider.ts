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
    didNotificateError: boolean;
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
            endNode: "an",
            "adjacency": { //mapping each node identifier to an array of edge identifiers, each corresponds to an edge going out of the node.
                "a": ["1"],
                "b": ["2"],
                "c": ["3"],
                "d": ["4"],
                "e": ["5"],
                "f": ["6"],
                "g": ["7"],
                "h": ["8"],
                "i": ["9"],
                "j": ["10"],
                "k": ["11"],
                "l": ["12"],
                "m": ["13"],
                "n": ["14"],
                "o": ["15", "16", "17"],
                "p": ["18"],
                "q": ["19"],
                "r": ["20"],
                "s": ["21"],
                "t": ["22"],
                "u": ["23"],
                "v": ["24"],
                "w": ["25"],
                "x": ["26"],
                "y": ["27"],
                "z": ["28"],
                "aa": ["29", "30", "31", "32"],
                "ab": ["33","34"],
                "ac": ["35", "36", "37"],
                "ad": ["38"],
                "ae": ["39", "40"],
                "af": ["41"],
                "ag": ["42", "43"],
                "ah": ["44", "45"],
                "ai": ["46", "52", "47"],
                "aj": ["48"],
                "ak": ["49"],
                "al": ["50"],
                "am": ["51"],
                "an": []
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
                    beaconID: "U4tv"
                },
                "d": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "e": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "f": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "g": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "h": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "i": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "j": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "k": {
                    isOnRoute: true,
                    beaconID: "KfLr"
                },
                "l": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "m": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "n": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "o": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "p": {
                    isOnRoute: true,
                    beaconID: "6pDr"
                },
                "q": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "r": {
                    isOnRoute: true,
                    beaconID: "6bUB"
                },
                "s": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "t": {
                    isOnRoute: true,
                    beaconID: "Lto1"
                },
                "u": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "v": {
                    isOnRoute: true,
                    beaconID: "m46J"
                },
                "w": {
                    isOnRoute: true,
                    beaconID: "2LxK"
                },
                "x": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "y": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "z": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "aa": {
                    isOnRoute: true,
                    beaconID: "ulWB"
                },
                "ab": {
                    isOnRoute: true,
                    beaconID: "BGNA"
                },
                "ac": {
                    isOnRoute: true,
                    beaconID: "S8Nn"
                },
                "ad": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "ae": {
                    isOnRoute: true,
                    beaconID: "xTni"
                },
                "af": {
                    isOnRoute: true,
                    beaconID: "dwR7"
                },
                "ag": {
                    isOnRoute: true,
                    beaconID: "2Y5M"
                },
                "ah": {
                    isOnRoute: true,
                    beaconID: "yODr"
                },
                "ai": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "aj": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "ak": {
                    isOnRoute: true,
                    beaconID: "y4Wl"
                },
                "al": {
                    isOnRoute: true,
                    beaconID: "bz7E"
                },
                "am": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "an": {
                    isOnRoute: true,
                    beaconID: undefined
                },
                "ep1": {
                    isOnRoute: false,
                    beaconID: "kDaJ"
                },
                "ep2": {
                    isOnRoute: false,
                    beaconID: "U6ne"
                },
                "eab1": {
                    isOnRoute: false,
                    beaconID: "0DIb"
                },
                "eab2": {
                    isOnRoute: false,
                    beaconID: "wapV"
                },
                "eab3": {
                    isOnRoute: false,
                    beaconID: "1cZi"
                },
                "eac1": {
                    isOnRoute: false,
                    beaconID: "1cZi"
                },
                "ead1": {
                    isOnRoute: false,
                    beaconID: "jd2h"
                },
                "ead2": {
                    isOnRoute: false,
                    beaconID: "ajes"
                },
                "eaf1": {
                    isOnRoute: false,
                    beaconID: "uTlg"
                },
                "eah1": {
                    isOnRoute: false,
                    beaconID: "gwIq"
                },
                "eai1": {
                    isOnRoute: false,
                    beaconID: "6eZY"
                },
                "eaj1": {
                    isOnRoute: false,
                    beaconID: "1Ydz"
                }
            },
            "edges": {
                "1": {
                    "from": "a", "to": "b",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "1. úsek ze 3",
                        description: "Jsi na adrese Karlovo náměstí 557/30.",
                        action: "Otoč se vlevo a jdi asi 120 metrů na kulatý roh s ulicí Ječná. Po levé ruce měj budovy."
                    }
                },
                "2": {
                    "from": "b", "to": "c",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "2. úsek ze 3",
                        description: "Jsi na kulatém rohu ulic Karlovo náměstí a Ječná.",
                        action: "Otoč se vlevo a jdi asi 110 metrů k označníku zastávky Štěpánská. Zastávka je u chodníku, označník je v přední části zastávky. Po levé ruce měj budovy."
                    }
                },
                "3": {
                    "from": "c", "to": "d",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "3. úsek ze 3",
                        description: "Jsi u označníku zastávky Štěpánská.",
                        action: "Dojeď tramvají číslo 6, 22 nebo 23 na zastávku Novoměstská radnice. Počet zastávek je dva."
                    }
                },
                "4": {
                    "from": "d", "to": "e",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "1. úsek z 8",
                        description: "Zastávka Novoměstská radnice u chodníku, na zastávce se nachází označník zastávky v přední části zastávky, přístřešek v prostřední části. U druhého okraje chodníku je park.",
                        action: "Po výstupu z tramvaje dojdi rovně k rozhraní chodníku a zeleně před tebou za sebou měj tramvajový pás."
                    }
                },
                "5": {
                    "from": "e", "to": "f",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "2. úsek z 8",
                        description: "Jsi v ulici Karlovo náměstí, u zastávky Novoměstská radnice.",
                        action: "Otoč se vlevo a jdi rovně asi 10 metrů na roh chodníků."
                    }
                },
                "6": {
                    "from": "f", "to": "g",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "3. úsek z 8",
                        description: "Jsi na rohu chodníků.",
                        action: "Pokračuj vpřed a přejdi ulici Žitná na protější chodník přes značený přechod se světelnou signalizací s jednosměrným provozem zprava."
                    }
                },
                "7": {
                    "from": "g", "to": "h",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "4. úsek z 8",
                        description: "Jsi na rohu chodníků.",
                        action: "Otoč se vlevo a přejdi ulici Karlovo náměstí na protější chodník přes značený přechod se světelnou signalizací s jednosměrným provozem zprava a tramvají."
                    }
                },
                "8": {
                    "from": "h", "to": "i",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "5. úsek z 8",
                        description: "Jsi v ulici Karlovo náměstí.",
                        action: "Otoč se vlevo a jdi asi 10 metrů na zkosený roh s ulicí Odborů. Po pravé ruce měj budovy."
                    }
                },
                "9": {
                    "from": "i", "to": "j",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "6. úsek z 8",
                        description: "Jsi na zkoseném rohu ulic Karlovo náměstí a Odborů.",
                        action: "Pokračuj vpřed a přejdi ulici Odborů na protější roh přes značený přechod se světelnou signalizací s jednosměrným provozem zleva."
                    }
                },
                "10": {
                    "from": "j", "to": "k",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "7. úsek z 8",
                        description: "Jsi na kulatém rohu ulic Karlovo náměstí a Odborů.",
                        action: "Pokračuj vpřed a jdi asi 150 metrů na adresu Karlovo náměstí 293/13. Vstup do budovy je ve druhém výklenku vyčnívající fasády budovy. Po pravé ruce měj budovy."
                    }
                },
                "11": {
                    "from": "k", "to": "l",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "8. úsek z 8",
                        description: "Jsi u vstupu do budovy A. Je tvořen dvěma dvoukřídlými dveřmi. Vnější vysoké, dřevěné, historické dveře jsou během výuky stále otevřené. Vnitřní prosklené dveře se mechanicky otevírají směrem ven.",
                        action: "Projdi dveřmi."
                    }
                },
                "12": {
                    "from": "l", "to": "m",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "Popis budovy A",
                        description: "Jsi v budově A, ČVUT na Karlově náměstí. Počet pater je 4. Mnoho zavřených dveří se otevírá pomocí čipové karty, kterou je nutné přiložit ke čtečce karet o velikosti 10 krát 5 krát 3 cm a po krátkém pípnutí otevřít. Vrátnice je po pravé ruce po vstupu z ulice.",
                        action: ""
                    }
                },
                "13": {
                    "from": "m", "to": "n",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "1. úsek ze 7",
                        description: " Jsi ve vstupní hale budovy A, ČVUT.",
                        action: "Jdi rovně asi 5 metrů volným prostorem k turniketům před tebou."
                    }
                },
                "14": {
                    "from": "n", "to": "o",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "2. úsek ze 7",
                        description: "Vstupní turnikety uprostřed vstupní haly. Čtečka karet je ve výšce pasu po levé ruce u každého z celkem 4 turniketů.",
                        action: "Projdi turnikety."
                    }
                },
                "15": {
                    "from": "o", "to": "p",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "3. úsek ze 7",
                        description: "Volný prostor asi 6 metrů dlouhý, po levé i pravé ruce schodiště nahoru. Poté dva sloupy vlevo i vpravo. Na konci prostoru jsou dřevěné dveře se skleněnou výplní, většinou otevřené.",
                        action: "Jdi rovně a projdi dveřmi."
                    }
                },
                "16": {
                    "from": "o", "to": "ep1",
                    isOnRoute: false,
                    "data": {
                    }
                },
                "17": {
                    "from": "o", "to": "ep2",
                    isOnRoute: false,
                    "data": {
                    }
                },
                "18": {
                    "from": "p", "to": "q",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "4. úsek ze 7",
                        description: "Úzká rovná chodba asi 10 m dlouhá, před koncem chodby většinou otevřené dvojkřídlé skleněné dveře s madlem.",
                        action: "Jdi chodbou ke dveřím a projdi."
                    }
                },
                "19": {
                    "from": "q", "to": "r",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "5. úsek ze 7",
                        description: "Atrium spojující budovu A s budovou B. Po obvodu jsou dřevěné stoly a lavice, mírně vpravo před tebou je krátké schodiště směrem dolů.",
                        action: "Jdi mírně vpravo volným prostorem asi 10 metrů ke schodišti a sejdi dolu."
                    }
                },
                "20": {
                    "from": "r", "to": "s",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "6. úsek ze 7",
                        description: "Před tebou jsou dvoukřídlé skleněné dveře s madly, většinou otevřené.",
                        action: "Projdi dveřmi."
                    }
                },
                "21": {
                    "from": "s", "to": "t",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "7. úsek ze 7",
                        description: "Chodba asi 13 metrů dlouhá. Po levé ruce jsou nápojové automaty (hučí), na konci chodby dvoje dřevěné dveře se skleněnou výplní hned za sebou.",
                        action: "Jdi rovně na konec chodby ke dveřím a projdi. Pozor následuje vstup na dvůr areálu ČVUT."
                    }
                },
                "22": {
                    "from": "t", "to": "u",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "Popis dvora areálu ČVUT",
                        description: "Jsi na vozovce ve dvoře areálu ČVUT, povrch vozovky je tvořen kočičími hlavami. Po pravé ruce vyhledej rozhraní vozovky a trávníku s nízkým obrubníkem. Pozor ve dvoře jezdí a parkují vozidla, nemají vyhrazené stání.",
                        action: ""
                    }
                },
                "23": {
                    "from": "u", "to": "v",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "1. úsek ze 3",
                        description: "Jsi u rozhraní vozovky a trávníku u vstupu do budovy B.",
                        action: "Jdi podél rozhraní chodníku asi 40 metrů na odbočku vozovky. Po pravé ruce bude nejprve zeleň poté bude trafo stanice."
                    }
                },
                "24": {
                    "from": "v", "to": "w",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "2. úsek ze 3",
                        description: "Jsi na odbočce vozovky, před tebou je budova E.",
                        action: "Otoč se vlevo a jdi asi 30 metrů rovně volným prostorem k pyramidovému schodišti po pravé ruce, kde je vstup do budovy. Budovu E měj po pravé ruce."
                    }
                },
                "25": {
                    "from": "w", "to": "x",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "3. úsek ze 3",
                        description: "Jsi u vstupu do budovy E tvořeného pyramidovým schodištěm. Nad schodištěm jsou velké dřevěné dveře do budovy a hned za nimi dřevěné prosklené lítačky.",
                        action: "Vyjdi schodiště nahoru a projdi oběma dveřmi."
                    }
                },
                "26": {
                    "from": "x", "to": "y",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "Popis budovy E",
                        description: "Jsi v budově E v areálu ČVUT. Počet pater je čtyři. Mnoho zavřených dveří se otevírá pomocí čipové karty, kterou je nutné přiložit ke čtečce karet a po krátkém pípnutí otevřít. V budově je výtah. Vrátnice je po tvé pravé ruce.",
                        action: ""
                    }
                },
                "27": {
                    "from": "y", "to": "z",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "1. úsek z 15",
                        description: "Plošina asi 5 metrů dlouhá. Povrch gumová rohož. Na konci plošiny je přímé schodiště nahoru.",
                        action: "Dojdi ke schodišti na konec plošiny."
                    }
                },
                "28": {
                    "from": "z", "to": "aa",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "2. úsek z 15",
                        description: "Přímé kamenné schodiště. Hned nad schodištěm jsou dřevěné lítačky.",
                        action: "Vyjdi nahoru a projdi dveřmi. Pozor plošina nad schodištěm je velmi krátká."
                    }
                },
                "29": {
                    "from": "aa", "to": "eab1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "30": {
                    "from": "aa", "to": "eab2",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "31": {
                    "from": "aa", "to": "eab3",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "32": {
                    "from": "aa", "to": "ab",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "3. úsek z 15",
                        description: "Plošina hlavního schodiště v přízemí. Povrch dlaždice. Před tebou jsou schody nahoru.",
                        action: "Vyjdi schody nahoru do mezipatra. POZOR, vpravo i vlevo od schodů nahoru jsou schody dolů."
                    }
                },
                "33": {
                    "from": "ab", "to": "eac1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "34": {
                    "from": "ab", "to": "ac",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "4. úsek z 15",
                        description: "Mezipatro schodišťové haly. Před tebou jsou schody nahoru. Vpravo za tebou je zpětné rameno schodiště nahoru.",
                        action: "Otoč se doprava dozadu a vyjdi schodištěm do prvního patra."
                    }
                },
                "35": {
                    "from": "ac", "to": "ead1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "36": {
                    "from": "ac", "to": "ead2",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "37": {
                    "from": "ac", "to": "ad",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "5. úsek z 15",
                        description: "Plošina schodišťové haly v prvním patře. Vlevo jsou dvoukřídlé dveře, vetšinou otevřené.",
                        action: "Otoč se doleva a projdi dveřmi."
                    }
                },
                "38": {
                    "from": "ad", "to": "ae",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "6.úsek z 15",
                        description: "Chodba asi 5 metrů dlouhá. Vlevo jsou schody nahoru.",
                        action: "Otoč se doleva vyjdi schody nahoru do mezipatra."
                    }
                },
                "39": {
                    "from": "ae", "to": "eaf1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "40": {
                    "from": "ae", "to": "af",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "7.úsek z 15",
                        description: "Mezipatro schodišťové haly. Před tebou jsou schody nahoru, vpravo za tebou je zpětné rameno schodiště nahoru.",
                        action: "Vyjdi schody před tebou nahoru do mezipatra."
                    }
                },
                "41": {
                    "from": "ae", "to": "ag",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "8.úsek z 15",
                        description: "Mezipatro schodišťové haly. Vpravo za tebou je schodiště nahoru.",
                        action: "Otoč se doprava a vyjdi schody nahoru do mezipatra."
                    }
                },
                "42": {
                    "from": "ag", "to": "eah1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "43": {
                    "from": "ag", "to": "ah",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "9.úsek z 15",
                        description: "Mezipatro schodišťové haly. Před tebou jsou schody nahoru, Vpravo za tebou je zpětné rameno schodiště nahoru.",
                        action: "Vyjdi schody před tebou nahoru do třetího patra."
                    }
                },
                "44": {
                    "from": "ah", "to": "eai1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "45": {
                    "from": "ah", "to": "ai",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "10.úsek z 15",
                        description: "Jsi na chodbě ve třetím patře. Chodba je dlouhá asi 5 metrů. Vpravo za tebou je zpětné rameno schodiště nahoru. Vlevo jsou dvojkřídlé skleněné dveře.",
                        action: "Otoč se doleva a dojdi ke dveřím."
                    }
                },
                "46": {
                    "from": "ai", "to": "eai1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                },
                "47": {
                    "from": "ai", "to": "aj",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "11.úsek z 15",
                        description: "Dveře se otvírají na kartu. Čtečka je vpravo od dveří.",
                        action: "Projdi dveřmi."
                    }
                },
                "48": {
                    "from": "aj", "to": "ak",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "12.úsek z 15",
                        description: "Chodba asi 30 metrů dlouhá na konci zalomená doleva. Vpravo jsou dveře do kanceláří, vlevo jsou okna.",
                        action: "Drž se vpravo a dojdi na konec chodby až k zalomení. POZOR po levé ruce jsou květiny v úrovni očí."
                    }
                },
                "49": {
                    "from": "ak", "to": "al",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "13.úsek z 15",
                        description: "Jsi u zalomení chodby doleva. Vlevo jsou dveře většinou otevřené a následuje chodba. Po levé straně jsou dveře do učeben a výklenek.",
                        action: "Otoč se doleva a jdi asi 8 metrů ke dveřím většinou otevřeným."
                    }
                },
                "50": {
                    "from": "al", "to": "am",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "14.úsek z 15",
                        description: "Dřevěné dvoukřídlé dveře, většinou otevřené. Následuje chodba asi 7 metrů dlouhá. Vlevo jsou dveře do místností.",
                        action: "Projdi dveřmi a odpočítej první dveře po levé ruce."
                    }
                },
                "51": {
                    "from": "am", "to": "an",
                    isOnRoute: true,
                    "data": {
                        segmentNumber: "15.úsek z 15",
                        description: "Dveře do místnosti 319.",
                        action: "Jsi v cíli."
                    }
                },
                "52": {
                    "from": "ai", "to": "eaj1",
                    isOnRoute: false,
                    "data": {
                        segmentNumber: "",
                        description: "",
                        action: ""
                    }
                }

            }

        }

        this.routeBeacons = {
            "U4tv": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 42123, minor: 49791, rssiTrigger: -80, rssiArray: [] },
            "KfLr": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 59761, minor: 10752, rssiTrigger: -100, rssiArray: [] },
            "6pDr": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 12196, minor: 27432, rssiTrigger: -85, rssiArray: [] },
            "6bUB": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 64049, minor: 65232, rssiTrigger: -75, rssiArray: [] },
            "Lto1": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 48587, minor: 51204, rssiTrigger: -80, rssiArray: [] },
            "m46J": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 46864, minor: 40873, rssiTrigger: -80, rssiArray: [] },
            "2LxK": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 36798, minor: 31395, rssiTrigger: -90, rssiArray: [] },
            "ulWB": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 12943, minor: 40394, rssiTrigger: -80, rssiArray: [] },
            "BGNA": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 38913, minor: 52322, rssiTrigger: -80, rssiArray: [] },
            "S8Nn": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 53001, minor: 10385, rssiTrigger: -80, rssiArray: [] },
            "xTni": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 680, minor: 24994, rssiTrigger: -80, rssiArray: [] },
            "dwR7": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 32536, minor: 58292, rssiTrigger: -80, rssiArray: [] },
            "2Y5M": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 2000, minor: 201, rssiTrigger: -80, rssiArray: [] },
            "yODr": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 5719, minor: 48569, rssiTrigger: -80, rssiArray: [] },
            "y4Wl": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 2000, minor: 202, rssiTrigger: -80, rssiArray: [] },
            "bz7E": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 17116, minor: 60729, rssiTrigger: -80, rssiArray: [] },

            "kDaJ": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 26530, minor: 43364, rssiTrigger: -85, rssiArray: [] },
            "U6ne": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 36926, minor: 26828, rssiTrigger: -85, rssiArray: [] },
            "0DIb": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 54785, minor: 31317, rssiTrigger: -80, rssiArray: [] },
            "wapV": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 21389, minor: 581, rssiTrigger: -80, rssiArray: [] },
            "1cZi": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 21476, minor: 5427, rssiTrigger: -85, rssiArray: [] },
            "jd2h": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 3843, minor: 21525, rssiTrigger: -80, rssiArray: [] },
            "ajes": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 16124, minor: 19363, rssiTrigger: -80, rssiArray: [] },
            "uTlg": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 33340, minor: 34828, rssiTrigger: -85, rssiArray: [] },
            "gwIq": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 999, minor: 100, rssiTrigger: -80, rssiArray: [] },
            "6ezy": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 51439, minor: 40631, rssiTrigger: -80, rssiArray: [] },
            "1Ydz": { uuid: "f7826da6-4fa2-4e98-8024-bc5b71e0893e", major: 59862, minor: 25684, rssiTrigger: -80, rssiArray: [] }
        }
        this.actualNode = this.routeGraph.startNode;
        this.actualDescription = this.routeGraph.routeDescription;
        this.history = [];
        this.errorBeacons = [];
        this.didNotificate = false;
        this.didNotificateError = false;
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
        this.didNotificateError = false;
        var outEdges = this.routeGraph.adjacency[this.actualNode];
        if (outEdges.length > 0) { // if we are not in final segment, i.e. no edges go out from node
            this.history.push({ node: this.actualNode, description: this.actualDescription, segmentNumber: this.segmentNumber, errorBeacons: this.errorBeacons, actualID: this.actualID });
        }
        this.errorBeacons = [];

        outEdges.forEach(edgeID => {
            var edge = this.routeGraph.edges[edgeID];
            console.log(edge);
            if (edge.isOnRoute) {
                this.actualDescription = edge.data.description + edge.data.action;
                this.actualNode = edge.to;
                this.segmentNumber = edge.data.segmentNumber;
                this.actualID = this.routeGraph.nodes[this.actualNode].beaconID;
                console.log(this.actualID);

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
                    beacon.major == this.routeBeacons[this.actualID].major && !this.didNotificate) {
                    console.log(beacon.major,beacon.minor,beacon.rssi);
                    this.routeBeacons[this.actualID].rssiArray.push(beacon.rssi);
                }
            }
        });

        this.filterErrorBeacons(data.beacons);
        if(!this.didNotificateError){
            this.checkErrorBeacons();
        }
        
        if (!this.didNotificate) {
            if(this.routeBeacons[this.actualID] != undefined){
                this.checkCorrectBeacon();
            }
            
        }


    }

    filterErrorBeacons(beacons) {

        beacons.map((beacon) => {
            for (let index = 0; index < this.errorBeacons.length; index++) {
                if (beacon.minor == this.errorBeacons[index].minor && beacon.major == this.errorBeacons[index].major && !this.didNotificateError) {
                    this.errorBeacons[index].rssiArray.push(beacon.rssi);
                    console.log(beacon.major, beacon.minor, beacon.rssi);

                }
            }
        });
    }

    checkErrorBeacons() {
        this.errorBeacons.forEach(beacon => {
            if (beacon.rssiArray.length == 2) {
                //beacon.rssiArray.sort((a, b) => a - b);
                //let median = beacon.rssiArray[1];
                let avg = (beacon.rssiArray[0] + beacon.rssiArray[1]) / 2;
                if (avg > beacon.rssiTrigger) {
                    console.log(avg, " > ", beacon.rssiTrigger);
                    this.vibration.vibrate([100, 100, 100]);
                    this.mobileAccessibility.speak("Jsi na špatné cestě, vrať se zpět na začátek úseku", 1);
                    this.didNotificateError = true;
                }
                beacon.rssiArray = [];
            }
        });
    }

    checkCorrectBeacon() {
        let beacon = this.routeBeacons[this.actualID];
        //console.log("correctBeacon",beacon);
        if (beacon.rssiArray.length == 2) {
            //beacon.rssiArray.sort((a, b) => a - b);
            //let median = beacon.rssiArray[1];
            let avg = (beacon.rssiArray[0] + beacon.rssiArray[1]) / 2;
            if (avg > beacon.rssiTrigger) {
                console.log(avg, " > ", beacon.rssiTrigger);
                this.vibration.vibrate([100, 100, 100]);
                this.mobileAccessibility.speak("Jsi blízko konce tohoto úseku", 1);
                this.didNotificate = true;
            }
            this.routeBeacons[this.actualID].rssiArray = [];
        }

    }

}