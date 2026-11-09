import type { HistoryRecord } from '../shared/types';

/**
 * Built-in giveaway, subscription, and bundle history archive.
 * Contains 1443 verified records across Epic Games Store (2018–2026),
 * Amazon Prime Gaming, GOG, Steam Free-to-Keep, Humble Choice (2018–2026),
 * Humble Bundles, Fanatical Bundles, Xbox Game Pass, and PlayStation Plus Extra.
 *
 * Automatically augmented at runtime by:
 *  1. GitHub Auto-Updated Feed (raw.githubusercontent.com/josephmate/EpicFreeGamesList)
 *  2. Epic Games Store Live Promotions API
 *  3. GamerPower Live Multi-Store Giveaways API (Steam, GOG, Prime, Epic, Humble)
 */
export const SEED_HISTORY: HistoryRecord[] = JSON.parse(String.raw`[
  {
    "title": "Subnautica",
    "service": "epic",
    "start": "2018-12-14",
    "steamAppId": 264710
  },
  {
    "title": "Super Meat Boy",
    "service": "epic",
    "start": "2018-12-28",
    "steamAppId": 40800
  },
  {
    "title": "What Remains of Edith Finch",
    "service": "epic",
    "start": "2019-01-10",
    "steamAppId": 501300
  },
  {
    "title": "The Jackbox Party Pack",
    "service": "epic",
    "start": "2019-01-24",
    "steamAppId": 331670
  },
  {
    "title": "Axiom Verge",
    "service": "epic",
    "start": "2019-02-07",
    "steamAppId": 332200
  },
  {
    "title": "Thimbleweed Park",
    "service": "epic",
    "start": "2019-02-21",
    "steamAppId": 569860
  },
  {
    "title": "Slime Rancher",
    "service": "epic",
    "start": "2019-03-07",
    "steamAppId": 433340
  },
  {
    "title": "Oxenfree",
    "service": "epic",
    "start": "2019-03-21",
    "steamAppId": 388880
  },
  {
    "title": "The Witness",
    "service": "epic",
    "start": "2019-04-04",
    "steamAppId": 210970
  },
  {
    "title": "Transistor",
    "service": "epic",
    "start": "2019-04-18",
    "steamAppId": 237930
  },
  {
    "title": "World of Goo",
    "service": "epic",
    "start": "2019-05-02",
    "steamAppId": 22000
  },
  {
    "title": "Stories Untold",
    "service": "epic",
    "start": "2019-05-16",
    "steamAppId": 558420
  },
  {
    "title": "RiME",
    "service": "epic",
    "start": "2019-05-23",
    "steamAppId": 493200
  },
  {
    "title": "City of Brass",
    "service": "epic",
    "start": "2019-05-30",
    "steamAppId": 301840
  },
  {
    "title": "Kingdom New Lands",
    "service": "epic",
    "start": "2019-06-06",
    "steamAppId": 496300
  },
  {
    "title": "Enter the Gungeon",
    "service": "epic",
    "start": "2019-06-13",
    "steamAppId": 311690
  },
  {
    "title": "Rebel Galaxy",
    "service": "epic",
    "start": "2019-06-20",
    "steamAppId": 290300
  },
  {
    "title": "Last Day of June",
    "service": "epic",
    "start": "2019-06-27",
    "steamAppId": 635320
  },
  {
    "title": "Overcooked",
    "service": "epic",
    "start": "2019-07-04",
    "steamAppId": 448510
  },
  {
    "title": "Torchlight",
    "service": "epic",
    "start": "2019-07-11",
    "steamAppId": 41500
  },
  {
    "title": "Limbo",
    "service": "epic",
    "start": "2019-07-18",
    "steamAppId": 48000
  },
  {
    "title": "This War of Mine",
    "service": "epic",
    "start": "2019-07-25",
    "steamAppId": 282070
  },
  {
    "title": "Moonlighter",
    "service": "epic",
    "start": "2019-07-25",
    "steamAppId": 606150
  },
  {
    "title": "For Honor",
    "service": "epic",
    "start": "2019-08-02",
    "steamAppId": 304390
  },
  {
    "title": "Alan Wake",
    "service": "epic",
    "start": "2019-08-02",
    "steamAppId": 108710
  },
  {
    "title": "Gnog",
    "service": "epic",
    "start": "2019-08-08",
    "steamAppId": 290510
  },
  {
    "title": "Mutant Year Zero: Road to Eden",
    "service": "epic",
    "start": "2019-08-15",
    "steamAppId": 760060
  },
  {
    "title": "Hyper Light Drifter",
    "service": "epic",
    "start": "2019-08-15",
    "steamAppId": 257850
  },
  {
    "title": "Fez",
    "service": "epic",
    "start": "2019-08-22",
    "steamAppId": 224760
  },
  {
    "title": "Inside",
    "service": "epic",
    "start": "2019-08-29",
    "steamAppId": 304430
  },
  {
    "title": "Celeste",
    "service": "epic",
    "start": "2019-08-29",
    "steamAppId": 504230
  },
  {
    "title": "The End is Nigh",
    "service": "epic",
    "start": "2019-09-05",
    "steamAppId": 583470
  },
  {
    "title": "Abzû",
    "service": "epic",
    "start": "2019-09-05",
    "steamAppId": 384190
  },
  {
    "title": "Conarium",
    "service": "epic",
    "start": "2019-09-12",
    "steamAppId": 313780
  },
  {
    "title": "LEGO Batman: The Videogame",
    "service": "epic",
    "start": "2019-09-19",
    "steamAppId": 21000
  },
  {
    "title": "LEGO Batman 3: Beyond Gotham",
    "service": "epic",
    "start": "2019-09-19",
    "steamAppId": 313690
  },
  {
    "title": "LEGO Batman 2: DC Super Heroes",
    "service": "epic",
    "start": "2019-09-19",
    "steamAppId": 213330
  },
  {
    "title": "Batman: Arkham Knight",
    "service": "epic",
    "start": "2019-09-19",
    "steamAppId": 208650
  },
  {
    "title": "Batman: Arkham City Game of the Year Edition",
    "service": "epic",
    "start": "2019-09-19",
    "steamAppId": 200260
  },
  {
    "title": "Batman: Arkham Asylum Game of the Year Edition",
    "service": "epic",
    "start": "2019-09-19",
    "steamAppId": 35140
  },
  {
    "title": "Metro 2033 Redux",
    "service": "epic",
    "start": "2019-09-26",
    "steamAppId": 286690
  },
  {
    "title": "Everything",
    "service": "epic",
    "start": "2019-09-26",
    "steamAppId": 582270
  },
  {
    "title": "Minit",
    "service": "epic",
    "start": "2019-10-03",
    "steamAppId": 609490
  },
  {
    "title": "Surviving Mars",
    "service": "epic",
    "start": "2019-10-10",
    "steamAppId": 3558730
  },
  {
    "title": "Observer",
    "service": "epic",
    "start": "2019-10-17",
    "steamAppId": 514900
  },
  {
    "title": "Alan Wake's American Nightmare",
    "service": "epic",
    "start": "2019-10-17",
    "steamAppId": 202750
  },
  {
    "title": "Q.U.B.E. 2",
    "service": "epic",
    "start": "2019-10-24",
    "steamAppId": 359100
  },
  {
    "title": "Layers of Fear: Masterpiece Edition",
    "service": "epic",
    "start": "2019-10-24"
  },
  {
    "title": "Soma",
    "service": "epic",
    "start": "2019-10-31",
    "steamAppId": 282140
  },
  {
    "title": "Costume Quest",
    "service": "epic",
    "start": "2019-10-31",
    "steamAppId": 115100
  },
  {
    "title": "Ruiner",
    "service": "epic",
    "start": "2019-11-07",
    "steamAppId": 464060
  },
  {
    "title": "Nuclear Throne",
    "service": "epic",
    "start": "2019-11-07",
    "steamAppId": 242680
  },
  {
    "title": "The Messenger",
    "service": "epic",
    "start": "2019-11-14",
    "steamAppId": 764790
  },
  {
    "title": "Bad North: Jotunn Edition",
    "service": "epic",
    "start": "2019-11-21",
    "steamAppId": 688420
  },
  {
    "title": "Rayman Legends",
    "service": "epic",
    "start": "2019-11-29",
    "steamAppId": 242550
  },
  {
    "title": "Jotun: Valhalla Edition",
    "service": "epic",
    "start": "2019-12-05",
    "steamAppId": 323580
  },
  {
    "title": "The Wolf Among Us",
    "service": "epic",
    "start": "2019-12-12",
    "steamAppId": 250320
  },
  {
    "title": "The Escapists",
    "service": "epic",
    "start": "2019-12-12",
    "steamAppId": 298630
  },
  {
    "title": "Into the Breach",
    "service": "epic",
    "start": "2019-12-19",
    "steamAppId": 590380
  },
  {
    "title": "TowerFall Ascension",
    "service": "epic",
    "start": "2019-12-20"
  },
  {
    "title": "Superhot",
    "service": "epic",
    "start": "2019-12-21",
    "steamAppId": 322500
  },
  {
    "title": "Little Inferno",
    "service": "epic",
    "start": "2019-12-22",
    "steamAppId": 221260
  },
  {
    "title": "Ape Out",
    "service": "epic",
    "start": "2019-12-23",
    "steamAppId": 447150
  },
  {
    "title": "Celeste",
    "service": "epic",
    "start": "2019-12-24",
    "steamAppId": 504230
  },
  {
    "title": "Totally Accurate Battle Simulator",
    "service": "epic",
    "start": "2019-12-25",
    "steamAppId": 508440
  },
  {
    "title": "Faster Than Light",
    "service": "epic",
    "start": "2019-12-26",
    "steamAppId": 212680
  },
  {
    "title": "Hyper Light Drifter",
    "service": "epic",
    "start": "2019-12-27",
    "steamAppId": 257850
  },
  {
    "title": "Shadow Tactics: Blades of the Shogun",
    "service": "epic",
    "start": "2019-12-28",
    "steamAppId": 418240
  },
  {
    "title": "The Talos Principle",
    "service": "epic",
    "start": "2019-12-29",
    "steamAppId": 257510
  },
  {
    "title": "Hello Neighbor",
    "service": "epic",
    "start": "2019-12-30",
    "steamAppId": 521890
  },
  {
    "title": "Yooka-Laylee and the Impossible Lair",
    "service": "epic",
    "start": "2019-12-31",
    "steamAppId": 846870
  },
  {
    "title": "Steep",
    "service": "epic",
    "start": "2020-01-01",
    "steamAppId": 460920
  },
  {
    "title": "Darksiders: Warmastered Edition",
    "service": "epic",
    "start": "2020-01-01",
    "steamAppId": 462780
  },
  {
    "title": "Darksiders II: Deathinitive Edition",
    "service": "epic",
    "start": "2020-01-01",
    "steamAppId": 388410
  },
  {
    "title": "Sundered: Eldritch Edition",
    "service": "epic",
    "start": "2020-01-09",
    "steamAppId": 535480
  },
  {
    "title": "Horace",
    "service": "epic",
    "start": "2020-01-16",
    "steamAppId": 629090
  },
  {
    "title": "The Bridge",
    "service": "epic",
    "start": "2020-01-23",
    "steamAppId": 204240
  },
  {
    "title": "Farming Simulator 19",
    "service": "epic",
    "start": "2020-01-30",
    "steamAppId": 787860
  },
  {
    "title": "Ticket to Ride",
    "service": "epic",
    "start": "2020-02-06",
    "steamAppId": 2477010
  },
  {
    "title": "Carcassonne",
    "service": "epic",
    "start": "2020-02-06",
    "steamAppId": 648730
  },
  {
    "title": "Kingdom Come: Deliverance",
    "service": "epic",
    "start": "2020-02-13",
    "steamAppId": 379430
  },
  {
    "title": "Aztez",
    "service": "epic",
    "start": "2020-02-13",
    "steamAppId": 244750
  },
  {
    "title": "Faeria",
    "service": "epic",
    "start": "2020-02-20",
    "steamAppId": 397060
  },
  {
    "title": "Assassin's Creed Syndicate",
    "service": "epic",
    "start": "2020-02-20",
    "steamAppId": 368500
  },
  {
    "title": "InnerSpace",
    "service": "epic",
    "start": "2020-02-27",
    "steamAppId": 347000
  },
  {
    "title": "Offworld Trading Company",
    "service": "epic",
    "start": "2020-03-05",
    "steamAppId": 271240
  },
  {
    "title": "Gonner",
    "service": "epic",
    "start": "2020-03-05",
    "steamAppId": 437570
  },
  {
    "title": "Mutazione",
    "service": "epic",
    "start": "2020-03-12",
    "steamAppId": 1080750
  },
  {
    "title": "Anodyne 2: Return to Dust",
    "service": "epic",
    "start": "2020-03-12",
    "steamAppId": 877810
  },
  {
    "title": "A Short Hike",
    "service": "epic",
    "start": "2020-03-12",
    "steamAppId": 1055540
  },
  {
    "title": "Watch Dogs",
    "service": "epic",
    "start": "2020-03-19",
    "steamAppId": 243470
  },
  {
    "title": "The Stanley Parable",
    "service": "epic",
    "start": "2020-03-19",
    "steamAppId": 221910
  },
  {
    "title": "World War Z",
    "service": "epic",
    "start": "2020-03-26",
    "steamAppId": 699130
  },
  {
    "title": "Tormentor X Punisher",
    "service": "epic",
    "start": "2020-03-26"
  },
  {
    "title": "Figment",
    "service": "epic",
    "start": "2020-03-26",
    "steamAppId": 493540
  },
  {
    "title": "Totally Reliable Delivery Service",
    "service": "epic",
    "start": "2020-04-01",
    "steamAppId": 1011670
  },
  {
    "title": "Hob",
    "service": "epic",
    "start": "2020-04-02",
    "steamAppId": 404680
  },
  {
    "title": "Gone Home",
    "service": "epic",
    "start": "2020-04-02",
    "steamAppId": 232430
  },
  {
    "title": "Drawful 2",
    "service": "epic",
    "start": "2020-04-02",
    "steamAppId": 442070
  },
  {
    "title": "Sherlock Holmes: Crimes & Punishments",
    "service": "epic",
    "start": "2020-04-09",
    "steamAppId": 241260
  },
  {
    "title": "Close to the Sun",
    "service": "epic",
    "start": "2020-04-09",
    "steamAppId": 968870
  },
  {
    "title": "Wheels of Aurelia",
    "service": "epic",
    "start": "2020-04-16",
    "steamAppId": 508740
  },
  {
    "title": "Just Cause 4",
    "service": "epic",
    "start": "2020-04-16",
    "steamAppId": 517630
  },
  {
    "title": "For the King",
    "service": "epic",
    "start": "2020-04-23",
    "steamAppId": 527230
  },
  {
    "title": "Crashlands",
    "service": "epic",
    "start": "2020-04-30",
    "steamAppId": 391730
  },
  {
    "title": "Amnesia: The Dark Descent",
    "service": "epic",
    "start": "2020-04-30",
    "steamAppId": 57300
  },
  {
    "title": "Death Coming",
    "service": "epic",
    "start": "2020-05-07",
    "steamAppId": 705120
  },
  {
    "title": "Grand Theft Auto V",
    "service": "epic",
    "start": "2020-05-14",
    "steamAppId": 3240220
  },
  {
    "title": "Sid Meier's Civilization VI",
    "service": "epic",
    "start": "2020-05-21",
    "steamAppId": 1295660
  },
  {
    "title": "Borderlands: The Pre-Sequel",
    "service": "epic",
    "start": "2020-05-28",
    "steamAppId": 261640
  },
  {
    "title": "Borderlands 2",
    "service": "epic",
    "start": "2020-05-28",
    "steamAppId": 49520
  },
  {
    "title": "Overcooked",
    "service": "epic",
    "start": "2020-06-04",
    "steamAppId": 448510
  },
  {
    "title": "Samurai Shodown NeoGeo Collection",
    "service": "epic",
    "start": "2020-06-11",
    "steamAppId": 999660
  },
  {
    "title": "Ark: Survival Evolved",
    "service": "epic",
    "start": "2020-06-11",
    "steamAppId": 346110
  },
  {
    "title": "Pathway",
    "service": "epic",
    "start": "2020-06-18",
    "steamAppId": 546430
  },
  {
    "title": "Stranger Things 3: The Game",
    "service": "epic",
    "start": "2020-06-25"
  },
  {
    "title": "AER: Memories of Old",
    "service": "epic",
    "start": "2020-06-25",
    "steamAppId": 331870
  },
  {
    "title": "Hue",
    "service": "epic",
    "start": "2020-07-02",
    "steamAppId": 383270
  },
  {
    "title": "The Escapists 2",
    "service": "epic",
    "start": "2020-07-09",
    "steamAppId": 641990
  },
  {
    "title": "Lifeless Planet: Premier Edition",
    "service": "epic",
    "start": "2020-07-09",
    "steamAppId": 261530
  },
  {
    "title": "Killing Floor 2",
    "service": "epic",
    "start": "2020-07-09",
    "steamAppId": 232090
  },
  {
    "title": "Torchlight II",
    "service": "epic",
    "start": "2020-07-16",
    "steamAppId": 200710
  },
  {
    "title": "Tacoma",
    "service": "epic",
    "start": "2020-07-23",
    "steamAppId": 343860
  },
  {
    "title": "Next Up Hero",
    "service": "epic",
    "start": "2020-07-23",
    "steamAppId": 667810
  },
  {
    "title": "Superbrothers: Sword & Sworcery EP",
    "service": "epic",
    "start": "2020-07-30",
    "steamAppId": 204060
  },
  {
    "title": "Barony",
    "service": "epic",
    "start": "2020-07-30",
    "steamAppId": 371970
  },
  {
    "title": "20XX",
    "service": "epic",
    "start": "2020-07-30",
    "steamAppId": 322110
  },
  {
    "title": "Wilmot's Warehouse",
    "service": "epic",
    "start": "2020-08-06",
    "steamAppId": 839870
  },
  {
    "title": "3 out of 10",
    "service": "epic",
    "start": "2020-08-06"
  },
  {
    "title": "The Alto Collection",
    "service": "epic",
    "start": "2020-08-13",
    "steamAppId": 2837600
  },
  {
    "title": "Remnant: From the Ashes",
    "service": "epic",
    "start": "2020-08-13",
    "steamAppId": 617290
  },
  {
    "title": "God's Trigger",
    "service": "epic",
    "start": "2020-08-20",
    "steamAppId": 488730
  },
  {
    "title": "Enter the Gungeon",
    "service": "epic",
    "start": "2020-08-20",
    "steamAppId": 311690
  },
  {
    "title": "Shadowrun Collection",
    "service": "epic",
    "start": "2020-08-27"
  },
  {
    "title": "Hitman",
    "service": "epic",
    "start": "2020-08-27",
    "steamAppId": 247430
  },
  {
    "title": "Into the Breach",
    "service": "epic",
    "start": "2020-09-03",
    "steamAppId": 590380
  },
  {
    "title": "Where the Water Tastes Like Wine",
    "service": "epic",
    "start": "2020-09-10",
    "steamAppId": 447120
  },
  {
    "title": "Railway Empire",
    "service": "epic",
    "start": "2020-09-10",
    "steamAppId": 503940
  },
  {
    "title": "Watch Dogs 2",
    "service": "epic",
    "start": "2020-09-17",
    "steamAppId": 447040
  },
  {
    "title": "Stick it to the Man!",
    "service": "epic",
    "start": "2020-09-17",
    "steamAppId": 251830
  },
  {
    "title": "Football Manager 2020",
    "service": "epic",
    "start": "2020-09-17",
    "steamAppId": 1100750
  },
  {
    "title": "RollerCoaster Tycoon 3: Complete Edition",
    "service": "epic",
    "start": "2020-09-24"
  },
  {
    "title": "Pikuniku",
    "service": "epic",
    "start": "2020-10-01",
    "steamAppId": 572890
  },
  {
    "title": "Rising Storm 2: Vietnam",
    "service": "epic",
    "start": "2020-10-08",
    "steamAppId": 418460
  },
  {
    "title": "Abzû",
    "service": "epic",
    "start": "2020-10-08",
    "steamAppId": 384190
  },
  {
    "title": "Kingdom: New Lands",
    "service": "epic",
    "start": "2020-10-15",
    "steamAppId": 496300
  },
  {
    "title": "Amnesia: A Machine for Pigs",
    "service": "epic",
    "start": "2020-10-15",
    "steamAppId": 239200
  },
  {
    "title": "Layers of Fear 2",
    "service": "epic",
    "start": "2020-10-22",
    "steamAppId": 1029890
  },
  {
    "title": "Costume Quest 2",
    "service": "epic",
    "start": "2020-10-22",
    "steamAppId": 275180
  },
  {
    "title": "Ghostbusters: The Video Game Remastered",
    "service": "epic",
    "start": "2020-10-29",
    "steamAppId": 1449280
  },
  {
    "title": "Blair Witch",
    "service": "epic",
    "start": "2020-10-29",
    "steamAppId": 1092660
  },
  {
    "title": "Dungeons 3",
    "service": "epic",
    "start": "2020-11-05",
    "steamAppId": 493900
  },
  {
    "title": "The Textorcist: The Story of Ray Bibbia",
    "service": "epic",
    "start": "2020-11-12",
    "steamAppId": 940680
  },
  {
    "title": "The World Next Door",
    "service": "epic",
    "start": "2020-11-19",
    "steamAppId": 755470
  },
  {
    "title": "Elite: Dangerous",
    "service": "epic",
    "start": "2020-11-19",
    "steamAppId": 359320
  },
  {
    "title": "MudRunner",
    "service": "epic",
    "start": "2020-11-26",
    "steamAppId": 675010
  },
  {
    "title": "Cave Story+",
    "service": "epic",
    "start": "2020-12-03",
    "steamAppId": 200900
  },
  {
    "title": "Tyranny - Gold Edition",
    "service": "epic",
    "start": "2020-12-10"
  },
  {
    "title": "Pillars of Eternity: Definitive Edition",
    "service": "epic",
    "start": "2020-12-10"
  },
  {
    "title": "Cities: Skylines",
    "service": "epic",
    "start": "2020-12-17",
    "steamAppId": 255710
  },
  {
    "title": "Oddworld: New 'n' Tasty!",
    "service": "epic",
    "start": "2020-12-18",
    "steamAppId": 314660
  },
  {
    "title": "The Long Dark",
    "service": "epic",
    "start": "2020-12-19",
    "steamAppId": 305620
  },
  {
    "title": "Defense Grid: The Awakening",
    "service": "epic",
    "start": "2020-12-20",
    "steamAppId": 18500
  },
  {
    "title": "Alien: Isolation",
    "service": "epic",
    "start": "2020-12-21",
    "steamAppId": 214490
  },
  {
    "title": "Metro 2033 Redux",
    "service": "epic",
    "start": "2020-12-22",
    "steamAppId": 286690
  },
  {
    "title": "Tropico 5",
    "service": "epic",
    "start": "2020-12-23",
    "steamAppId": 245620
  },
  {
    "title": "Inside",
    "service": "epic",
    "start": "2020-12-24",
    "steamAppId": 304430
  },
  {
    "title": "Darkest Dungeon",
    "service": "epic",
    "start": "2020-12-25",
    "steamAppId": 262060
  },
  {
    "title": "My Time at Portia",
    "service": "epic",
    "start": "2020-12-26",
    "steamAppId": 666140
  },
  {
    "title": "Night in the Woods",
    "service": "epic",
    "start": "2020-12-27",
    "steamAppId": 481510
  },
  {
    "title": "Stranded Deep",
    "service": "epic",
    "start": "2020-12-28",
    "steamAppId": 313120
  },
  {
    "title": "Solitairica",
    "service": "epic",
    "start": "2020-12-29",
    "steamAppId": 463980
  },
  {
    "title": "Torchlight II",
    "service": "epic",
    "start": "2020-12-30",
    "steamAppId": 200710
  },
  {
    "title": "Jurassic World Evolution",
    "service": "epic",
    "start": "2020-12-31",
    "steamAppId": 648350
  },
  {
    "title": "Crying Suns",
    "service": "epic",
    "start": "2021-01-07",
    "steamAppId": 873940
  },
  {
    "title": "Star Wars Battlefront II: Celebration Edition",
    "service": "epic",
    "start": "2021-01-14"
  },
  {
    "title": "Galactic Civilizations III",
    "service": "epic",
    "start": "2021-01-21",
    "steamAppId": 226860
  },
  {
    "title": "Dandara: Trials of Fear Edition",
    "service": "epic",
    "start": "2021-01-28",
    "steamAppId": 612390
  },
  {
    "title": "Metro: Last Light Redux",
    "service": "epic",
    "start": "2021-02-04",
    "steamAppId": 287390
  },
  {
    "title": "For the King",
    "service": "epic",
    "start": "2021-02-04",
    "steamAppId": 527230
  },
  {
    "title": "Halcyon 6: Lightspeed Edition",
    "service": "epic",
    "start": "2021-02-11",
    "steamAppId": 706910
  },
  {
    "title": "Rage 2",
    "service": "epic",
    "start": "2021-02-18",
    "steamAppId": 548570
  },
  {
    "title": "Absolute Drift",
    "service": "epic",
    "start": "2021-02-18",
    "steamAppId": 320140
  },
  {
    "title": "Sunless Sea",
    "service": "epic",
    "start": "2021-02-25",
    "steamAppId": 304650
  },
  {
    "title": "Wargame: Red Dragon",
    "service": "epic",
    "start": "2021-03-04",
    "steamAppId": 251060
  },
  {
    "title": "Surviving Mars",
    "service": "epic",
    "start": "2021-03-11",
    "steamAppId": 3558730
  },
  {
    "title": "The Fall",
    "service": "epic",
    "start": "2021-03-18",
    "steamAppId": 290770
  },
  {
    "title": "Creature in the Well",
    "service": "epic",
    "start": "2021-03-25",
    "steamAppId": 852300
  },
  {
    "title": "Tales of the Neon Sea",
    "service": "epic",
    "start": "2021-04-01",
    "steamAppId": 828740
  },
  {
    "title": "3 Out of 10: Season Two",
    "service": "epic",
    "start": "2021-04-08"
  },
  {
    "title": "The First Tree",
    "service": "epic",
    "start": "2021-04-15",
    "steamAppId": 555150
  },
  {
    "title": "Ken Follett's The Pillars of the Earth",
    "service": "epic",
    "start": "2021-04-15",
    "steamAppId": 234270
  },
  {
    "title": "Deponia: The Complete Journey",
    "service": "epic",
    "start": "2021-04-15",
    "steamAppId": 292910
  },
  {
    "title": "Hand of Fate 2",
    "service": "epic",
    "start": "2021-04-22",
    "steamAppId": 456670
  },
  {
    "title": "Alien: Isolation",
    "service": "epic",
    "start": "2021-04-22",
    "steamAppId": 214490
  },
  {
    "title": "Idle Champions of the Forgotten Realms",
    "service": "epic",
    "start": "2021-04-29",
    "steamAppId": 627690
  },
  {
    "title": "Pine",
    "service": "epic",
    "start": "2021-05-06",
    "steamAppId": 2718240
  },
  {
    "title": "The Lion's Song",
    "service": "epic",
    "start": "2021-05-13",
    "steamAppId": 774871
  },
  {
    "title": "NBA 2K21",
    "service": "epic",
    "start": "2021-05-20"
  },
  {
    "title": "Among Us",
    "service": "epic",
    "start": "2021-05-27",
    "steamAppId": 945360
  },
  {
    "title": "Frostpunk",
    "service": "epic",
    "start": "2021-06-03",
    "steamAppId": 323190
  },
  {
    "title": "Genshin Impact",
    "service": "epic",
    "start": "2021-06-10"
  },
  {
    "title": "Control",
    "service": "epic",
    "start": "2021-06-10",
    "steamAppId": 4253280
  },
  {
    "title": "Overcooked! 2",
    "service": "epic",
    "start": "2021-06-17",
    "steamAppId": 728880
  },
  {
    "title": "Hell Is Other Demons",
    "service": "epic",
    "start": "2021-06-17",
    "steamAppId": 595790
  },
  {
    "title": "Sonic Mania",
    "service": "epic",
    "start": "2021-06-24",
    "steamAppId": 584400
  },
  {
    "title": "Horizon Chase Turbo",
    "service": "epic",
    "start": "2021-06-24",
    "steamAppId": 389140
  },
  {
    "title": "The Spectrum Retreat",
    "service": "epic",
    "start": "2021-07-01",
    "steamAppId": 763250
  },
  {
    "title": "Ironcast",
    "service": "epic",
    "start": "2021-07-08",
    "steamAppId": 327670
  },
  {
    "title": "Bridge Constructor: The Walking Dead",
    "service": "epic",
    "start": "2021-07-08",
    "steamAppId": 1336120
  },
  {
    "title": "Offworld Trading Company",
    "service": "epic",
    "start": "2021-07-15",
    "steamAppId": 271240
  },
  {
    "title": "Obduction",
    "service": "epic",
    "start": "2021-07-15",
    "steamAppId": 306760
  },
  {
    "title": "Verdun",
    "service": "epic",
    "start": "2021-07-22",
    "steamAppId": 242860
  },
  {
    "title": "Defense Grid: The Awakening",
    "service": "epic",
    "start": "2021-07-22",
    "steamAppId": 18500
  },
  {
    "title": "Train Sim World 2",
    "service": "epic",
    "start": "2021-07-29",
    "steamAppId": 1282590
  },
  {
    "title": "Mothergunship",
    "service": "epic",
    "start": "2021-07-29",
    "steamAppId": 574090
  },
  {
    "title": "Speed Brawl",
    "service": "epic",
    "start": "2021-08-05",
    "steamAppId": 468670
  },
  {
    "title": "A Plague Tale: Innocence",
    "service": "epic",
    "start": "2021-08-05",
    "steamAppId": 752590
  },
  {
    "title": "Rebel Galaxy",
    "service": "epic",
    "start": "2021-08-12",
    "steamAppId": 290300
  },
  {
    "title": "Yooka-Laylee",
    "service": "epic",
    "start": "2021-08-19",
    "steamAppId": 360830
  },
  {
    "title": "Void Bastards",
    "service": "epic",
    "start": "2021-08-19",
    "steamAppId": 857980
  },
  {
    "title": "Automachef",
    "service": "epic",
    "start": "2021-08-26",
    "steamAppId": 984800
  },
  {
    "title": "Yoku's Island Express",
    "service": "epic",
    "start": "2021-09-02",
    "steamAppId": 334940
  },
  {
    "title": "Sheltered",
    "service": "epic",
    "start": "2021-09-09",
    "steamAppId": 356040
  },
  {
    "title": "Tharsis",
    "service": "epic",
    "start": "2021-09-16",
    "steamAppId": 323060
  },
  {
    "title": "Speed Brawl",
    "service": "epic",
    "start": "2021-09-16",
    "steamAppId": 468670
  },
  {
    "title": "The Escapists",
    "service": "epic",
    "start": "2021-09-23",
    "steamAppId": 298630
  },
  {
    "title": "Europa Universalis IV",
    "service": "epic",
    "start": "2021-09-30",
    "steamAppId": 236850
  },
  {
    "title": "PC Building Simulator",
    "service": "epic",
    "start": "2021-10-07",
    "steamAppId": 621060
  },
  {
    "title": "Stubbs the Zombie in Rebel Without a Pulse",
    "service": "epic",
    "start": "2021-10-14",
    "steamAppId": 7800
  },
  {
    "title": "Paladins Epic Pack",
    "service": "epic",
    "start": "2021-10-14"
  },
  {
    "title": "Among the Sleep: Enhanced Edition",
    "service": "epic",
    "start": "2021-10-21",
    "steamAppId": 250620
  },
  {
    "title": "DARQ: Complete Edition",
    "service": "epic",
    "start": "2021-10-28",
    "steamAppId": 433550
  },
  {
    "title": "Aven Colony",
    "service": "epic",
    "start": "2021-11-04",
    "steamAppId": 484900
  },
  {
    "title": "Tiny Tina's Assault on Dragon Keep: A Wonderlands One-Shot Adventure",
    "service": "epic",
    "start": "2021-11-09",
    "steamAppId": 1712840
  },
  {
    "title": "Rogue Company Season Four Epic Pack",
    "service": "epic",
    "start": "2021-11-11"
  },
  {
    "title": "Never Alone (Kisima Ingitchuna)",
    "service": "epic",
    "start": "2021-11-18",
    "steamAppId": 295790
  },
  {
    "title": "Kid A Mnesia Exhibition",
    "service": "epic",
    "start": "2021-11-18"
  },
  {
    "title": "Guild of Dungeoneering",
    "service": "epic",
    "start": "2021-11-18",
    "steamAppId": 1722490
  },
  {
    "title": "theHunter: Call of the Wild",
    "service": "epic",
    "start": "2021-11-25"
  },
  {
    "title": "Antstream Epic Welcome Pack",
    "service": "epic",
    "start": "2021-11-25"
  },
  {
    "title": "while True: learn()",
    "service": "epic",
    "start": "2021-12-02",
    "steamAppId": 619150
  },
  {
    "title": "Dead by Daylight",
    "service": "epic",
    "start": "2021-12-02",
    "steamAppId": 381210
  },
  {
    "title": "Prison Architect",
    "service": "epic",
    "start": "2021-12-09",
    "steamAppId": 233450
  },
  {
    "title": "Godfall: Challenger Edition",
    "service": "epic",
    "start": "2021-12-09"
  },
  {
    "title": "Shenmue III",
    "service": "epic",
    "start": "2021-12-16",
    "steamAppId": 878670
  },
  {
    "title": "Neon Abyss",
    "service": "epic",
    "start": "2021-12-17",
    "steamAppId": 788100
  },
  {
    "title": "Remnant: From the Ashes",
    "service": "epic",
    "start": "2021-12-18",
    "steamAppId": 617290
  },
  {
    "title": "The Vanishing of Ethan Carter",
    "service": "epic",
    "start": "2021-12-19",
    "steamAppId": 258520
  },
  {
    "title": "Loop Hero",
    "service": "epic",
    "start": "2021-12-20",
    "steamAppId": 1282730
  },
  {
    "title": "Second Extinction",
    "service": "epic",
    "start": "2021-12-21"
  },
  {
    "title": "Mutant Year Zero: Road to Eden",
    "service": "epic",
    "start": "2021-12-22",
    "steamAppId": 760060
  },
  {
    "title": "Vampyr",
    "service": "epic",
    "start": "2021-12-23",
    "steamAppId": 427290
  },
  {
    "title": "Pathfinder: Kingmaker: Enhanced Plus Edition",
    "service": "epic",
    "start": "2021-12-24",
    "steamAppId": 640820
  },
  {
    "title": "Prey",
    "service": "epic",
    "start": "2021-12-25",
    "steamAppId": 480490
  },
  {
    "title": "Control",
    "service": "epic",
    "start": "2021-12-26",
    "steamAppId": 4253280
  },
  {
    "title": "Mages of Mystralia",
    "service": "epic",
    "start": "2021-12-27",
    "steamAppId": 529660
  },
  {
    "title": "Moving Out",
    "service": "epic",
    "start": "2021-12-28",
    "steamAppId": 996770
  },
  {
    "title": "Salt and Sanctuary",
    "service": "epic",
    "start": "2021-12-29",
    "steamAppId": 283640
  },
  {
    "title": "Tomb Raider: Game of the Year Edition",
    "service": "epic",
    "start": "2021-12-30"
  },
  {
    "title": "Shadow of the Tomb Raider: Definitive Edition",
    "service": "epic",
    "start": "2021-12-30",
    "steamAppId": 750920
  },
  {
    "title": "Rise of the Tomb Raider: 20 Year Celebration",
    "service": "epic",
    "start": "2021-12-30"
  },
  {
    "title": "Gods Will Fall",
    "service": "epic",
    "start": "2022-01-06",
    "steamAppId": 1243690
  },
  {
    "title": "Galactic Civilizations III",
    "service": "epic",
    "start": "2022-01-13",
    "steamAppId": 226860
  },
  {
    "title": "Relicta",
    "service": "epic",
    "start": "2022-01-20",
    "steamAppId": 941570
  },
  {
    "title": "Daemon X Machina",
    "service": "epic",
    "start": "2022-01-27",
    "steamAppId": 1167450
  },
  {
    "title": "Yooka-Laylee and the Impossible Lair",
    "service": "epic",
    "start": "2022-02-03",
    "steamAppId": 846870
  },
  {
    "title": "Windbound",
    "service": "epic",
    "start": "2022-02-10",
    "steamAppId": 1162130
  },
  {
    "title": "Brothers: A Tale of Two Sons",
    "service": "epic",
    "start": "2022-02-17",
    "steamAppId": 225080
  },
  {
    "title": "Cris Tales",
    "service": "epic",
    "start": "2022-02-24",
    "steamAppId": 1079830
  },
  {
    "title": "Dauntless Epic Slayer Kit",
    "service": "epic",
    "start": "2022-03-03"
  },
  {
    "title": "Centipede: Recharged",
    "service": "epic",
    "start": "2022-03-03",
    "steamAppId": 1630960
  },
  {
    "title": "Black Widow: Recharged",
    "service": "epic",
    "start": "2022-03-03",
    "steamAppId": 1714180
  },
  {
    "title": "Cities: Skylines",
    "service": "epic",
    "start": "2022-03-10",
    "steamAppId": 255710
  },
  {
    "title": "In Sound Mind",
    "service": "epic",
    "start": "2022-03-17",
    "steamAppId": 1119980
  },
  {
    "title": "Demon's Tilt",
    "service": "epic",
    "start": "2022-03-24",
    "steamAppId": 422510
  },
  {
    "title": "Total War: Warhammer",
    "service": "epic",
    "start": "2022-03-31",
    "steamAppId": 364360
  },
  {
    "title": "City of Brass",
    "service": "epic",
    "start": "2022-03-31",
    "steamAppId": 301840
  },
  {
    "title": "The Vanishing of Ethan Carter",
    "service": "epic",
    "start": "2022-04-07",
    "steamAppId": 258520
  },
  {
    "title": "Rogue Legacy",
    "service": "epic",
    "start": "2022-04-07",
    "steamAppId": 241600
  },
  {
    "title": "XCOM 2",
    "service": "epic",
    "start": "2022-04-14",
    "steamAppId": 268500
  },
  {
    "title": "Insurmountable",
    "service": "epic",
    "start": "2022-04-14",
    "steamAppId": 1385100
  },
  {
    "title": "Riverbond",
    "service": "epic",
    "start": "2022-04-21",
    "steamAppId": 459370
  },
  {
    "title": "Amnesia Rebirth",
    "service": "epic",
    "start": "2022-04-21",
    "steamAppId": 999220
  },
  {
    "title": "Paradigm",
    "service": "epic",
    "start": "2022-04-28",
    "steamAppId": 600370
  },
  {
    "title": "Just Die Already",
    "service": "epic",
    "start": "2022-04-28",
    "steamAppId": 979070
  },
  {
    "title": "Terraforming Mars",
    "service": "epic",
    "start": "2022-05-05",
    "steamAppId": 800270
  },
  {
    "title": "Redout: Enhanced Edition",
    "service": "epic",
    "start": "2022-05-12",
    "steamAppId": 517710
  },
  {
    "title": "Prey",
    "service": "epic",
    "start": "2022-05-12",
    "steamAppId": 480490
  },
  {
    "title": "Jotun: Valhalla Edition",
    "service": "epic",
    "start": "2022-05-12",
    "steamAppId": 323580
  },
  {
    "title": "Borderlands 3",
    "service": "epic",
    "start": "2022-05-19",
    "steamAppId": 397540
  },
  {
    "title": "BioShock Remastered",
    "service": "epic",
    "start": "2022-05-26"
  },
  {
    "title": "BioShock Infinite: Complete Edition",
    "service": "epic",
    "start": "2022-05-26"
  },
  {
    "title": "BioShock 2 Remastered",
    "service": "epic",
    "start": "2022-05-26"
  },
  {
    "title": "Wolfenstein: The New Order",
    "service": "epic",
    "start": "2022-06-02",
    "steamAppId": 201810
  },
  {
    "title": "Maneater",
    "service": "epic",
    "start": "2022-06-09",
    "steamAppId": 629820
  },
  {
    "title": "Supraland",
    "service": "epic",
    "start": "2022-06-16",
    "steamAppId": 813630
  },
  {
    "title": "Car Mechanic Simulator 2018",
    "service": "epic",
    "start": "2022-06-23",
    "steamAppId": 645630
  },
  {
    "title": "A Game Of Thrones: The Board Game Digital Edition",
    "service": "epic",
    "start": "2022-06-23",
    "steamAppId": 1075190
  },
  {
    "title": "Iratus: Lord of the Dead",
    "service": "epic",
    "start": "2022-06-30",
    "steamAppId": 807120
  },
  {
    "title": "Hood: Outlaws & Legends",
    "service": "epic",
    "start": "2022-06-30"
  },
  {
    "title": "Geneforge 1: Mutagen",
    "service": "epic",
    "start": "2022-06-30",
    "steamAppId": 1424710
  },
  {
    "title": "Killing Floor 2",
    "service": "epic",
    "start": "2022-07-07",
    "steamAppId": 232090
  },
  {
    "title": "Ancient Enemy",
    "service": "epic",
    "start": "2022-07-07",
    "steamAppId": 993790
  },
  {
    "title": "Wonder Boy: The Dragon's Trap",
    "service": "epic",
    "start": "2022-07-14",
    "steamAppId": 543260
  },
  {
    "title": "Idle Champions of the Forgotten Realms - Baeloth's Gladiators of the Black Pits Pack",
    "service": "epic",
    "start": "2022-07-14"
  },
  {
    "title": "Tannenberg",
    "service": "epic",
    "start": "2022-07-21",
    "steamAppId": 633460
  },
  {
    "title": "Shop Titans - Exclusive Giveaway Package",
    "service": "epic",
    "start": "2022-07-21"
  },
  {
    "title": "Rumbleverse - Boom Boxer Content Pack",
    "service": "epic",
    "start": "2022-08-18"
  },
  {
    "title": "Lawn Mowing Simulator",
    "service": "epic",
    "start": "2022-07-28",
    "steamAppId": 1480560
  },
  {
    "title": "Unrailed!",
    "service": "epic",
    "start": "2022-08-04",
    "steamAppId": 1016920
  },
  {
    "title": "Cook, Serve, Delicious! 3?!",
    "service": "epic",
    "start": "2022-08-11",
    "steamAppId": 1000030
  },
  {
    "title": "DOOM 64",
    "service": "epic",
    "start": "2022-08-18",
    "steamAppId": 1148590
  },
  {
    "title": "Ring of Pain",
    "service": "epic",
    "start": "2022-08-25",
    "steamAppId": 998740
  },
  {
    "title": "Destiny 2: Bungie 30th Anniversary Pack",
    "service": "epic",
    "start": "2022-08-25",
    "steamAppId": 1656370
  },
  {
    "title": "Submerged: Hidden Depths",
    "service": "epic",
    "start": "2022-09-01",
    "steamAppId": 1614270
  },
  {
    "title": "Knockout City - Armazillo DLC Pack",
    "service": "epic",
    "start": "2022-09-01"
  },
  {
    "title": "Realm Royale Reforged Epic Launch Bundle",
    "service": "epic",
    "start": "2022-09-08"
  },
  {
    "title": "Hundred Days - Winemaking Simulator",
    "service": "epic",
    "start": "2022-09-08",
    "steamAppId": 1042380
  },
  {
    "title": "The Captain",
    "service": "epic",
    "start": "2022-09-15",
    "steamAppId": 1721530
  },
  {
    "title": "Spirit of the North",
    "service": "epic",
    "start": "2022-09-15",
    "steamAppId": 1213700
  },
  {
    "title": "Gloomhaven",
    "service": "epic",
    "start": "2022-09-22",
    "steamAppId": 780290
  },
  {
    "title": "Ark: Survival Evolved",
    "service": "epic",
    "start": "2022-09-22",
    "steamAppId": 346110
  },
  {
    "title": "The Drone Racing League®",
    "service": "epic",
    "start": "2022-09-29",
    "steamAppId": 641780
  },
  {
    "title": "Runbow",
    "service": "epic",
    "start": "2022-09-29",
    "steamAppId": 464650
  },
  {
    "title": "Slain: Back From Hell",
    "service": "epic",
    "start": "2022-10-06",
    "steamAppId": 369070
  },
  {
    "title": "Rising Hell",
    "service": "epic",
    "start": "2022-10-06",
    "steamAppId": 657000
  },
  {
    "title": "ToeJam & Earl: Back in the Groove!",
    "service": "epic",
    "start": "2022-10-13"
  },
  {
    "title": "Darkwood",
    "service": "epic",
    "start": "2022-10-13",
    "steamAppId": 274520
  },
  {
    "title": "Fallout 3: Game of the Year Edition",
    "service": "epic",
    "start": "2022-10-20",
    "steamAppId": 22370
  },
  {
    "title": "Evoland Legendary Edition",
    "service": "epic",
    "start": "2022-10-20",
    "steamAppId": 1020470
  },
  {
    "title": "Warhammer 40,000: Mechanicus",
    "service": "epic",
    "start": "2022-10-27",
    "steamAppId": 673880
  },
  {
    "title": "Saturnalia",
    "service": "epic",
    "start": "2022-10-27",
    "steamAppId": 916350
  },
  {
    "title": "Rising Storm 2: Vietnam",
    "service": "epic",
    "start": "2022-11-03",
    "steamAppId": 418460
  },
  {
    "title": "Filament",
    "service": "epic",
    "start": "2022-11-03",
    "steamAppId": 1137350
  },
  {
    "title": "Shadow Tactics: Blades of the Shogun",
    "service": "epic",
    "start": "2022-11-10",
    "steamAppId": 418240
  },
  {
    "title": "Alba - A Wildlife Adventure",
    "service": "epic",
    "start": "2022-11-10",
    "steamAppId": 1337010
  },
  {
    "title": "Evil Dead: The Game",
    "service": "epic",
    "start": "2022-11-17"
  },
  {
    "title": "Dark Deity",
    "service": "epic",
    "start": "2022-11-17",
    "steamAppId": 1374840
  },
  {
    "title": "Star Wars: Squadrons",
    "service": "epic",
    "start": "2022-11-24",
    "steamAppId": 1222730
  },
  {
    "title": "RPG in a Box",
    "service": "epic",
    "start": "2022-12-01",
    "steamAppId": 498310
  },
  {
    "title": "Fort Triumph",
    "service": "epic",
    "start": "2022-12-01",
    "steamAppId": 612570
  },
  {
    "title": "Wildcat Gun Machine",
    "service": "epic",
    "start": "2022-12-08",
    "steamAppId": 1288610
  },
  {
    "title": "Saints Row IV Re-Elected",
    "service": "epic",
    "start": "2022-12-08",
    "steamAppId": 206420
  },
  {
    "title": "Bloons TD 6",
    "service": "epic",
    "start": "2022-12-15",
    "steamAppId": 960090
  },
  {
    "title": "Horizon Chase Turbo",
    "service": "epic",
    "start": "2022-12-16",
    "steamAppId": 389140
  },
  {
    "title": "Costume Quest 2",
    "service": "epic",
    "start": "2022-12-17",
    "steamAppId": 275180
  },
  {
    "title": "Sable",
    "service": "epic",
    "start": "2022-12-18",
    "steamAppId": 757310
  },
  {
    "title": "Them's Fighting Herds",
    "service": "epic",
    "start": "2022-12-19"
  },
  {
    "title": "Wolfenstein The New Order",
    "service": "epic",
    "start": "2022-12-20",
    "steamAppId": 201810
  },
  {
    "title": "Lego Builder's Journey",
    "service": "epic",
    "start": "2022-12-21",
    "steamAppId": 1544360
  },
  {
    "title": "Fallout 2: A Post Nuclear Role Playing Game",
    "service": "epic",
    "start": "2022-12-22",
    "steamAppId": 38410
  },
  {
    "title": "Fallout Tactics: Brotherhood of Steel",
    "service": "epic",
    "start": "2022-12-22",
    "steamAppId": 38420
  },
  {
    "title": "Fallout: A Post Nuclear Role Playing Game",
    "service": "epic",
    "start": "2022-12-22",
    "steamAppId": 38400
  },
  {
    "title": "Encased",
    "service": "epic",
    "start": "2022-12-23",
    "steamAppId": 1133130
  },
  {
    "title": "Metro Last Light Redux",
    "service": "epic",
    "start": "2022-12-24",
    "steamAppId": 287390
  },
  {
    "title": "Death Stranding",
    "service": "epic",
    "start": "2022-12-25",
    "steamAppId": 1850570
  },
  {
    "title": "F.I.S.T.: Forged In S. Torch",
    "service": "epic",
    "start": "2022-12-26",
    "steamAppId": 1330470
  },
  {
    "title": "Severed Steel",
    "service": "epic",
    "start": "2022-12-27",
    "steamAppId": 1227690
  },
  {
    "title": "Mortal Shell",
    "service": "epic",
    "start": "2022-12-28",
    "steamAppId": 1110910
  },
  {
    "title": "Eximius: Seize the Frontline",
    "service": "epic",
    "start": "2022-12-29",
    "steamAppId": 505740
  },
  {
    "title": "Dishonored: Definitive Edition",
    "service": "epic",
    "start": "2022-12-29"
  },
  {
    "title": "Shadow Tactics: Aiko's Choice",
    "service": "epic",
    "start": "2023-01-05",
    "steamAppId": 1579380
  },
  {
    "title": "Kerbal Space Program 1",
    "service": "epic",
    "start": "2023-01-05"
  },
  {
    "title": "Gamedec: Definitive Edition",
    "service": "epic",
    "start": "2023-01-12",
    "steamAppId": 917720
  },
  {
    "title": "First Class Trouble",
    "service": "epic",
    "start": "2023-01-12",
    "steamAppId": 953880
  },
  {
    "title": "Divine Knockout",
    "service": "epic",
    "start": "2023-01-12"
  },
  {
    "title": "Epistory: Typing Chronicles",
    "service": "epic",
    "start": "2023-01-19",
    "steamAppId": 398850
  },
  {
    "title": "Hell Is Others",
    "service": "epic",
    "start": "2023-01-26",
    "steamAppId": 964440
  },
  {
    "title": "Adios",
    "service": "epic",
    "start": "2023-01-26",
    "steamAppId": 1271400
  },
  {
    "title": "Dishonored: Death of the Outsider",
    "service": "epic",
    "start": "2023-02-02",
    "steamAppId": 614570
  },
  {
    "title": "City of Gangsters",
    "service": "epic",
    "start": "2023-02-02",
    "steamAppId": 1386780
  },
  {
    "title": "Recipe for Disaster",
    "service": "epic",
    "start": "2023-02-09",
    "steamAppId": 4531990
  },
  {
    "title": "Warpips",
    "service": "epic",
    "start": "2023-02-16",
    "steamAppId": 1291010
  },
  {
    "title": "Duskers",
    "service": "epic",
    "start": "2023-02-23",
    "steamAppId": 254320
  },
  {
    "title": "Rise of Industry",
    "service": "epic",
    "start": "2023-03-02",
    "steamAppId": 671440
  },
  {
    "title": "Call of the Sea",
    "service": "epic",
    "start": "2023-03-09",
    "steamAppId": 1042490
  },
  {
    "title": "Warhammer 40,000: Gladius - Relics of War",
    "service": "epic",
    "start": "2023-03-16",
    "steamAppId": 489630
  },
  {
    "title": "World of Warships - Starter Pack: Ishizuchi",
    "service": "epic",
    "start": "2023-03-23",
    "steamAppId": 844890
  },
  {
    "title": "Chess Ultra",
    "service": "epic",
    "start": "2023-03-23",
    "steamAppId": 518060
  },
  {
    "title": "Tunche",
    "service": "epic",
    "start": "2023-03-30",
    "steamAppId": 887450
  },
  {
    "title": "The Silent Age",
    "service": "epic",
    "start": "2023-03-30",
    "steamAppId": 352520
  },
  {
    "title": "shapez",
    "service": "epic",
    "start": "2023-04-06",
    "steamAppId": 1318690
  },
  {
    "title": "Dying Light Enhanced Edition",
    "service": "epic",
    "start": "2023-04-06"
  },
  {
    "title": "Second Extinction™",
    "service": "epic",
    "start": "2023-04-13"
  },
  {
    "title": "MORDHAU",
    "service": "epic",
    "start": "2023-04-13",
    "steamAppId": 629760
  },
  {
    "title": "Beyond Blue",
    "service": "epic",
    "start": "2023-04-20",
    "steamAppId": 883360
  },
  {
    "title": "Never Alone (Kisima Ingitchuna)",
    "service": "epic",
    "start": "2023-04-20",
    "steamAppId": 295790
  },
  {
    "title": "Breathedge",
    "service": "epic",
    "start": "2023-04-27",
    "steamAppId": 738520
  },
  {
    "title": "https://www.epicgames.com/store/p/poker-club-6e18ee",
    "service": "epic",
    "start": "2023-04-27"
  },
  {
    "title": "Horizon Chase Turbo",
    "service": "epic",
    "start": "2023-05-04",
    "steamAppId": 389140
  },
  {
    "title": "Kao the Kangaroo",
    "service": "epic",
    "start": "2023-05-04",
    "steamAppId": 1370140
  },
  {
    "title": "The Sims™ 4 The Daring Lifestyle Bundle",
    "service": "epic",
    "start": "2023-05-11"
  },
  {
    "title": "Death Stranding",
    "service": "epic",
    "start": "2023-05-18",
    "steamAppId": 1850570
  },
  {
    "title": "Fallout: New Vegas - Ultimate Edition",
    "service": "epic",
    "start": "2023-05-25"
  },
  {
    "title": "Midnight Ghost Hunt",
    "service": "epic",
    "start": "2023-06-01",
    "steamAppId": 915810
  },
  {
    "title": "Payday 2",
    "service": "epic",
    "start": "2023-06-08",
    "steamAppId": 218620
  },
  {
    "title": "Guacamelee! Super Turbo Championship Edition",
    "service": "epic",
    "start": "2023-06-15",
    "steamAppId": 275390
  },
  {
    "title": "Guacamelee! 2",
    "service": "epic",
    "start": "2023-06-15",
    "steamAppId": 534550
  },
  {
    "title": "Idle Champions of the Forgotten Realms",
    "service": "epic",
    "start": "2023-06-22",
    "steamAppId": 627690
  },
  {
    "title": "theHunter: Call of the Wild™",
    "service": "epic",
    "start": "2023-06-22"
  },
  {
    "title": "The Dungeon of Naheulbeuk",
    "service": "epic",
    "start": "2023-06-29",
    "steamAppId": 1491140
  },
  {
    "title": "GRIME",
    "service": "epic",
    "start": "2023-07-06",
    "steamAppId": 1123050
  },
  {
    "title": "Train Valley 2",
    "service": "epic",
    "start": "2023-07-13",
    "steamAppId": 602320
  },
  {
    "title": "Murder by Numbers",
    "service": "epic",
    "start": "2023-07-20",
    "steamAppId": 1140290
  },
  {
    "title": "The Elder Scrolls Online",
    "service": "epic",
    "start": "2023-07-20",
    "steamAppId": 306130
  },
  {
    "title": "Severed Steel",
    "service": "epic",
    "start": "2023-07-27",
    "steamAppId": 1227690
  },
  {
    "title": "Homeworld Remastered Collection",
    "service": "epic",
    "start": "2023-07-27",
    "steamAppId": 244160
  },
  {
    "title": "Loop Hero",
    "service": "epic",
    "start": "2023-08-03",
    "steamAppId": 1282730
  },
  {
    "title": "Bloons TD 6",
    "service": "epic",
    "start": "2023-08-03",
    "steamAppId": 960090
  },
  {
    "title": "Europa Universalis IV",
    "service": "epic",
    "start": "2023-08-10",
    "steamAppId": 236850
  },
  {
    "title": "Orwell: Keeping an Eye on You",
    "service": "epic",
    "start": "2023-08-10",
    "steamAppId": 491950
  },
  {
    "title": "Black Book",
    "service": "epic",
    "start": "2023-08-17",
    "steamAppId": 1138660
  },
  {
    "title": "Dodo Peak",
    "service": "epic",
    "start": "2023-08-17",
    "steamAppId": 2845610
  },
  {
    "title": "Homeworld: Deserts of Kharak",
    "service": "epic",
    "start": "2023-08-24",
    "steamAppId": 281610
  },
  {
    "title": "Cave Story+",
    "service": "epic",
    "start": "2023-08-31",
    "steamAppId": 200900
  },
  {
    "title": "Spelldrifter",
    "service": "epic",
    "start": "2023-09-07",
    "steamAppId": 1766750
  },
  {
    "title": "911 Operator",
    "service": "epic",
    "start": "2023-09-14",
    "steamAppId": 503560
  },
  {
    "title": "Out of Line",
    "service": "epic",
    "start": "2023-09-21",
    "steamAppId": 1419290
  },
  {
    "title": "The Forest Quartet",
    "service": "epic",
    "start": "2023-09-21",
    "steamAppId": 1620720
  },
  {
    "title": "Model Builder",
    "service": "epic",
    "start": "2023-09-28",
    "steamAppId": 2138320
  },
  {
    "title": "Soulstice",
    "service": "epic",
    "start": "2023-09-28",
    "steamAppId": 1602080
  },
  {
    "title": "Godlike Burger",
    "service": "epic",
    "start": "2023-10-05",
    "steamAppId": 1432910
  },
  {
    "title": "Blazing Sails",
    "service": "epic",
    "start": "2023-10-12",
    "steamAppId": 1158940
  },
  {
    "title": "Q.U.B.E. ULTIMATE BUNDLE",
    "service": "epic",
    "start": "2023-10-12"
  },
  {
    "title": "The Evil Within",
    "service": "epic",
    "start": "2023-10-19",
    "steamAppId": 268050
  },
  {
    "title": "Eternal Threads",
    "service": "epic",
    "start": "2023-10-19",
    "steamAppId": 1046790
  },
  {
    "title": "The Evil Within 2",
    "service": "epic",
    "start": "2023-10-26",
    "steamAppId": 601430
  },
  {
    "title": "Turnip Boy Commits Tax Evasion",
    "service": "epic",
    "start": "2023-11-02",
    "steamAppId": 1205450
  },
  {
    "title": "Golden Light",
    "service": "epic",
    "start": "2023-11-09",
    "steamAppId": 1245430
  },
  {
    "title": "Surviving the Aftermath",
    "service": "epic",
    "start": "2023-11-16",
    "steamAppId": 684450
  },
  {
    "title": "EARTHLOCK",
    "service": "epic",
    "start": "2023-11-16",
    "steamAppId": 761030
  },
  {
    "title": "Deliver Us Mars",
    "service": "epic",
    "start": "2023-11-23",
    "steamAppId": 1345890
  },
  {
    "title": "Mighty Fight Federation",
    "service": "epic",
    "start": "2023-11-30",
    "steamAppId": 1096690
  },
  {
    "title": "Jitsu Squad",
    "service": "epic",
    "start": "2023-11-30",
    "steamAppId": 1522080
  },
  {
    "title": "GigaBash",
    "service": "epic",
    "start": "2023-12-07",
    "steamAppId": 1546400
  },
  {
    "title": "Predecessor",
    "service": "epic",
    "start": "2023-12-07",
    "steamAppId": 961200
  },
  {
    "title": "Destiny 2: Legacy Collection",
    "service": "epic",
    "start": "2023-12-13"
  },
  {
    "title": "DNF Duel",
    "service": "epic",
    "start": "2023-12-20",
    "steamAppId": 1216060
  },
  {
    "title": "Melvor Idle",
    "service": "epic",
    "start": "2023-12-21",
    "steamAppId": 1267910
  },
  {
    "title": "Art of Rally",
    "service": "epic",
    "start": "2023-12-22",
    "steamAppId": 550320
  },
  {
    "title": "Fallout 3: Game of the Year Edition",
    "service": "epic",
    "start": "2023-12-23",
    "steamAppId": 22370
  },
  {
    "title": "Ghostwire: Tokyo",
    "service": "epic",
    "start": "2023-12-24",
    "steamAppId": 1475810
  },
  {
    "title": "The Outer Worlds: Spacer's Choice Edition",
    "service": "epic",
    "start": "2023-12-25",
    "steamAppId": 1920490
  },
  {
    "title": "Human Resource Machine",
    "service": "epic",
    "start": "2023-12-26",
    "steamAppId": 375820
  },
  {
    "title": "Cursed to Golf",
    "service": "epic",
    "start": "2023-12-27",
    "steamAppId": 1726120
  },
  {
    "title": "Cat Quest",
    "service": "epic",
    "start": "2023-12-28",
    "steamAppId": 593280
  },
  {
    "title": "Snakebird Complete",
    "service": "epic",
    "start": "2023-12-29"
  },
  {
    "title": "Saints Row",
    "service": "epic",
    "start": "2023-12-30",
    "steamAppId": 742420
  },
  {
    "title": "Ghostrunner",
    "service": "epic",
    "start": "2023-12-31",
    "steamAppId": 1139900
  },
  {
    "title": "Escape Academy",
    "service": "epic",
    "start": "2024-01-01",
    "steamAppId": 1812090
  },
  {
    "title": "20 Minutes Till Dawn",
    "service": "epic",
    "start": "2024-01-02",
    "steamAppId": 1966900
  },
  {
    "title": "A Plague Tale: Innocence",
    "service": "epic",
    "start": "2024-01-03",
    "steamAppId": 752590
  },
  {
    "title": "Marvel's Guardians of the Galaxy",
    "service": "epic",
    "start": "2024-01-04",
    "steamAppId": 1088850
  },
  {
    "title": "Sail Forth",
    "service": "epic",
    "start": "2024-01-11",
    "steamAppId": 1031460
  },
  {
    "title": "LOVE",
    "service": "epic",
    "start": "2024-01-18",
    "steamAppId": 3044740
  },
  {
    "title": "Infinifactory",
    "service": "epic",
    "start": "2024-01-25",
    "steamAppId": 300570
  },
  {
    "title": "Doors - Paradox",
    "service": "epic",
    "start": "2024-02-01",
    "steamAppId": 1622770
  },
  {
    "title": "Doki Doki Literature Club Plus!",
    "service": "epic",
    "start": "2024-02-08",
    "steamAppId": 1388880
  },
  {
    "title": "Lost Castle",
    "service": "epic",
    "start": "2024-02-08",
    "steamAppId": 2445690
  },
  {
    "title": "Dakar Desert Rally",
    "service": "epic",
    "start": "2024-02-15",
    "steamAppId": 1839940
  },
  {
    "title": "Super Meat Boy Forever",
    "service": "epic",
    "start": "2024-02-22",
    "steamAppId": 581660
  },
  {
    "title": "Aerial_Knight's Never Yield",
    "service": "epic",
    "start": "2024-02-29",
    "steamAppId": 1323540
  },
  {
    "title": "Astro Duel 2",
    "service": "epic",
    "start": "2024-03-07",
    "steamAppId": 655350
  },
  {
    "title": "The Bridge",
    "service": "epic",
    "start": "2024-03-14",
    "steamAppId": 204240
  },
  {
    "title": "Deus Ex - Mankind Divided",
    "service": "epic",
    "start": "2024-03-14",
    "steamAppId": 337000
  },
  {
    "title": "Call of the Wild: The Angler™",
    "service": "epic",
    "start": "2024-03-21",
    "steamAppId": 1408610
  },
  {
    "title": "Invincible Presents: Atom Eve",
    "service": "epic",
    "start": "2024-03-21",
    "steamAppId": 2060870
  },
  {
    "title": "Islets",
    "service": "epic",
    "start": "2024-03-28",
    "steamAppId": 1669420
  },
  {
    "title": "The Outer Worlds: Spacer's Choice Edition",
    "service": "epic",
    "start": "2024-04-04",
    "steamAppId": 1920490
  },
  {
    "title": "Thief",
    "service": "epic",
    "start": "2024-04-04",
    "steamAppId": 239160
  },
  {
    "title": "Ghostrunner",
    "service": "epic",
    "start": "2024-04-11",
    "steamAppId": 1139900
  },
  {
    "title": "The Big Con",
    "service": "epic",
    "start": "2024-04-18",
    "steamAppId": 1139280
  },
  {
    "title": "Town of Salem 2",
    "service": "epic",
    "start": "2024-04-18",
    "steamAppId": 2140510
  },
  {
    "title": "INDUSTRIA",
    "service": "epic",
    "start": "2024-04-25",
    "steamAppId": 1172650
  },
  {
    "title": "LISA: The Definitive Edition",
    "service": "epic",
    "start": "2024-04-25"
  },
  {
    "title": "Orcs Must Die! 3",
    "service": "epic",
    "start": "2024-05-02",
    "steamAppId": 1522820
  },
  {
    "title": "Cat Quest II",
    "service": "epic",
    "start": "2024-05-02",
    "steamAppId": 914710
  },
  {
    "title": "Circus Electrique",
    "service": "epic",
    "start": "2024-05-09",
    "steamAppId": 1666250
  },
  {
    "title": "Firestone Free Offer",
    "service": "epic",
    "start": "2024-05-09"
  },
  {
    "title": "Dragon Age: Inquisition – Game of the Year Edition",
    "service": "epic",
    "start": "2024-05-16"
  },
  {
    "title": "Farming Simulator 22",
    "service": "epic",
    "start": "2024-05-23",
    "steamAppId": 1248130
  },
  {
    "title": "Chivalry 2",
    "service": "epic",
    "start": "2024-05-30",
    "steamAppId": 1824220
  },
  {
    "title": "Marvel's Midnight Suns",
    "service": "epic",
    "start": "2024-06-06",
    "steamAppId": 368260
  },
  {
    "title": "Idle Champions of the Forgotten Realms",
    "service": "epic",
    "start": "2024-06-13",
    "steamAppId": 627690
  },
  {
    "title": "Redout 2",
    "service": "epic",
    "start": "2024-06-13",
    "steamAppId": 1799930
  },
  {
    "title": "Freshly Frosted",
    "service": "epic",
    "start": "2024-06-20",
    "steamAppId": 1070790
  },
  {
    "title": "Rumble Club - Free Game of the Week Bonus",
    "service": "epic",
    "start": "2024-06-20"
  },
  {
    "title": "Sunless Skies: Sovereign Edition",
    "service": "epic",
    "start": "2024-06-27",
    "steamAppId": 596970
  },
  {
    "title": "The Falconeer: Standard Edition",
    "service": "epic",
    "start": "2024-07-04"
  },
  {
    "title": "Floppy Knights",
    "service": "epic",
    "start": "2024-07-11",
    "steamAppId": 1057800
  },
  {
    "title": "Arcade Paradise",
    "service": "epic",
    "start": "2024-07-18",
    "steamAppId": 1388870
  },
  {
    "title": "Maid of Sker",
    "service": "epic",
    "start": "2024-07-18",
    "steamAppId": 826940
  },
  {
    "title": "F.I.S.T.: Forged In Shadow Torch",
    "service": "epic",
    "start": "2024-07-25",
    "steamAppId": 1330470
  },
  {
    "title": "Exclusive Outfits Pack",
    "service": "epic",
    "start": "2024-07-25"
  },
  {
    "title": "LumbearJack",
    "service": "epic",
    "start": "2024-08-01",
    "steamAppId": 1582290
  },
  {
    "title": "RAWMEN: Food Fighter Arena 🍜",
    "service": "epic",
    "start": "2024-08-01",
    "steamAppId": 782940
  },
  {
    "title": "DNF Duel",
    "service": "epic",
    "start": "2024-08-08",
    "steamAppId": 1216060
  },
  {
    "title": "CYGNI - All Guns Blazing",
    "service": "epic",
    "start": "2024-08-08",
    "steamAppId": 1248080
  },
  {
    "title": "Apex Legends™: Conduit Free Unlock Bundle",
    "service": "epic",
    "start": "2024-08-08"
  },
  {
    "title": "World of Warships — Starter Pack: Albany",
    "service": "epic",
    "start": "2024-08-15"
  },
  {
    "title": "Death's Gambit - Afterlife",
    "service": "epic",
    "start": "2024-08-15",
    "steamAppId": 356650
  },
  {
    "title": "The Callisto Protocol",
    "service": "epic",
    "start": "2024-08-22",
    "steamAppId": 1544020
  },
  {
    "title": "Gigantic: Rampage Edition",
    "service": "epic",
    "start": "2024-08-22",
    "steamAppId": 1924490
  },
  {
    "title": "Wild Card Football",
    "service": "epic",
    "start": "2024-08-29"
  },
  {
    "title": "Fallout® Classic Collection",
    "service": "epic",
    "start": "2024-08-29"
  },
  {
    "title": "Football Manager 2024",
    "service": "epic",
    "start": "2024-09-05",
    "steamAppId": 2473420
  },
  {
    "title": "Sniper Ghost Warrior Contracts",
    "service": "epic",
    "start": "2024-09-05",
    "steamAppId": 973580
  },
  {
    "title": "SUPER CRAZY RHYTHM CASTLE",
    "service": "epic",
    "start": "2024-09-12",
    "steamAppId": 1812560
  },
  {
    "title": "Rugrats: Adventures in Gameland",
    "service": "epic",
    "start": "2024-09-12",
    "steamAppId": 2633950
  },
  {
    "title": "TOEM",
    "service": "epic",
    "start": "2024-09-19",
    "steamAppId": 2900640
  },
  {
    "title": "The Last Stand: Aftermath",
    "service": "epic",
    "start": "2024-09-19",
    "steamAppId": 1266840
  },
  {
    "title": "The Spirit and the Mouse",
    "service": "epic",
    "start": "2024-09-26",
    "steamAppId": 1679210
  },
  {
    "title": "Bear and Breakfast",
    "service": "epic",
    "start": "2024-10-03",
    "steamAppId": 1136370
  },
  {
    "title": "Outliver: Tribulation",
    "service": "epic",
    "start": "2024-10-10",
    "steamAppId": 1236930
  },
  {
    "title": "Empyrion - Galactic Survival",
    "service": "epic",
    "start": "2024-10-10",
    "steamAppId": 383120
  },
  {
    "title": "Kardboard Kings",
    "service": "epic",
    "start": "2024-10-17",
    "steamAppId": 1334090
  },
  {
    "title": "Invincible Presents: Atom Eve",
    "service": "epic",
    "start": "2024-10-17",
    "steamAppId": 2060870
  },
  {
    "title": "Moving Out",
    "service": "epic",
    "start": "2024-10-24",
    "steamAppId": 996770
  },
  {
    "title": "Ghostwire: Tokyo",
    "service": "epic",
    "start": "2024-10-31",
    "steamAppId": 1475810
  },
  {
    "title": "Witch It",
    "service": "epic",
    "start": "2024-10-31",
    "steamAppId": 559650
  },
  {
    "title": "Deceive Inc.",
    "service": "epic",
    "start": "2024-11-07",
    "steamAppId": 820520
  },
  {
    "title": "Apex Legends™: Ash Free Unlock Bundle",
    "service": "epic",
    "start": "2024-11-07"
  },
  {
    "title": "Snakebird Complete",
    "service": "epic",
    "start": "2024-11-14"
  },
  {
    "title": "Castlevania Anniversary Collection",
    "service": "epic",
    "start": "2024-11-14",
    "steamAppId": 1018010
  },
  {
    "title": "Beholder",
    "service": "epic",
    "start": "2024-11-21",
    "steamAppId": 475550
  },
  {
    "title": "Brotato",
    "service": "epic",
    "start": "2024-11-28",
    "steamAppId": 1942280
  },
  {
    "title": "LEGO® Star Wars™: The Skywalker Saga",
    "service": "epic",
    "start": "2024-12-05",
    "steamAppId": 920210
  },
  {
    "title": "Bus Simulator 21 Next Stop",
    "service": "epic",
    "start": "2024-12-05",
    "steamAppId": 976590
  },
  {
    "title": "The Lord of The Rings Return to Moria",
    "service": "epic",
    "start": "2024-12-12",
    "steamAppId": 2933130
  },
  {
    "title": "Vampire Survivors",
    "service": "epic",
    "start": "2024-12-19",
    "steamAppId": 1794680
  },
  {
    "title": "Astrea Six Sided Oracles",
    "service": "epic",
    "start": "2024-12-20",
    "steamAppId": 1755830
  },
  {
    "title": "TerraTech",
    "service": "epic",
    "start": "2024-12-21",
    "steamAppId": 285920
  },
  {
    "title": "Wizard of Legend",
    "service": "epic",
    "start": "2024-12-22",
    "steamAppId": 445980
  },
  {
    "title": "Dark and Darker - Legendary Status",
    "service": "epic",
    "start": "2024-12-23",
    "steamAppId": 3211120
  },
  {
    "title": "DREDGE",
    "service": "epic",
    "start": "2024-12-24",
    "steamAppId": 1562430
  },
  {
    "title": "Control",
    "service": "epic",
    "start": "2024-12-25",
    "steamAppId": 4253280
  },
  {
    "title": "Ghostrunner 2",
    "service": "epic",
    "start": "2024-12-26",
    "steamAppId": 2144740
  },
  {
    "title": "HOT WHEELS UNLEASHED™",
    "service": "epic",
    "start": "2024-12-27",
    "steamAppId": 1271700
  },
  {
    "title": "Kill Knight",
    "service": "epic",
    "start": "2024-12-28",
    "steamAppId": 2694420
  },
  {
    "title": "Orcs Must Die! 3",
    "service": "epic",
    "start": "2024-12-29",
    "steamAppId": 1522820
  },
  {
    "title": "[REDACTED]",
    "service": "epic",
    "start": "2024-12-30",
    "steamAppId": 2229940
  },
  {
    "title": "Sifu",
    "service": "epic",
    "start": "2024-12-31",
    "steamAppId": 2138710
  },
  {
    "title": "Kingdom Come: Deliverance",
    "service": "epic",
    "start": "2025-01-01",
    "steamAppId": 379430
  },
  {
    "title": "Hell Let Loose",
    "service": "epic",
    "start": "2025-01-02",
    "steamAppId": 686810
  },
  {
    "title": "Turmoil",
    "service": "epic",
    "start": "2025-01-09",
    "steamAppId": 361280
  },
  {
    "title": "Escape Academy",
    "service": "epic",
    "start": "2025-01-16",
    "steamAppId": 1812090
  },
  {
    "title": "Behind the Frame: The Finest Scenery",
    "service": "epic",
    "start": "2025-01-23",
    "steamAppId": 1634150
  },
  {
    "title": "Undying",
    "service": "epic",
    "start": "2025-01-30",
    "steamAppId": 3180670
  },
  {
    "title": "Beyond Blue",
    "service": "epic",
    "start": "2025-02-06",
    "steamAppId": 883360
  },
  {
    "title": "HUMANKIND™ Standard Edition",
    "service": "epic",
    "start": "2025-02-06"
  },
  {
    "title": "F1® Manager 2024",
    "service": "epic",
    "start": "2025-02-13",
    "steamAppId": 2591280
  },
  {
    "title": "Apex Legends™: Loba Free Unlock Bundle",
    "service": "epic",
    "start": "2025-02-13"
  },
  {
    "title": "Garden Story",
    "service": "epic",
    "start": "2025-02-20",
    "steamAppId": 1062140
  },
  {
    "title": "World War Z Aftermath",
    "service": "epic",
    "start": "2025-02-20",
    "steamAppId": 2243210
  },
  {
    "title": "Mages of Mystralia",
    "service": "epic",
    "start": "2025-02-27",
    "steamAppId": 529660
  },
  {
    "title": "Them's Fightin' Herds",
    "service": "epic",
    "start": "2025-03-06",
    "steamAppId": 574980
  },
  {
    "title": "Mortal Shell",
    "service": "epic",
    "start": "2025-03-13",
    "steamAppId": 1110910
  },
  {
    "title": "World of Warships — Anniversary Party Favor",
    "service": "epic",
    "start": "2025-03-13"
  },
  {
    "title": "Jurassic World Evolution 2",
    "service": "epic",
    "start": "2025-03-20",
    "steamAppId": 1244460
  },
  {
    "title": "Neko Ghost, Jump!",
    "service": "epic",
    "start": "2025-03-27",
    "steamAppId": 1194750
  },
  {
    "title": "Cat Quest",
    "service": "epic",
    "start": "2025-03-27",
    "steamAppId": 593280
  },
  {
    "title": "Cat Quest II",
    "service": "epic",
    "start": "2025-04-03",
    "steamAppId": 914710
  },
  {
    "title": "Idle Champions of the Forgotten Realms",
    "service": "epic",
    "start": "2025-04-10",
    "steamAppId": 627690
  },
  {
    "title": "River City Girls",
    "service": "epic",
    "start": "2025-04-10",
    "steamAppId": 1049320
  },
  {
    "title": "Arcadegeddon",
    "service": "epic",
    "start": "2025-04-10",
    "steamAppId": 1515640
  },
  {
    "title": "Firestone Online Idle RPG",
    "service": "epic",
    "start": "2025-04-17",
    "steamAppId": 3063880
  },
  {
    "title": "Botanicula",
    "service": "epic",
    "start": "2025-04-17",
    "steamAppId": 207690
  },
  {
    "title": "CHUCHEL",
    "service": "epic",
    "start": "2025-04-24",
    "steamAppId": 711660
  },
  {
    "title": "Albion Online Free Welcome Gift",
    "service": "epic",
    "start": "2025-04-24"
  },
  {
    "title": "Super Space Club",
    "service": "epic",
    "start": "2025-05-01",
    "steamAppId": 1100290
  },
  {
    "title": "Touch Type Tale",
    "service": "epic",
    "start": "2025-05-08",
    "steamAppId": 909470
  },
  {
    "title": "Deadtime Defenders",
    "service": "epic",
    "start": "2025-05-08",
    "steamAppId": 1148700
  },
  {
    "title": "Happy Game",
    "service": "epic",
    "start": "2025-05-15",
    "steamAppId": 1206060
  },
  {
    "title": "Dead Island 2",
    "service": "epic",
    "start": "2025-05-15",
    "steamAppId": 934700
  },
  {
    "title": "Sifu",
    "service": "epic",
    "start": "2025-05-22",
    "steamAppId": 2138710
  },
  {
    "title": "Gigapocalypse",
    "service": "epic",
    "start": "2025-05-22",
    "steamAppId": 1543240
  },
  {
    "title": "Deliver At All Costs",
    "service": "epic",
    "start": "2025-05-22",
    "steamAppId": 1880610
  },
  {
    "title": "Tiny Tina's Wonderlands",
    "service": "epic",
    "start": "2025-05-29",
    "steamAppId": 1286680
  },
  {
    "title": "Limbo",
    "service": "epic",
    "start": "2025-05-29",
    "steamAppId": 48000
  },
  {
    "title": "Ogu and the Secret Forest",
    "service": "epic",
    "start": "2025-06-05",
    "steamAppId": 1985960
  },
  {
    "title": "DEATHLOOP",
    "service": "epic",
    "start": "2025-06-05",
    "steamAppId": 1252330
  },
  {
    "title": "Two Point Hospital",
    "service": "epic",
    "start": "2025-06-12",
    "steamAppId": 535930
  },
  {
    "title": "The Operator",
    "service": "epic",
    "start": "2025-06-19",
    "steamAppId": 1771980
  },
  {
    "title": "Sable",
    "service": "epic",
    "start": "2025-06-26",
    "steamAppId": 757310
  },
  {
    "title": "Figment",
    "service": "epic",
    "start": "2025-07-03",
    "steamAppId": 493540
  },
  {
    "title": "Backpack Hero",
    "service": "epic",
    "start": "2025-07-03",
    "steamAppId": 1970580
  },
  {
    "title": "Sky Racket",
    "service": "epic",
    "start": "2025-07-10",
    "steamAppId": 994500
  },
  {
    "title": "Figment 2: Creed Valley",
    "service": "epic",
    "start": "2025-07-10",
    "steamAppId": 1085220
  },
  {
    "title": "Sid Meier’s Civilization® VI Platinum Edition",
    "service": "epic",
    "start": "2025-07-17"
  },
  {
    "title": "Legion TD 2",
    "service": "epic",
    "start": "2025-07-24",
    "steamAppId": 2162190
  },
  {
    "title": "Pilgrims",
    "service": "epic",
    "start": "2025-07-31",
    "steamAppId": 1049280
  },
  {
    "title": "Keylocker | Turn Based Cyberpunk Action",
    "service": "epic",
    "start": "2025-07-31",
    "steamAppId": 1325040
  },
  {
    "title": "112 Operator",
    "service": "epic",
    "start": "2025-08-07",
    "steamAppId": 793460
  },
  {
    "title": "Road Redemption",
    "service": "epic",
    "start": "2025-08-07",
    "steamAppId": 300380
  },
  {
    "title": "Totally Reliable Delivery Service Standard Edition",
    "service": "epic",
    "start": "2025-08-14"
  },
  {
    "title": "Hidden Folks",
    "service": "epic",
    "start": "2025-08-14",
    "steamAppId": 435400
  },
  {
    "title": "Strange Horticulture",
    "service": "epic",
    "start": "2025-08-21",
    "steamAppId": 1574580
  },
  {
    "title": "Kamaeru",
    "service": "epic",
    "start": "2025-08-21",
    "steamAppId": 1978150
  },
  {
    "title": "Machinarium",
    "service": "epic",
    "start": "2025-08-28",
    "steamAppId": 40700
  },
  {
    "title": "Make Way",
    "service": "epic",
    "start": "2025-08-28",
    "steamAppId": 1445790
  },
  {
    "title": "There Is No Game: Wrong Dimension",
    "service": "epic",
    "start": "2025-07-17",
    "steamAppId": 1240210
  },
  {
    "title": "Doodle God: Infinite Alchemy Merge",
    "service": "epic",
    "start": "2025-06-19"
  },
  {
    "title": "Shapez",
    "service": "epic",
    "start": "2025-06-12",
    "steamAppId": 1318690
  },
  {
    "title": "MR RACER : Premium",
    "service": "epic",
    "start": "2025-05-08"
  },
  {
    "title": "Loop Hero",
    "service": "epic",
    "start": "2025-04-24",
    "steamAppId": 1282730
  },
  {
    "title": "Doodle Mafia: Epic Alchemy",
    "service": "epic",
    "start": "2025-07-24"
  },
  {
    "title": "Bridge Constructor: The Walking Dead",
    "service": "epic",
    "start": "2025-04-10",
    "steamAppId": 1336120
  },
  {
    "title": "Doodle Kingdom: Medieval",
    "service": "epic",
    "start": "2025-04-03"
  },
  {
    "title": "Out There - Omega Edition",
    "service": "epic",
    "start": "2025-03-27"
  },
  {
    "title": "Eastern Exorcist",
    "service": "epic",
    "start": "2025-03-27",
    "steamAppId": 1120810
  },
  {
    "title": "Cultist Simulator",
    "service": "epic",
    "start": "2025-06-26",
    "steamAppId": 718670
  },
  {
    "title": "Evoland 2",
    "service": "epic",
    "start": "2025-03-27",
    "steamAppId": 359310
  },
  {
    "title": "Super Meat Boy Forever Mobile",
    "service": "epic",
    "start": "2025-03-20"
  },
  {
    "title": "STAR WARS™ Knights of the Old Republic™",
    "service": "epic",
    "start": "2025-02-20",
    "steamAppId": 32370
  },
  {
    "title": "STAR WARS™ Knights of the Old Republic™ II - The Sith Lords™",
    "service": "epic",
    "start": "2025-02-20",
    "steamAppId": 208580
  },
  {
    "title": "Bloons TD 6",
    "service": "epic",
    "start": "2025-01-24",
    "steamAppId": 960090
  },
  {
    "title": "Dungeon of the Endless: Apogee",
    "service": "epic",
    "start": "2025-01-24"
  },
  {
    "title": "Monument Valley",
    "service": "epic",
    "start": "2025-09-04",
    "steamAppId": 1927720
  },
  {
    "title": "Ghostrunner 2",
    "service": "epic",
    "start": "2025-09-11",
    "steamAppId": 2144740
  },
  {
    "title": "The Battle of Polytopia",
    "service": "epic",
    "start": "2025-09-11",
    "steamAppId": 874390
  },
  {
    "title": "Monument Valley 2",
    "service": "epic",
    "start": "2025-09-11",
    "steamAppId": 1927740
  },
  {
    "title": "Samorost 2",
    "service": "epic",
    "start": "2025-09-18",
    "steamAppId": 40720
  },
  {
    "title": "Project Winter",
    "service": "epic",
    "start": "2025-09-18",
    "steamAppId": 774861
  },
  {
    "title": "Road Redemption Mobile Full Game Offer",
    "service": "epic",
    "start": "2025-09-18"
  },
  {
    "title": "Eastern Exorcist",
    "service": "epic",
    "start": "2025-09-25",
    "steamAppId": 1120810
  },
  {
    "title": "Jorel’s Brother and The Most Important Game of the Galaxy",
    "service": "epic",
    "start": "2025-09-25",
    "steamAppId": 1398910
  },
  {
    "title": "Firestone Online Idle RPG",
    "service": "epic",
    "start": "2025-10-02",
    "steamAppId": 3063880
  },
  {
    "title": "Nightingale",
    "service": "epic",
    "start": "2025-10-02",
    "steamAppId": 1928980
  },
  {
    "title": "Doodle Devil: Dark Side",
    "service": "epic",
    "start": "2025-10-02"
  },
  {
    "title": "Gravity Circuit",
    "service": "epic",
    "start": "2025-10-09",
    "steamAppId": 858710
  },
  {
    "title": "Albion Online: Rogue Journeyman Bundle",
    "service": "epic",
    "start": "2025-10-09"
  },
  {
    "title": "Double Dragon Trilogy",
    "service": "epic",
    "start": "2025-10-09",
    "steamAppId": 314150
  },
  {
    "title": "Amnesia: The Bunker",
    "service": "epic",
    "start": "2025-10-16",
    "steamAppId": 1944430
  },
  {
    "title": "Samorost 3",
    "service": "epic",
    "start": "2025-10-16",
    "steamAppId": 421120
  },
  {
    "title": "Fear the Spotlight",
    "service": "epic",
    "start": "2025-10-23",
    "steamAppId": 1959390
  },
  {
    "title": "Doodle Farm: Breeds and Beasts",
    "service": "epic",
    "start": "2025-10-23"
  },
  {
    "title": "Bendy and the Ink Machine",
    "service": "epic",
    "start": "2025-10-30",
    "steamAppId": 622650
  },
  {
    "title": "Five Nights at Freddy's: Into the Pit",
    "service": "epic",
    "start": "2025-10-30",
    "steamAppId": 2638370
  },
  {
    "title": "Idle Champions of the Forgotten Realms",
    "service": "epic",
    "start": "2025-11-06",
    "steamAppId": 627690
  },
  {
    "title": "Felix The Reaper",
    "service": "epic",
    "start": "2025-11-06",
    "steamAppId": 919410
  },
  {
    "title": "Scourgebringer",
    "service": "epic",
    "start": "2025-11-13",
    "steamAppId": 1037020
  },
  {
    "title": "Songs of Silence",
    "service": "epic",
    "start": "2025-11-13",
    "steamAppId": 2195410
  },
  {
    "title": "Zero Hour",
    "service": "epic",
    "start": "2025-11-13",
    "steamAppId": 1359090
  },
  {
    "title": "Zoeti",
    "service": "epic",
    "start": "2025-11-20",
    "steamAppId": 1434540
  },
  {
    "title": "Godzilla Voxel Wars",
    "service": "epic",
    "start": "2025-11-20",
    "steamAppId": 2439780
  },
  {
    "title": "Universe for Sale",
    "service": "epic",
    "start": "2025-11-27",
    "steamAppId": 1627840
  },
  {
    "title": "The Jackbox Party Pack 4",
    "service": "epic",
    "start": "2025-12-04",
    "steamAppId": 610180
  },
  {
    "title": "The Darkside Detective",
    "service": "epic",
    "start": "2025-12-04",
    "steamAppId": 368390
  },
  {
    "title": "Dead Cells",
    "service": "epic",
    "start": "2025-12-11",
    "steamAppId": 588650
  },
  {
    "title": "Hogwarts Legacy",
    "service": "epic",
    "start": "2025-12-11",
    "steamAppId": 990080
  },
  {
    "title": "Jotunnslayer: Hordes of Hel",
    "service": "epic",
    "start": "2025-12-18",
    "steamAppId": 2820820
  },
  {
    "title": "Shotgun King: The Final Checkmate",
    "service": "epic",
    "start": "2025-12-18",
    "steamAppId": 1972440
  },
  {
    "title": "Eternights",
    "service": "epic",
    "start": "2025-12-19",
    "steamAppId": 1402110
  },
  {
    "title": "Blood West",
    "service": "epic",
    "start": "2025-12-20",
    "steamAppId": 1587130
  },
  {
    "title": "Sorry We're Closed",
    "service": "epic",
    "start": "2025-12-21",
    "steamAppId": 1796580
  },
  {
    "title": "Paradise Killer",
    "service": "epic",
    "start": "2025-12-22",
    "steamAppId": 1160220
  },
  {
    "title": "Bloodstained: Ritual of the Night",
    "service": "epic",
    "start": "2025-12-23",
    "steamAppId": 692850
  },
  {
    "title": "The Callisto Protocol",
    "service": "epic",
    "start": "2025-12-24",
    "steamAppId": 1544020
  },
  {
    "title": "Disco Elysium - The Final Cut",
    "service": "epic",
    "start": "2025-12-25",
    "steamAppId": 632470
  },
  {
    "title": "Monument Valley",
    "service": "epic",
    "start": "2025-12-25",
    "steamAppId": 1927720
  },
  {
    "title": "Monument Valley 2",
    "service": "epic",
    "start": "2025-12-25",
    "steamAppId": 1927740
  },
  {
    "title": "We Were Here Together",
    "service": "epic",
    "start": "2025-12-26",
    "steamAppId": 865360
  },
  {
    "title": "Cassette Beasts",
    "service": "epic",
    "start": "2025-12-27",
    "steamAppId": 1321440
  },
  {
    "title": "SKALD Against the Black Priory",
    "service": "epic",
    "start": "2025-12-28",
    "steamAppId": 1069160
  },
  {
    "title": "Viewfinder",
    "service": "epic",
    "start": "2025-12-29",
    "steamAppId": 1382070
  },
  {
    "title": "Trine Classic Collection",
    "service": "epic",
    "start": "2025-12-30"
  },
  {
    "title": "Chivalry 2",
    "service": "epic",
    "start": "2025-12-31",
    "steamAppId": 1824220
  },
  {
    "title": "Wildgate",
    "service": "epic",
    "start": "2026-01-01",
    "steamAppId": 3504780
  },
  {
    "title": "Total War: THREE KINGDOMS",
    "service": "epic",
    "start": "2026-01-01",
    "steamAppId": 779340
  },
  {
    "title": "Skul: The Hero Slayer",
    "service": "epic",
    "start": "2026-01-01",
    "steamAppId": 1147560
  },
  {
    "title": "Bloons TD 6",
    "service": "epic",
    "start": "2026-01-08",
    "steamAppId": 960090
  },
  {
    "title": "Bouncemasters",
    "service": "epic",
    "start": "2026-01-08",
    "steamAppId": 3697340
  },
  {
    "title": "Styx: Master of Shadows",
    "service": "epic",
    "start": "2026-01-15",
    "steamAppId": 242640
  },
  {
    "title": "Styx: Shards of Darkness - Deluxe Edition",
    "service": "epic",
    "start": "2026-01-15"
  },
  {
    "title": "Dumb Ways to Die",
    "service": "epic",
    "start": "2026-01-15"
  },
  {
    "title": "Rustler - Grand Theft Horse",
    "service": "epic",
    "start": "2026-01-22",
    "steamAppId": 844260
  },
  {
    "title": "The Forest Quartet",
    "service": "epic",
    "start": "2026-01-22",
    "steamAppId": 1620720
  },
  {
    "title": "Definitely Not Fried Chicken",
    "service": "epic",
    "start": "2026-01-29",
    "steamAppId": 1036240
  },
  {
    "title": "Faily Brakes 2",
    "service": "epic",
    "start": "2026-01-29"
  },
  {
    "title": "Botany Manor",
    "service": "epic",
    "start": "2026-02-05",
    "steamAppId": 1425350
  },
  {
    "title": "Pixel Gun 3D: Poison Retro Set",
    "service": "epic",
    "start": "2026-02-05",
    "steamAppId": 2869440
  },
  {
    "title": "The Darkside Detective A Fumble in the Dark",
    "service": "epic",
    "start": "2026-02-12",
    "steamAppId": 795420
  },
  {
    "title": "Nobody Wants to Die",
    "service": "epic",
    "start": "2026-02-12",
    "steamAppId": 1939970
  },
  {
    "title": "Return to Ash",
    "service": "epic",
    "start": "2026-02-19",
    "steamAppId": 3445830
  },
  {
    "title": "STALCRAFT: X Starter Edition",
    "service": "epic",
    "start": "2026-02-19"
  },
  {
    "title": "Residual",
    "service": "epic",
    "start": "2026-02-19",
    "steamAppId": 1290780
  },
  {
    "title": "Boxes: Lost Fragments",
    "service": "epic",
    "start": "2026-02-26",
    "steamAppId": 2019810
  },
  {
    "title": "My Night Job",
    "service": "epic",
    "start": "2026-02-26",
    "steamAppId": 437100
  },
  {
    "title": "Idle Champions of the Forgotten Realms",
    "service": "epic",
    "start": "2026-03-05",
    "steamAppId": 627690
  },
  {
    "title": "Turnip Boy Robs a Bank",
    "service": "epic",
    "start": "2026-03-05",
    "steamAppId": 2097230
  },
  {
    "title": "Little Nightmares",
    "service": "epic",
    "start": "2026-03-05",
    "steamAppId": 424840
  },
  {
    "title": "Cozy Grove",
    "service": "epic",
    "start": "2026-03-12",
    "steamAppId": 1458100
  },
  {
    "title": "Isonzo",
    "service": "epic",
    "start": "2026-03-12",
    "steamAppId": 1556790
  },
  {
    "title": "Wonder Boy: The Dragon's Trap",
    "service": "epic",
    "start": "2026-03-12",
    "steamAppId": 543260
  },
  {
    "title": "Electrician Simulator",
    "service": "epic",
    "start": "2026-03-19",
    "steamAppId": 1080020
  },
  {
    "title": "World of Warships — Epic Anniversary Tachibana Pack",
    "service": "epic",
    "start": "2026-03-19"
  },
  {
    "title": "Potion Permit",
    "service": "epic",
    "start": "2026-03-19",
    "steamAppId": 1337760
  },
  {
    "title": "Hyper Echelon",
    "service": "epic",
    "start": "2026-03-26",
    "steamAppId": 953330
  },
  {
    "title": "Havendock",
    "service": "epic",
    "start": "2026-03-26",
    "steamAppId": 2020710
  },
  {
    "title": "The Wreck",
    "service": "epic",
    "start": "2026-03-26",
    "steamAppId": 1687960
  },
  {
    "title": "Clone Drone in the Danger Zone",
    "service": "epic",
    "start": "2026-04-02",
    "steamAppId": 597170
  },
  {
    "title": "TOMAK: Save the Earth Regeneration",
    "service": "epic",
    "start": "2026-04-02"
  },
  {
    "title": "Dumb Ways to Die 2: The Games",
    "service": "epic",
    "start": "2026-04-02"
  },
  {
    "title": "Prop Sumo",
    "service": "epic",
    "start": "2026-04-09",
    "steamAppId": 3089420
  },
  {
    "title": "Dumb Ways to Draw",
    "service": "epic",
    "start": "2026-04-09"
  },
  {
    "title": "The Stone of Madness",
    "service": "epic",
    "start": "2026-04-16",
    "steamAppId": 1309710
  },
  {
    "title": "Broken Sword : Reforged",
    "service": "epic",
    "start": "2026-04-16"
  },
  {
    "title": "DOOMBLADE",
    "service": "epic",
    "start": "2026-04-23",
    "steamAppId": 922050
  },
  {
    "title": "911 Operator",
    "service": "epic",
    "start": "2026-04-23",
    "steamAppId": 503560
  },
  {
    "title": "Firestone Online Idle RPG",
    "service": "epic",
    "start": "2026-04-30",
    "steamAppId": 3063880
  },
  {
    "title": "Oddsparks: An Automation Adventure",
    "service": "epic",
    "start": "2026-04-30",
    "steamAppId": 1817800
  },
  {
    "title": "Streets of Rage 4",
    "service": "epic",
    "start": "2026-04-30",
    "steamAppId": 985890
  },
  {
    "title": "Arranger: A Role-Puzzling Adventure",
    "service": "epic",
    "start": "2026-05-07",
    "steamAppId": 2596420
  },
  {
    "title": "Trash Goblin",
    "service": "epic",
    "start": "2026-05-07",
    "steamAppId": 2407830
  },
  {
    "title": "Teacup",
    "service": "epic",
    "start": "2026-05-07",
    "steamAppId": 1444300
  },
  {
    "title": "The Telltale Batman Shadows Edition",
    "service": "epic",
    "start": "2026-05-14"
  },
  {
    "title": "Sunderfolk - Standard Edition",
    "service": "epic",
    "start": "2026-05-14"
  },
  {
    "title": "Arranger: A Role-Puzzling Adventure",
    "service": "epic",
    "start": "2026-05-14",
    "steamAppId": 2596420
  },
  {
    "title": "Down in Bermuda",
    "service": "epic",
    "start": "2026-05-21",
    "steamAppId": 1107300
  },
  {
    "title": "Tomb Raider I-III Remastered Starring Lara Croft",
    "service": "epic",
    "start": "2026-05-21",
    "steamAppId": 2478970
  },
  {
    "title": "Monument Valley 3",
    "service": "epic",
    "start": "2026-05-21",
    "steamAppId": 3132930
  },
  {
    "title": "LONESTAR",
    "service": "epic",
    "start": "2026-05-28",
    "steamAppId": 2056210
  },
  {
    "title": "Calico",
    "service": "epic",
    "start": "2026-05-28",
    "steamAppId": 1112890
  },
  {
    "title": "Northgard",
    "service": "epic",
    "start": "2026-05-28",
    "steamAppId": 4487060
  },
  {
    "title": "Rogue Waters",
    "service": "epic",
    "start": "2026-06-04",
    "steamAppId": 1691190
  },
  {
    "title": "Songs of Conquest",
    "service": "epic",
    "start": "2026-06-04",
    "steamAppId": 867210
  },
  {
    "title": "Wytchwood",
    "service": "epic",
    "start": "2026-06-04",
    "steamAppId": 729000
  },
  {
    "title": "The Ouroboros King",
    "service": "epic",
    "start": "2026-06-11",
    "steamAppId": 2096510
  },
  {
    "title": "Warhammer 40K Speed Freeks",
    "service": "epic",
    "start": "2026-06-11"
  },
  {
    "title": "Guild of Dungeoneering Ultimate Edition",
    "service": "epic",
    "start": "2026-06-11",
    "steamAppId": 317820
  },
  {
    "title": "Citizen Sleeper",
    "service": "epic",
    "start": "2026-06-18",
    "steamAppId": 1578650
  },
  {
    "title": "ROBOBEAT",
    "service": "epic",
    "start": "2026-06-18",
    "steamAppId": 1456760
  },
  {
    "title": "Construction Simulator 3",
    "service": "epic",
    "start": "2026-06-18",
    "steamAppId": 1370120
  },
  {
    "title": "RollerCoaster Tycoon 3 Complete Edition",
    "service": "epic",
    "start": "2026-06-25",
    "steamAppId": 1368820
  },
  {
    "title": "Voidwrought",
    "service": "epic",
    "start": "2026-06-25",
    "steamAppId": 2014550
  },
  {
    "title": "Teenage Mutant Ninja Turtles - Shredder's Revenge",
    "service": "epic",
    "start": "2026-06-25"
  },
  {
    "title": "River City Girls 2",
    "service": "epic",
    "start": "2026-07-02",
    "steamAppId": 1920480
  },
  {
    "title": "I Have No Mouth, and I Must Scream",
    "service": "epic",
    "start": "2026-07-02",
    "steamAppId": 245390
  },
  {
    "title": "Sophia the Traveler",
    "service": "epic",
    "start": "2026-07-02",
    "steamAppId": 1602540
  },
  {
    "title": "Nova Lands",
    "service": "epic",
    "start": "2026-07-09",
    "steamAppId": 1501610
  },
  {
    "title": "Tattoo Tycoon",
    "service": "epic",
    "start": "2026-07-09",
    "steamAppId": 2375260
  },
  {
    "title": "Princess Farmer",
    "service": "epic",
    "start": "2026-07-09",
    "steamAppId": 1320490
  },
  {
    "title": "Luto",
    "service": "epic",
    "start": "2026-07-16",
    "steamAppId": 1729740
  },
  {
    "title": "Echo Generation: Midnight Edition",
    "service": "epic",
    "start": "2026-07-16",
    "steamAppId": 1072300
  },
  {
    "title": "The Ouroboros King",
    "service": "epic",
    "start": "2026-07-16",
    "steamAppId": 2096510
  },
  {
    "title": "Foretales",
    "service": "epic",
    "start": "2026-07-23",
    "steamAppId": 1170080
  },
  {
    "title": "OTXO",
    "service": "epic",
    "start": "2026-07-30",
    "steamAppId": 1608640
  },
  {
    "title": "Sol Cesto",
    "service": "epic",
    "start": "2026-07-30",
    "steamAppId": 2738490
  },
  {
    "title": "Mutazione",
    "service": "epic",
    "start": "2026-07-30",
    "steamAppId": 1080750
  },
  {
    "title": "Beacon Pines",
    "service": "epic",
    "start": "2026-08-06",
    "steamAppId": 1269640
  },
  {
    "title": "We Were Here Together",
    "service": "epic",
    "start": "2026-08-06",
    "steamAppId": 865360
  },
  {
    "title": "A Guidebook Of Babel",
    "service": "epic",
    "start": "2026-08-07",
    "steamAppId": 1467920
  },
  {
    "title": "Caravan SandWitch",
    "service": "epic",
    "start": "2026-08-13",
    "steamAppId": 1582650
  },
  {
    "title": "Beholder: Conductor",
    "service": "epic",
    "start": "2026-08-13",
    "steamAppId": 2825530
  },
  {
    "title": "Cardpocalypse Standard Edition",
    "service": "epic",
    "start": "2026-08-20"
  },
  {
    "title": "Epic Mage Bundle",
    "service": "epic",
    "start": "2026-08-20"
  },
  {
    "title": "Caravan SandWitch",
    "service": "epic",
    "start": "2026-08-20",
    "steamAppId": 1582650
  },
  {
    "title": "Breathedge",
    "service": "epic",
    "start": "2026-08-27",
    "steamAppId": 738520
  },
  {
    "title": "Rival Stars Horse Racing : Desktop Edition",
    "service": "epic",
    "start": "2026-08-27"
  },
  {
    "title": "Down in Bermuda",
    "service": "epic",
    "start": "2026-08-28",
    "steamAppId": 1107300
  },
  {
    "title": "Alone With You",
    "service": "epic",
    "start": "2026-09-03",
    "steamAppId": 564940
  },
  {
    "title": "Evan's Remains",
    "service": "epic",
    "start": "2026-09-03",
    "steamAppId": 1110050
  },
  {
    "title": "Luftrausers",
    "service": "epic",
    "start": "2026-09-10",
    "steamAppId": 233150
  },
  {
    "title": "Astral Ascent",
    "service": "epic",
    "start": "2026-09-10",
    "steamAppId": 1280930
  },
  {
    "title": "Alone With You",
    "service": "epic",
    "start": "2026-09-10",
    "steamAppId": 564940
  },
  {
    "title": "Mindcop",
    "service": "epic",
    "start": "2026-09-17",
    "steamAppId": 1517180
  },
  {
    "title": "Shogun Showdown",
    "service": "epic",
    "start": "2026-09-17",
    "steamAppId": 2084000
  },
  {
    "title": "Astrea Six Sided Oracles",
    "service": "epic",
    "start": "2026-09-24",
    "steamAppId": 1755830
  },
  {
    "title": "Mechabellum",
    "service": "epic",
    "start": "2026-09-24",
    "steamAppId": 669330
  },
  {
    "title": "Cardpocalypse",
    "service": "epic",
    "start": "2026-09-24",
    "steamAppId": 904400
  },
  {
    "title": "System Shock 2: 25th Anniversary Remaster",
    "service": "epic",
    "start": "2026-10-01",
    "steamAppId": 866570
  },
  {
    "title": "BURIED STARS",
    "service": "epic",
    "start": "2026-10-01",
    "steamAppId": 1025960
  },
  {
    "title": "Bridge Constructor Studio",
    "service": "epic",
    "start": "2026-10-01",
    "steamAppId": 3473610
  },
  {
    "title": "Out of Sight",
    "service": "epic",
    "start": "2026-10-08",
    "steamAppId": 2526310
  },
  {
    "title": "TerraScape",
    "service": "epic",
    "start": "2026-10-08",
    "steamAppId": 2290000
  },
  {
    "title": "The Big Con",
    "service": "epic",
    "start": "2026-10-09",
    "steamAppId": 1139280
  },
  {
    "title": "Agent A: A puzzle in disguise",
    "service": "epic",
    "start": "2026-10-09",
    "steamAppId": 801480
  },
  {
    "title": "Bad Cheese",
    "service": "epic",
    "start": "2026-10-15",
    "steamAppId": 3094480
  },
  {
    "title": "Agent A: A puzzle in disguise",
    "service": "epic",
    "start": "2026-10-15",
    "steamAppId": 801480
  },
  {
    "title": "Sker Ritual",
    "service": "epic",
    "start": "2026-10-22",
    "steamAppId": 1492070
  },
  {
    "title": "Home - A Unique Horror Adventure",
    "service": "epic",
    "start": "2026-10-22"
  },
  {
    "title": "Sorry We're Closed",
    "service": "epic",
    "start": "2026-10-29"
  },
  {
    "title": "Galaxy Kart",
    "service": "epic",
    "start": "2026-10-29"
  },
  {
    "title": "Idle Champions of the Forgotten Realms",
    "service": "epic",
    "start": "2026-11-05"
  },
  {
    "title": "Flotsam",
    "service": "epic",
    "start": "2026-11-05"
  },
  {
    "title": "Chants of Sennaar",
    "service": "epic",
    "start": "2026-11-06"
  },
  {
    "title": "Tomb Raider",
    "service": "humble_choice",
    "start": "2018-01-05",
    "steamAppId": 203160,
    "publisher": "Square Enix"
  },
  {
    "title": "Sleeping Dogs: Definitive Edition",
    "service": "humble_choice",
    "start": "2018-01-05",
    "steamAppId": 307690,
    "publisher": "Square Enix"
  },
  {
    "title": "Quantum Break",
    "service": "humble_choice",
    "start": "2018-01-05",
    "steamAppId": 474960,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Sid Meiers Civilization VI",
    "service": "humble_choice",
    "start": "2018-02-02",
    "steamAppId": 289070,
    "publisher": "2K"
  },
  {
    "title": "Owlboy",
    "service": "humble_choice",
    "start": "2018-02-02",
    "steamAppId": 115800,
    "publisher": "D-Pad Studio"
  },
  {
    "title": "Dark Souls III",
    "service": "humble_choice",
    "start": "2018-03-02",
    "steamAppId": 374320,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Deus Ex: Mankind Divided",
    "service": "humble_choice",
    "start": "2018-04-06",
    "steamAppId": 337000,
    "publisher": "Square Enix"
  },
  {
    "title": "Mafia III",
    "service": "humble_choice",
    "start": "2018-04-06",
    "steamAppId": 360430,
    "publisher": "2K"
  },
  {
    "title": "Outlast 2",
    "service": "humble_choice",
    "start": "2018-04-06",
    "steamAppId": 414700,
    "publisher": "Red Barrels"
  },
  {
    "title": "Kerbal Space Program",
    "service": "humble_choice",
    "start": "2018-05-04",
    "steamAppId": 220200,
    "publisher": "Private Division"
  },
  {
    "title": "Dead Rising 4",
    "service": "humble_choice",
    "start": "2018-05-04",
    "steamAppId": 543460,
    "publisher": "Capcom"
  },
  {
    "title": "Destiny 2",
    "service": "humble_choice",
    "start": "2018-06-01",
    "steamAppId": 1085660,
    "publisher": "Bungie"
  },
  {
    "title": "Hearts of Iron IV",
    "service": "humble_choice",
    "start": "2018-07-06",
    "steamAppId": 394360,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Blackwake",
    "service": "humble_choice",
    "start": "2018-07-06",
    "steamAppId": 420290,
    "publisher": "Mastfire Studios"
  },
  {
    "title": "Portal Knights",
    "service": "humble_choice",
    "start": "2018-07-06",
    "steamAppId": 374040,
    "publisher": "505 Games"
  },
  {
    "title": "A Hat in Time",
    "service": "humble_choice",
    "start": "2018-08-03",
    "steamAppId": 253230,
    "publisher": "Gears for Breakfast"
  },
  {
    "title": "The Escapists 2",
    "service": "humble_choice",
    "start": "2018-08-03",
    "steamAppId": 641990,
    "publisher": "Team17"
  },
  {
    "title": "Conan Exiles",
    "service": "humble_choice",
    "start": "2018-08-03",
    "steamAppId": 440900,
    "publisher": "Funcom"
  },
  {
    "title": "Sniper Elite 4",
    "service": "humble_choice",
    "start": "2018-09-07",
    "steamAppId": 312660,
    "publisher": "Rebellion"
  },
  {
    "title": "Tales of Berseria",
    "service": "humble_choice",
    "start": "2018-09-07",
    "steamAppId": 429660,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Little Nightmares",
    "service": "humble_choice",
    "start": "2018-09-07",
    "steamAppId": 424840,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Overwatch",
    "service": "humble_choice",
    "start": "2018-10-05",
    "steamAppId": 2357570,
    "publisher": "Blizzard"
  },
  {
    "title": "Hollow Knight",
    "service": "humble_choice",
    "start": "2018-10-05",
    "steamAppId": 367520,
    "publisher": "Team Cherry"
  },
  {
    "title": "7 Days to Die",
    "service": "humble_choice",
    "start": "2018-10-05",
    "steamAppId": 251570,
    "publisher": "The Fun Pimps"
  },
  {
    "title": "Hitman: The Complete First Season",
    "service": "humble_choice",
    "start": "2018-11-02",
    "steamAppId": 236870,
    "publisher": "IO Interactive"
  },
  {
    "title": "Resident Evil Revelations",
    "service": "humble_choice",
    "start": "2018-11-02",
    "steamAppId": 222480,
    "publisher": "Capcom"
  },
  {
    "title": "Dead Island Definitive Edition",
    "service": "humble_choice",
    "start": "2018-11-02",
    "steamAppId": 383150,
    "publisher": "Deep Silver"
  },
  {
    "title": "Metal Gear Solid V: The Phantom Pain",
    "service": "humble_choice",
    "start": "2018-12-07",
    "steamAppId": 287700,
    "publisher": "Konami"
  },
  {
    "title": "Cities: Skylines",
    "service": "humble_choice",
    "start": "2018-12-07",
    "steamAppId": 255710,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Yakuza 0",
    "service": "humble_choice",
    "start": "2019-01-04",
    "steamAppId": 638970,
    "publisher": "SEGA"
  },
  {
    "title": "Just Cause 3 XXL Edition",
    "service": "humble_choice",
    "start": "2019-01-04",
    "steamAppId": 225540,
    "publisher": "Square Enix"
  },
  {
    "title": "Project CARS 2",
    "service": "humble_choice",
    "start": "2019-01-04",
    "steamAppId": 378860,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Sniper Elite 3",
    "service": "humble_choice",
    "start": "2019-02-01",
    "steamAppId": 238090,
    "publisher": "Rebellion"
  },
  {
    "title": "Tom Clancys The Division",
    "service": "humble_choice",
    "start": "2019-02-01",
    "steamAppId": 365590,
    "publisher": "Ubisoft"
  },
  {
    "title": "Warhammer: Vermintide 2",
    "service": "humble_choice",
    "start": "2019-03-01",
    "steamAppId": 552500,
    "publisher": "Fatshark"
  },
  {
    "title": "Earth Defense Force 4.1",
    "service": "humble_choice",
    "start": "2019-03-01",
    "steamAppId": 410320,
    "publisher": "D3 Publisher"
  },
  {
    "title": "Cultist Simulator",
    "service": "humble_choice",
    "start": "2019-03-01",
    "steamAppId": 718670,
    "publisher": "Humble Games"
  },
  {
    "title": "Mutant Year Zero: Road to Eden",
    "service": "humble_choice",
    "start": "2019-04-05",
    "steamAppId": 760060,
    "publisher": "Funcom"
  },
  {
    "title": "Northgard",
    "service": "humble_choice",
    "start": "2019-04-05",
    "steamAppId": 466560,
    "publisher": "Shiro Games"
  },
  {
    "title": "Absolver",
    "service": "humble_choice",
    "start": "2019-04-05",
    "steamAppId": 473690,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Assassins Creed Origins",
    "service": "humble_choice",
    "start": "2019-05-03",
    "steamAppId": 582160,
    "publisher": "Ubisoft"
  },
  {
    "title": "Monster Prom",
    "service": "humble_choice",
    "start": "2019-05-03",
    "steamAppId": 743450,
    "publisher": "Those Awesome Guys"
  },
  {
    "title": "Black Ops 4",
    "service": "humble_choice",
    "start": "2019-06-07",
    "publisher": "Activision"
  },
  {
    "title": "Red Faction Guerrilla Re-Mars-tered",
    "service": "humble_choice",
    "start": "2019-06-07",
    "steamAppId": 667720,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Hellblade: Senuas Sacrifice",
    "service": "humble_choice",
    "start": "2019-07-05",
    "steamAppId": 414340,
    "publisher": "Ninja Theory"
  },
  {
    "title": "Moonlighter",
    "service": "humble_choice",
    "start": "2019-07-05",
    "steamAppId": 606150,
    "publisher": "11 bit studios"
  },
  {
    "title": "Warhammer 40,000: Mechanicus",
    "service": "humble_choice",
    "start": "2019-07-05",
    "steamAppId": 673880,
    "publisher": "Kasedo Games"
  },
  {
    "title": "Kingdom Come: Deliverance",
    "service": "humble_choice",
    "start": "2019-08-02",
    "steamAppId": 379430,
    "publisher": "Deep Silver"
  },
  {
    "title": "Surviving Mars",
    "service": "humble_choice",
    "start": "2019-08-02",
    "steamAppId": 464920,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Slay the Spire",
    "service": "humble_choice",
    "start": "2019-08-02",
    "steamAppId": 646570,
    "publisher": "MegaCrit"
  },
  {
    "title": "Squad",
    "service": "humble_choice",
    "start": "2019-09-06",
    "steamAppId": 393380,
    "publisher": "Offworld Industries"
  },
  {
    "title": "Battletech",
    "service": "humble_choice",
    "start": "2019-10-04",
    "steamAppId": 637090,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Sonic Mania",
    "service": "humble_choice",
    "start": "2019-10-04",
    "steamAppId": 584400,
    "publisher": "SEGA"
  },
  {
    "title": "Crash Bandicoot N. Sane Trilogy",
    "service": "humble_choice",
    "start": "2019-11-01",
    "steamAppId": 731490,
    "publisher": "Activision"
  },
  {
    "title": "Spyro Reignited Trilogy",
    "service": "humble_choice",
    "start": "2019-11-01",
    "steamAppId": 996580,
    "publisher": "Activision"
  },
  {
    "title": "Call of Duty: WWII",
    "service": "humble_choice",
    "start": "2019-11-01",
    "steamAppId": 476600,
    "publisher": "Activision"
  },
  {
    "title": "Soulcalibur VI",
    "service": "humble_choice",
    "start": "2019-12-06",
    "steamAppId": 544750,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Yakuza Kiwami",
    "service": "humble_choice",
    "start": "2019-12-06",
    "steamAppId": 834530,
    "publisher": "SEGA"
  },
  {
    "title": "My Time at Portia",
    "service": "humble_choice",
    "start": "2019-12-06",
    "steamAppId": 666140,
    "publisher": "Team17"
  },
  {
    "title": "Shadow of the Tomb Raider",
    "service": "humble_choice",
    "start": "2019-12-06",
    "steamAppId": 750920,
    "publisher": "Square Enix"
  },
  {
    "title": "Blasphemous",
    "service": "humble_choice",
    "start": "2019-12-06",
    "steamAppId": 774361,
    "publisher": "Team17"
  },
  {
    "title": "Middle-earth: Shadow of War",
    "service": "humble_choice",
    "start": "2020-01-03",
    "steamAppId": 356190,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Graveyard Keeper",
    "service": "humble_choice",
    "start": "2020-01-03",
    "steamAppId": 599140,
    "publisher": "tinyBuild"
  },
  {
    "title": "Two Point Hospital",
    "service": "humble_choice",
    "start": "2020-01-03",
    "steamAppId": 535930,
    "publisher": "SEGA"
  },
  {
    "title": "DiRT Rally 2.0",
    "service": "humble_choice",
    "start": "2020-01-03",
    "steamAppId": 690790,
    "publisher": "Codemasters"
  },
  {
    "title": "Street Fighter V",
    "service": "humble_choice",
    "start": "2020-01-03",
    "steamAppId": 310950,
    "publisher": "Capcom"
  },
  {
    "title": "Frostpunk",
    "service": "humble_choice",
    "start": "2020-02-07",
    "steamAppId": 323190,
    "publisher": "11 bit studios"
  },
  {
    "title": "Pathfinder: Kingmaker",
    "service": "humble_choice",
    "start": "2020-02-07",
    "steamAppId": 640820,
    "publisher": "Deep Silver"
  },
  {
    "title": "Okami HD",
    "service": "humble_choice",
    "start": "2020-02-07",
    "steamAppId": 587620,
    "publisher": "Capcom"
  },
  {
    "title": "My Friend Pedro",
    "service": "humble_choice",
    "start": "2020-03-06",
    "steamAppId": 557340,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Planet Coaster",
    "service": "humble_choice",
    "start": "2020-03-06",
    "steamAppId": 493340,
    "publisher": "Frontier Developments"
  },
  {
    "title": "F1 2019",
    "service": "humble_choice",
    "start": "2020-03-06",
    "steamAppId": 928600,
    "publisher": "Codemasters"
  },
  {
    "title": "HITMAN 2",
    "service": "humble_choice",
    "start": "2020-04-03",
    "steamAppId": 863550,
    "publisher": "IO Interactive"
  },
  {
    "title": "GRIS",
    "service": "humble_choice",
    "start": "2020-04-03",
    "steamAppId": 683320,
    "publisher": "Devolver Digital"
  },
  {
    "title": "This Is the Police 2",
    "service": "humble_choice",
    "start": "2020-04-03",
    "steamAppId": 785740,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Jurassic World Evolution",
    "service": "humble_choice",
    "start": "2020-05-01",
    "steamAppId": 648350,
    "publisher": "Frontier Developments"
  },
  {
    "title": "XCOM 2",
    "service": "humble_choice",
    "start": "2020-05-01",
    "steamAppId": 268500,
    "publisher": "2K"
  },
  {
    "title": "Warhammer 40,000: Gladius - Relics of War",
    "service": "humble_choice",
    "start": "2020-05-01",
    "steamAppId": 489630,
    "publisher": "Slitherine"
  },
  {
    "title": "Supraland",
    "service": "humble_choice",
    "start": "2020-06-05",
    "steamAppId": 813630,
    "publisher": "Humble Games"
  },
  {
    "title": "GRID",
    "service": "humble_choice",
    "start": "2020-06-05",
    "steamAppId": 703860,
    "publisher": "Codemasters"
  },
  {
    "title": "The Messenger",
    "service": "humble_choice",
    "start": "2020-06-05",
    "steamAppId": 764790,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Barotrauma",
    "service": "humble_choice",
    "start": "2020-06-05",
    "steamAppId": 602960,
    "publisher": "Daedalic Entertainment"
  },
  {
    "title": "Age of Wonders: Planetfall",
    "service": "humble_choice",
    "start": "2020-07-03",
    "steamAppId": 718850,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Void Bastards",
    "service": "humble_choice",
    "start": "2020-07-03",
    "steamAppId": 857980,
    "publisher": "Humble Games"
  },
  {
    "title": "Railway Empire",
    "service": "humble_choice",
    "start": "2020-07-03",
    "steamAppId": 503940,
    "publisher": "Kalypso Media"
  },
  {
    "title": "Vampyr",
    "service": "humble_choice",
    "start": "2020-08-07",
    "steamAppId": 427290,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Hello Neighbor",
    "service": "humble_choice",
    "start": "2020-08-07",
    "steamAppId": 521890,
    "publisher": "tinyBuild"
  },
  {
    "title": "Wargroove",
    "service": "humble_choice",
    "start": "2020-08-07",
    "steamAppId": 607050,
    "publisher": "Chucklefish"
  },
  {
    "title": "Call of Cthulhu",
    "service": "humble_choice",
    "start": "2020-08-07",
    "steamAppId": 399810,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Golf With Your Friends",
    "service": "humble_choice",
    "start": "2020-09-04",
    "steamAppId": 431240,
    "publisher": "Team17"
  },
  {
    "title": "Generation Zero",
    "service": "humble_choice",
    "start": "2020-09-04",
    "steamAppId": 704270,
    "publisher": "Avalanche Studios"
  },
  {
    "title": "Forager",
    "service": "humble_choice",
    "start": "2020-09-04",
    "steamAppId": 751780,
    "publisher": "Humble Games"
  },
  {
    "title": "Strange Brigade",
    "service": "humble_choice",
    "start": "2020-09-04",
    "steamAppId": 312670,
    "publisher": "Rebellion"
  },
  {
    "title": "Catherine Classic",
    "service": "humble_choice",
    "start": "2020-09-04",
    "steamAppId": 893180,
    "publisher": "SEGA"
  },
  {
    "title": "Tropico 6",
    "service": "humble_choice",
    "start": "2020-10-02",
    "steamAppId": 492720,
    "publisher": "Kalypso Media"
  },
  {
    "title": "Fae Tactics",
    "service": "humble_choice",
    "start": "2020-10-02",
    "steamAppId": 995980,
    "publisher": "Humble Games"
  },
  {
    "title": "Sunless Skies",
    "service": "humble_choice",
    "start": "2020-10-02",
    "steamAppId": 596970,
    "publisher": "Failbetter Games"
  },
  {
    "title": "Darksiders III",
    "service": "humble_choice",
    "start": "2020-11-06",
    "steamAppId": 606280,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Yakuza Kiwami 2",
    "service": "humble_choice",
    "start": "2020-11-06",
    "steamAppId": 927380,
    "publisher": "SEGA"
  },
  {
    "title": "Imperator: Rome",
    "service": "humble_choice",
    "start": "2020-11-06",
    "steamAppId": 859580,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Crying Suns",
    "service": "humble_choice",
    "start": "2020-11-06",
    "steamAppId": 873940,
    "publisher": "Humble Games"
  },
  {
    "title": "Overcooked! 2",
    "service": "humble_choice",
    "start": "2020-12-04",
    "steamAppId": 728880,
    "publisher": "Team17"
  },
  {
    "title": "Children of Morta",
    "service": "humble_choice",
    "start": "2020-12-04",
    "steamAppId": 330020,
    "publisher": "11 bit studios"
  },
  {
    "title": "One Step From Eden",
    "service": "humble_choice",
    "start": "2020-12-04",
    "steamAppId": 960690,
    "publisher": "Humble Games"
  },
  {
    "title": "Indivisible",
    "service": "humble_choice",
    "start": "2020-12-04",
    "steamAppId": 421170,
    "publisher": "505 Games"
  },
  {
    "title": "Ancestors: The Humankind Odyssey",
    "service": "humble_choice",
    "start": "2021-01-01",
    "steamAppId": 536270,
    "publisher": "Private Division"
  },
  {
    "title": "PC Building Simulator",
    "service": "humble_choice",
    "start": "2021-01-01",
    "steamAppId": 621060,
    "publisher": "The Irregular Corporation"
  },
  {
    "title": "Warhammer: Chaosbane",
    "service": "humble_choice",
    "start": "2021-01-01",
    "steamAppId": 774241,
    "publisher": "Nacon"
  },
  {
    "title": "Outward",
    "service": "humble_choice",
    "start": "2021-02-05",
    "steamAppId": 794260,
    "publisher": "Deep Silver"
  },
  {
    "title": "Valkyria Chronicles 4 Complete Edition",
    "service": "humble_choice",
    "start": "2021-02-05",
    "steamAppId": 790820,
    "publisher": "SEGA"
  },
  {
    "title": "Endless Space 2",
    "service": "humble_choice",
    "start": "2021-02-05",
    "steamAppId": 392110,
    "publisher": "SEGA"
  },
  {
    "title": "Moving Out",
    "service": "humble_choice",
    "start": "2021-02-05",
    "steamAppId": 996770,
    "publisher": "Team17"
  },
  {
    "title": "Control",
    "service": "humble_choice",
    "start": "2021-03-05",
    "steamAppId": 870780,
    "publisher": "505 Games"
  },
  {
    "title": "XCOM: Chimera Squad",
    "service": "humble_choice",
    "start": "2021-03-05",
    "steamAppId": 882100,
    "publisher": "2K"
  },
  {
    "title": "ELEX",
    "service": "humble_choice",
    "start": "2021-03-05",
    "steamAppId": 411300,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Kingdom Two Crowns",
    "service": "humble_choice",
    "start": "2021-03-05",
    "steamAppId": 701160,
    "publisher": "Raw Fury"
  },
  {
    "title": "Sniper Ghost Warrior Contracts",
    "service": "humble_choice",
    "start": "2021-04-02",
    "steamAppId": 973580,
    "publisher": "CI Games"
  },
  {
    "title": "F1 2020",
    "service": "humble_choice",
    "start": "2021-04-02",
    "steamAppId": 1080110,
    "publisher": "Codemasters"
  },
  {
    "title": "Shenmue III",
    "service": "humble_choice",
    "start": "2021-04-02",
    "steamAppId": 878670,
    "publisher": "Deep Silver"
  },
  {
    "title": "Metro Exodus",
    "service": "humble_choice",
    "start": "2021-05-07",
    "steamAppId": 412020,
    "publisher": "Deep Silver"
  },
  {
    "title": "Darksiders Genesis",
    "service": "humble_choice",
    "start": "2021-05-07",
    "steamAppId": 710920,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Hellpoint",
    "service": "humble_choice",
    "start": "2021-05-07",
    "steamAppId": 628670,
    "publisher": "tinyBuild"
  },
  {
    "title": "Civilization VI Platinum Edition",
    "service": "humble_choice",
    "start": "2021-06-04",
    "steamAppId": 289070,
    "publisher": "2K"
  },
  {
    "title": "Secret Neighbor",
    "service": "humble_choice",
    "start": "2021-06-04",
    "steamAppId": 859570,
    "publisher": "tinyBuild"
  },
  {
    "title": "Going Under",
    "service": "humble_choice",
    "start": "2021-06-04",
    "steamAppId": 1154810,
    "publisher": "Team17"
  },
  {
    "title": "Yakuza 3 Remastered",
    "service": "humble_choice",
    "start": "2021-07-02",
    "steamAppId": 1088710,
    "publisher": "SEGA"
  },
  {
    "title": "The Surge 2",
    "service": "humble_choice",
    "start": "2021-07-02",
    "steamAppId": 644830,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "DIRT 5",
    "service": "humble_choice",
    "start": "2021-07-02",
    "steamAppId": 1038250,
    "publisher": "Codemasters"
  },
  {
    "title": "Bloodstained: Ritual of the Night",
    "service": "humble_choice",
    "start": "2021-08-06",
    "steamAppId": 692850,
    "publisher": "505 Games"
  },
  {
    "title": "Last Oasis",
    "service": "humble_choice",
    "start": "2021-08-06",
    "steamAppId": 903950,
    "publisher": "Donkey Crew"
  },
  {
    "title": "Superliminal",
    "service": "humble_choice",
    "start": "2021-08-06",
    "steamAppId": 1049410,
    "publisher": "Pillow Castle"
  },
  {
    "title": "PGA TOUR 2K21",
    "service": "humble_choice",
    "start": "2021-09-07",
    "steamAppId": 1016120,
    "publisher": "2K"
  },
  {
    "title": "Neon Abyss",
    "service": "humble_choice",
    "start": "2021-09-07",
    "steamAppId": 788100,
    "publisher": "Team17"
  },
  {
    "title": "Not For Broadcast",
    "service": "humble_choice",
    "start": "2021-09-07",
    "steamAppId": 1147550,
    "publisher": "tinyBuild"
  },
  {
    "title": "Katana ZERO",
    "service": "humble_choice",
    "start": "2021-10-05",
    "steamAppId": 460950,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Amnesia: Rebirth",
    "service": "humble_choice",
    "start": "2021-10-05",
    "steamAppId": 999220,
    "publisher": "Frictional Games"
  },
  {
    "title": "John Wick Hex",
    "service": "humble_choice",
    "start": "2021-10-05",
    "steamAppId": 1405790,
    "publisher": "Good Shepherd Entertainment"
  },
  {
    "title": "Due Process",
    "service": "humble_choice",
    "start": "2021-11-02",
    "steamAppId": 753650,
    "publisher": "Annapurna Interactive"
  },
  {
    "title": "House Flipper",
    "service": "humble_choice",
    "start": "2021-11-02",
    "steamAppId": 613100,
    "publisher": "PlayWay"
  },
  {
    "title": "Project Wingman",
    "service": "humble_choice",
    "start": "2021-11-02",
    "steamAppId": 895870,
    "publisher": "Humble Games"
  },
  {
    "title": "BPM: BULLETS PER MINUTE",
    "service": "humble_choice",
    "start": "2021-11-02",
    "steamAppId": 1286350,
    "publisher": "Playtonic Friends"
  },
  {
    "title": "Maneater",
    "service": "humble_choice",
    "start": "2021-12-07",
    "steamAppId": 629820,
    "publisher": "Tripwire Interactive"
  },
  {
    "title": "MORDHAU",
    "service": "humble_choice",
    "start": "2021-12-07",
    "steamAppId": 629760,
    "publisher": "Triternion"
  },
  {
    "title": "Endzone - A World Apart",
    "service": "humble_choice",
    "start": "2021-12-07",
    "steamAppId": 933820,
    "publisher": "Assemble Entertainment"
  },
  {
    "title": "Mafia: Definitive Edition",
    "service": "humble_choice",
    "start": "2022-01-04",
    "steamAppId": 1030840,
    "publisher": "2K"
  },
  {
    "title": "Iron Harvest",
    "service": "humble_choice",
    "start": "2022-01-04",
    "steamAppId": 826630,
    "publisher": "Deep Silver"
  },
  {
    "title": "Project Winter",
    "service": "humble_choice",
    "start": "2022-01-04",
    "steamAppId": 774861,
    "publisher": "Other Ocean"
  },
  {
    "title": "Borderlands 3",
    "service": "humble_choice",
    "start": "2022-02-01",
    "steamAppId": 397540,
    "publisher": "2K"
  },
  {
    "title": "Black Book",
    "service": "humble_choice",
    "start": "2022-02-01",
    "steamAppId": 1138660,
    "publisher": "HypeTrain Digital"
  },
  {
    "title": "Per Aspera",
    "service": "humble_choice",
    "start": "2022-02-01",
    "steamAppId": 803050,
    "publisher": "Raw Fury"
  },
  {
    "title": "Desperados III",
    "service": "humble_choice",
    "start": "2022-03-01",
    "steamAppId": 610370,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Mass Effect Legendary Edition",
    "service": "humble_choice",
    "start": "2022-03-01",
    "steamAppId": 1328670,
    "publisher": "Electronic Arts"
  },
  {
    "title": "The Dark Pictures Anthology: Man of Medan",
    "service": "humble_choice",
    "start": "2022-03-01",
    "steamAppId": 939850,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Ghostrunner",
    "service": "humble_choice",
    "start": "2022-04-05",
    "steamAppId": 1139900,
    "publisher": "505 Games"
  },
  {
    "title": "Destroy All Humans!",
    "service": "humble_choice",
    "start": "2022-04-05",
    "steamAppId": 803330,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Monster Sanctuary",
    "service": "humble_choice",
    "start": "2022-04-05",
    "steamAppId": 814370,
    "publisher": "Team17"
  },
  {
    "title": "Planet Zoo",
    "service": "humble_choice",
    "start": "2022-05-03",
    "steamAppId": 703080,
    "publisher": "Frontier Developments"
  },
  {
    "title": "SpongeBob SquarePants: Battle for Bikini Bottom - Rehydrated",
    "service": "humble_choice",
    "start": "2022-05-03",
    "steamAppId": 969990,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Star Wars Squadrons",
    "service": "humble_choice",
    "start": "2022-06-07",
    "steamAppId": 1222730,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Phoenix Point: Year One Edition",
    "service": "humble_choice",
    "start": "2022-06-07",
    "steamAppId": 839770,
    "publisher": "Snapshot Games"
  },
  {
    "title": "Call of the Sea",
    "service": "humble_choice",
    "start": "2022-06-07",
    "steamAppId": 1042490,
    "publisher": "Raw Fury"
  },
  {
    "title": "Deep Rock Galactic",
    "service": "humble_choice",
    "start": "2022-07-05",
    "steamAppId": 548430,
    "publisher": "Coffee Stain Publishing"
  },
  {
    "title": "Necromunda: Hired Gun",
    "service": "humble_choice",
    "start": "2022-07-05",
    "steamAppId": 1222370,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Lawn Mowing Simulator",
    "service": "humble_choice",
    "start": "2022-07-05",
    "steamAppId": 1480560,
    "publisher": "Curve Games"
  },
  {
    "title": "The Ascent",
    "service": "humble_choice",
    "start": "2022-08-02",
    "steamAppId": 979690,
    "publisher": "Curve Games"
  },
  {
    "title": "Hot Wheels Unleashed",
    "service": "humble_choice",
    "start": "2022-08-02",
    "steamAppId": 1271700,
    "publisher": "Milestone"
  },
  {
    "title": "A Plague Tale: Innocence",
    "service": "humble_choice",
    "start": "2022-08-02",
    "steamAppId": 752590,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Crusader Kings III",
    "service": "humble_choice",
    "start": "2022-09-06",
    "steamAppId": 1158310,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Just Cause 4 Complete Edition",
    "service": "humble_choice",
    "start": "2022-09-06",
    "steamAppId": 517630,
    "publisher": "Square Enix"
  },
  {
    "title": "The Dungeon Of Naheulbeuk: The Amulet Of Chaos",
    "service": "humble_choice",
    "start": "2022-09-06",
    "steamAppId": 970830,
    "publisher": "Dear Villagers"
  },
  {
    "title": "DEATHLOOP",
    "service": "humble_choice",
    "start": "2022-10-04",
    "steamAppId": 1252330,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Monster Train",
    "service": "humble_choice",
    "start": "2022-10-04",
    "steamAppId": 1102190,
    "publisher": "Good Shepherd Entertainment"
  },
  {
    "title": "The Dark Pictures Anthology: Little Hope",
    "service": "humble_choice",
    "start": "2022-10-04",
    "steamAppId": 1194630,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Hell Let Loose",
    "service": "humble_choice",
    "start": "2022-11-01",
    "steamAppId": 686810,
    "publisher": "Team17"
  },
  {
    "title": "Kingdoms of Amalur: Re-Reckoning",
    "service": "humble_choice",
    "start": "2022-11-01",
    "steamAppId": 1041720,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Shadow Tactics: Aikos Choice",
    "service": "humble_choice",
    "start": "2022-11-01",
    "steamAppId": 1579380,
    "publisher": "Daedalic Entertainment"
  },
  {
    "title": "Wasteland 3",
    "service": "humble_choice",
    "start": "2022-12-06",
    "steamAppId": 719040,
    "publisher": "inXile Entertainment"
  },
  {
    "title": "GreedFall",
    "service": "humble_choice",
    "start": "2022-12-06",
    "steamAppId": 606880,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "TOEM",
    "service": "humble_choice",
    "start": "2022-12-06",
    "steamAppId": 1307580,
    "publisher": "Something We Made"
  },
  {
    "title": "DOOM Eternal",
    "service": "humble_choice",
    "start": "2023-01-03",
    "steamAppId": 782330,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Tribes of Midgard",
    "service": "humble_choice",
    "start": "2023-01-03",
    "steamAppId": 858820,
    "publisher": "Gearbox Publishing"
  },
  {
    "title": "OlliOlli World",
    "service": "humble_choice",
    "start": "2023-01-03",
    "steamAppId": 1190170,
    "publisher": "Private Division"
  },
  {
    "title": "Pathfinder: Wrath of the Righteous",
    "service": "humble_choice",
    "start": "2023-02-07",
    "steamAppId": 1184370,
    "publisher": "META Publishing"
  },
  {
    "title": "Fallout 76",
    "service": "humble_choice",
    "start": "2023-02-07",
    "steamAppId": 1151340,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Thronebreaker: The Witcher Tales",
    "service": "humble_choice",
    "start": "2023-02-07",
    "steamAppId": 973760,
    "publisher": "CD PROJEKT RED"
  },
  {
    "title": "Biomutant",
    "service": "humble_choice",
    "start": "2023-03-07",
    "steamAppId": 597820,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Jurassic World Evolution 2",
    "service": "humble_choice",
    "start": "2023-03-07",
    "steamAppId": 1244460,
    "publisher": "Frontier Developments"
  },
  {
    "title": "DEATH STRANDING DIRECTORS CUT",
    "service": "humble_choice",
    "start": "2023-04-04",
    "steamAppId": 1850570,
    "publisher": "505 Games"
  },
  {
    "title": "Aliens: Fireteam Elite",
    "service": "humble_choice",
    "start": "2023-04-04",
    "steamAppId": 1549970,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Rollerdrome",
    "service": "humble_choice",
    "start": "2023-04-04",
    "steamAppId": 1294420,
    "publisher": "Private Division"
  },
  {
    "title": "Life is Strange: True Colors",
    "service": "humble_choice",
    "start": "2023-04-04",
    "steamAppId": 936790,
    "publisher": "Square Enix"
  },
  {
    "title": "Warhammer 40,000: Chaos Gate - Daemonhunters",
    "service": "humble_choice",
    "start": "2023-05-02",
    "steamAppId": 1611910,
    "publisher": "Frontier Foundry"
  },
  {
    "title": "Spiritfarer: Farewell Edition",
    "service": "humble_choice",
    "start": "2023-05-02",
    "steamAppId": 972660,
    "publisher": "Thunder Lotus Games"
  },
  {
    "title": "Bendy and the Dark Revival",
    "service": "humble_choice",
    "start": "2023-05-02",
    "steamAppId": 1063660,
    "publisher": "Joey Drew Studios"
  },
  {
    "title": "Ghostwire: Tokyo",
    "service": "humble_choice",
    "start": "2023-06-06",
    "steamAppId": 1475810,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Remnant: From the Ashes",
    "service": "humble_choice",
    "start": "2023-06-06",
    "steamAppId": 617290,
    "publisher": "Gearbox Publishing"
  },
  {
    "title": "Curse of the Dead Gods",
    "service": "humble_choice",
    "start": "2023-06-06",
    "steamAppId": 1123770,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "The Outer Worlds: Spacers Choice Edition",
    "service": "humble_choice",
    "start": "2023-07-04",
    "steamAppId": 1920490,
    "publisher": "Private Division"
  },
  {
    "title": "Temtem",
    "service": "humble_choice",
    "start": "2023-07-04",
    "steamAppId": 745920,
    "publisher": "Humble Games"
  },
  {
    "title": "Yakuza 4 Remastered",
    "service": "humble_choice",
    "start": "2023-07-04",
    "steamAppId": 1105500,
    "publisher": "SEGA"
  },
  {
    "title": "Disco Elysium - The Final Cut",
    "service": "humble_choice",
    "start": "2023-08-01",
    "steamAppId": 632470,
    "publisher": "ZA/UM"
  },
  {
    "title": "Chivalry 2",
    "service": "humble_choice",
    "start": "2023-08-01",
    "steamAppId": 1824220,
    "publisher": "Tripwire Presents"
  },
  {
    "title": "Road 96",
    "service": "humble_choice",
    "start": "2023-08-01",
    "steamAppId": 1466640,
    "publisher": "DigixArt"
  },
  {
    "title": "Trek to Yomi",
    "service": "humble_choice",
    "start": "2023-08-01",
    "steamAppId": 1370050,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Tiny Tinas Wonderlands",
    "service": "humble_choice",
    "start": "2023-09-05",
    "steamAppId": 1286680,
    "publisher": "2K"
  },
  {
    "title": "Deceive Inc.",
    "service": "humble_choice",
    "start": "2023-09-05",
    "steamAppId": 820520,
    "publisher": "Tripwire Presents"
  },
  {
    "title": "The Forgotten City",
    "service": "humble_choice",
    "start": "2023-09-05",
    "steamAppId": 874260,
    "publisher": "Dear Villagers"
  },
  {
    "title": "The Quarry",
    "service": "humble_choice",
    "start": "2023-10-03",
    "steamAppId": 1577120,
    "publisher": "2K"
  },
  {
    "title": "Metal: Hellsinger",
    "service": "humble_choice",
    "start": "2023-10-03",
    "steamAppId": 1061910,
    "publisher": "Funcom"
  },
  {
    "title": "Dark Pictures Anthology: House of Ashes",
    "service": "humble_choice",
    "start": "2023-10-03",
    "steamAppId": 1281590,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Hardspace: Shipbreaker",
    "service": "humble_choice",
    "start": "2023-11-07",
    "steamAppId": 1161580,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "WWE 2K23",
    "service": "humble_choice",
    "start": "2023-11-07",
    "steamAppId": 1942660,
    "publisher": "2K"
  },
  {
    "title": "Unpacking",
    "service": "humble_choice",
    "start": "2023-11-07",
    "steamAppId": 1135690,
    "publisher": "Humble Games"
  },
  {
    "title": "Expeditions: Rome",
    "service": "humble_choice",
    "start": "2023-12-05",
    "steamAppId": 987840,
    "publisher": "THQ Nordic"
  },
  {
    "title": "ELEX II",
    "service": "humble_choice",
    "start": "2023-12-05",
    "steamAppId": 900040,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Nobody Saves the World",
    "service": "humble_choice",
    "start": "2023-12-05",
    "steamAppId": 1432050,
    "publisher": "DrinkBox Studios"
  },
  {
    "title": "Marvels Midnight Suns",
    "service": "humble_choice",
    "start": "2024-01-02",
    "steamAppId": 368260,
    "publisher": "2K"
  },
  {
    "title": "Two Point Campus",
    "service": "humble_choice",
    "start": "2024-01-02",
    "steamAppId": 1649080,
    "publisher": "SEGA"
  },
  {
    "title": "Aragami 2",
    "service": "humble_choice",
    "start": "2024-01-02",
    "steamAppId": 1158370,
    "publisher": "Lince Works"
  },
  {
    "title": "Life is Strange: True Colors",
    "service": "humble_choice",
    "start": "2024-02-06",
    "steamAppId": 936790,
    "publisher": "Square Enix"
  },
  {
    "title": "Scorn",
    "service": "humble_choice",
    "start": "2024-02-06",
    "steamAppId": 698670,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "Destroy All Humans! 2 - Reprobed",
    "service": "humble_choice",
    "start": "2024-02-06",
    "steamAppId": 1266700,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Warhammer Age of Sigmar: Realms of Ruin",
    "service": "humble_choice",
    "start": "2024-03-05",
    "steamAppId": 1844380,
    "publisher": "Frontier Developments"
  },
  {
    "title": "Nioh 2 - The Complete Edition",
    "service": "humble_choice",
    "start": "2024-03-05",
    "steamAppId": 1325200,
    "publisher": "KOEI TECMO"
  },
  {
    "title": "Saints Row",
    "service": "humble_choice",
    "start": "2024-03-05",
    "steamAppId": 742420,
    "publisher": "Deep Silver"
  },
  {
    "title": "Citizen Sleeper",
    "service": "humble_choice",
    "start": "2024-03-05",
    "steamAppId": 1578650,
    "publisher": "Fellow Traveller"
  },
  {
    "title": "Victoria 3",
    "service": "humble_choice",
    "start": "2024-04-02",
    "steamAppId": 529340,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "The Callisto Protocol",
    "service": "humble_choice",
    "start": "2024-04-02",
    "steamAppId": 1544020,
    "publisher": "Krafton"
  },
  {
    "title": "HUMANKIND",
    "service": "humble_choice",
    "start": "2024-04-02",
    "steamAppId": 1124300,
    "publisher": "SEGA"
  },
  {
    "title": "Hi-Fi RUSH",
    "service": "humble_choice",
    "start": "2024-05-07",
    "steamAppId": 1817230,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Yakuza: Like a Dragon",
    "service": "humble_choice",
    "start": "2024-05-07",
    "steamAppId": 1235140,
    "publisher": "SEGA"
  },
  {
    "title": "Steelrising",
    "service": "humble_choice",
    "start": "2024-05-07",
    "steamAppId": 1283400,
    "publisher": "Nacon"
  },
  {
    "title": "Risk of Rain 2",
    "service": "humble_choice",
    "start": "2024-06-04",
    "steamAppId": 632360,
    "publisher": "Gearbox Publishing"
  },
  {
    "title": "Knights of Honor II: Sovereign",
    "service": "humble_choice",
    "start": "2024-06-04",
    "steamAppId": 736820,
    "publisher": "THQ Nordic"
  },
  {
    "title": "LEGO 2K Drive",
    "service": "humble_choice",
    "start": "2024-06-04",
    "steamAppId": 1451810,
    "publisher": "2K"
  },
  {
    "title": "A Plague Tale: Requiem",
    "service": "humble_choice",
    "start": "2024-07-02",
    "steamAppId": 1182900,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Ghostrunner 2",
    "service": "humble_choice",
    "start": "2024-07-02",
    "steamAppId": 2144740,
    "publisher": "505 Games"
  },
  {
    "title": "Starship Troopers: Terran Command",
    "service": "humble_choice",
    "start": "2024-07-02",
    "steamAppId": 1202130,
    "publisher": "Slitherine"
  },
  {
    "title": "Sifu",
    "service": "humble_choice",
    "start": "2024-08-06",
    "steamAppId": 2138710,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "High On Life",
    "service": "humble_choice",
    "start": "2024-08-06",
    "steamAppId": 1583230,
    "publisher": "Squanch Games"
  },
  {
    "title": "Gotham Knights",
    "service": "humble_choice",
    "start": "2024-08-06",
    "steamAppId": 1496790,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "BLACKTAIL",
    "service": "humble_choice",
    "start": "2024-08-06",
    "steamAppId": 1532690,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Marvels Guardians of the Galaxy",
    "service": "humble_choice",
    "start": "2024-09-03",
    "steamAppId": 1088850,
    "publisher": "Square Enix"
  },
  {
    "title": "Stranded: Alien Dawn",
    "service": "humble_choice",
    "start": "2024-09-03",
    "steamAppId": 1324130,
    "publisher": "Frontier Foundry"
  },
  {
    "title": "Coral Island",
    "service": "humble_choice",
    "start": "2024-09-03",
    "steamAppId": 1158160,
    "publisher": "Humble Games"
  },
  {
    "title": "Astrea: Six-Sided Oracles",
    "service": "humble_choice",
    "start": "2024-09-03",
    "steamAppId": 1755830,
    "publisher": "Akupara Games"
  },
  {
    "title": "Remnant II",
    "service": "humble_choice",
    "start": "2024-10-01",
    "steamAppId": 1282100,
    "publisher": "Gearbox Publishing"
  },
  {
    "title": "Persona 5 Strikers",
    "service": "humble_choice",
    "start": "2024-10-01",
    "steamAppId": 1382330,
    "publisher": "SEGA"
  },
  {
    "title": "Jusant",
    "service": "humble_choice",
    "start": "2024-10-01",
    "steamAppId": 1977170,
    "publisher": "DON'T NOD"
  },
  {
    "title": "Dome Keeper",
    "service": "humble_choice",
    "start": "2024-10-01",
    "steamAppId": 1637320,
    "publisher": "Raw Fury"
  },
  {
    "title": "Warhammer 40,000: Darktide",
    "service": "humble_choice",
    "start": "2024-11-05",
    "steamAppId": 1361210,
    "publisher": "Fatshark"
  },
  {
    "title": "Persona 4 Golden",
    "service": "humble_choice",
    "start": "2024-11-05",
    "steamAppId": 1113000,
    "publisher": "SEGA"
  },
  {
    "title": "The Lamplighters League",
    "service": "humble_choice",
    "start": "2024-11-05",
    "steamAppId": 1167750,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Cassette Beasts",
    "service": "humble_choice",
    "start": "2024-11-05",
    "steamAppId": 1321440,
    "publisher": "Raw Fury"
  },
  {
    "title": "Bomb Rush Cyberfunk",
    "service": "humble_choice",
    "start": "2024-12-03",
    "steamAppId": 1353230,
    "publisher": "Team Reptile"
  },
  {
    "title": "Old World",
    "service": "humble_choice",
    "start": "2024-12-03",
    "steamAppId": 597180,
    "publisher": "Hooded Horse"
  },
  {
    "title": "Atlas Fallen: Reign of Sand",
    "service": "humble_choice",
    "start": "2024-12-03",
    "steamAppId": 1230530,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Crime Boss: Rockay City",
    "service": "humble_choice",
    "start": "2024-12-03",
    "steamAppId": 2933080,
    "publisher": "505 Games"
  },
  {
    "title": "Against the Storm",
    "service": "humble_choice",
    "start": "2025-01-07",
    "steamAppId": 1336490,
    "publisher": "Hooded Horse"
  },
  {
    "title": "Jagged Alliance 3",
    "service": "humble_choice",
    "start": "2025-01-07",
    "steamAppId": 1084160,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Blasphemous 2",
    "service": "humble_choice",
    "start": "2025-01-07",
    "steamAppId": 2114740,
    "publisher": "Team17"
  },
  {
    "title": "Immortals of Aveum",
    "service": "humble_choice",
    "start": "2025-02-04",
    "steamAppId": 2009100,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Trepang2",
    "service": "humble_choice",
    "start": "2025-02-04",
    "steamAppId": 1164940,
    "publisher": "Team17"
  },
  {
    "title": "Total War: PHARAOH DYNASTIES",
    "service": "humble_choice",
    "start": "2025-02-04",
    "steamAppId": 2951630,
    "publisher": "SEGA"
  },
  {
    "title": "Persona 5 Royal",
    "service": "humble_choice",
    "start": "2025-08-05",
    "steamAppId": 1687950,
    "publisher": "SEGA"
  },
  {
    "title": "Banishers: Ghosts of New Eden",
    "service": "humble_choice",
    "start": "2025-08-05",
    "steamAppId": 1493640,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "My Time at Sandrock",
    "service": "humble_choice",
    "start": "2025-08-05",
    "steamAppId": 1084600,
    "publisher": "Pathea Games"
  },
  {
    "title": "Total War: WARHAMMER III",
    "service": "humble_choice",
    "start": "2025-11-04",
    "steamAppId": 1142710,
    "publisher": "SEGA"
  },
  {
    "title": "Another Crabs Treasure",
    "service": "humble_choice",
    "start": "2025-11-04",
    "steamAppId": 1887840,
    "publisher": "Aggro Crab"
  },
  {
    "title": "No More Heroes 3",
    "service": "humble_choice",
    "start": "2025-11-04",
    "steamAppId": 1744330,
    "publisher": "Marvelous"
  },
  {
    "title": "Like a Dragon Gaiden: The Man Who Erased His Name",
    "service": "humble_choice",
    "start": "2025-12-02",
    "steamAppId": 2375550,
    "publisher": "SEGA"
  },
  {
    "title": "Nine Sols",
    "service": "humble_choice",
    "start": "2025-12-02",
    "steamAppId": 1809540,
    "publisher": "RedCandleGames"
  },
  {
    "title": "Streets of Rage 4",
    "service": "humble_choice",
    "start": "2025-12-02",
    "steamAppId": 985890,
    "publisher": "Dotemu"
  },
  {
    "title": "STAR WARS: Squadrons",
    "service": "prime",
    "start": "2021-10-01",
    "steamAppId": 1222730,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Alien: Isolation",
    "service": "prime",
    "start": "2021-10-01",
    "steamAppId": 214490,
    "publisher": "SEGA"
  },
  {
    "title": "Ghostrunner",
    "service": "prime",
    "start": "2021-10-01",
    "steamAppId": 1139900,
    "publisher": "505 Games"
  },
  {
    "title": "Dragon Age: Inquisition",
    "service": "prime",
    "start": "2021-11-01",
    "steamAppId": 1222690,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Control Ultimate Edition",
    "service": "prime",
    "start": "2021-11-01",
    "steamAppId": 870780,
    "publisher": "505 Games"
  },
  {
    "title": "Rise of the Tomb Raider",
    "service": "prime",
    "start": "2021-11-01",
    "steamAppId": 391220,
    "publisher": "Square Enix"
  },
  {
    "title": "Need for Speed Hot Pursuit Remastered",
    "service": "prime",
    "start": "2021-12-01",
    "steamAppId": 1328660,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Frostpunk",
    "service": "prime",
    "start": "2021-12-01",
    "steamAppId": 323190,
    "publisher": "11 bit studios"
  },
  {
    "title": "Journey to the Savage Planet",
    "service": "prime",
    "start": "2021-12-01",
    "steamAppId": 973810,
    "publisher": "505 Games"
  },
  {
    "title": "STAR WARS Jedi: Fallen Order",
    "service": "prime",
    "start": "2022-01-03",
    "steamAppId": 1172380,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Total War: WARHAMMER",
    "service": "prime",
    "start": "2022-01-03",
    "steamAppId": 364360,
    "publisher": "SEGA"
  },
  {
    "title": "World War Z: Aftermath",
    "service": "prime",
    "start": "2022-01-03",
    "steamAppId": 699130,
    "publisher": "Saber Interactive"
  },
  {
    "title": "Stellaris",
    "service": "prime",
    "start": "2022-02-01",
    "steamAppId": 281990,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Madden NFL 22",
    "service": "prime",
    "start": "2022-03-01",
    "steamAppId": 1519350,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Surviving Mars",
    "service": "prime",
    "start": "2022-03-01",
    "steamAppId": 464920,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "The Elder Scrolls IV: Oblivion Game of the Year Edition Deluxe",
    "service": "prime",
    "start": "2022-04-01",
    "steamAppId": 900883,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Plants vs. Zombies: Battle for Neighborville",
    "service": "prime",
    "start": "2022-04-01",
    "steamAppId": 1262240,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Dead Space 2",
    "service": "prime",
    "start": "2022-05-02",
    "steamAppId": 47780,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Far Cry 4",
    "service": "prime",
    "start": "2022-06-01",
    "steamAppId": 298110,
    "publisher": "Ubisoft"
  },
  {
    "title": "Mass Effect Legendary Edition",
    "service": "prime",
    "start": "2022-07-12",
    "steamAppId": 1328670,
    "publisher": "Electronic Arts"
  },
  {
    "title": "GRID Legends",
    "service": "prime",
    "start": "2022-07-12",
    "steamAppId": 1307710,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Need for Speed Heat",
    "service": "prime",
    "start": "2022-07-12",
    "steamAppId": 1222680,
    "publisher": "Electronic Arts"
  },
  {
    "title": "StarCraft: Remastered",
    "service": "prime",
    "start": "2022-08-01",
    "publisher": "Blizzard"
  },
  {
    "title": "Assassins Creed Origins",
    "service": "prime",
    "start": "2022-09-01",
    "steamAppId": 582160,
    "publisher": "Ubisoft"
  },
  {
    "title": "Middle-earth: Shadow of Mordor Game of the Year Edition",
    "service": "prime",
    "start": "2022-09-01",
    "steamAppId": 241930,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Football Manager 2022",
    "service": "prime",
    "start": "2022-09-01",
    "steamAppId": 1569040,
    "publisher": "SEGA"
  },
  {
    "title": "Fallout 76",
    "service": "prime",
    "start": "2022-10-03",
    "steamAppId": 1151340,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Middle-earth: Shadow of War",
    "service": "prime",
    "start": "2022-10-03",
    "steamAppId": 356190,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Total War: WARHAMMER II",
    "service": "prime",
    "start": "2022-10-03",
    "steamAppId": 594570,
    "publisher": "SEGA"
  },
  {
    "title": "Fallout: New Vegas Ultimate Edition",
    "service": "prime",
    "start": "2022-11-01",
    "steamAppId": 22380,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "WRC 9 FIA World Rally Championship",
    "service": "prime",
    "start": "2022-11-01",
    "steamAppId": 1267540,
    "publisher": "Nacon"
  },
  {
    "title": "Quake",
    "service": "prime",
    "start": "2022-12-01",
    "steamAppId": 2310,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Dishonored 2",
    "service": "prime",
    "start": "2022-12-01",
    "steamAppId": 403640,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "The Evil Within 2",
    "service": "prime",
    "start": "2023-01-03",
    "steamAppId": 601430,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "The Elder Scrolls III: Morrowind GOTY Edition",
    "service": "prime",
    "start": "2023-02-02",
    "steamAppId": 22320,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Baldur's Gate: Enhanced Edition",
    "service": "prime",
    "start": "2023-03-02",
    "steamAppId": 228280,
    "publisher": "Beamdog"
  },
  {
    "title": "Wolfenstein: The New Order",
    "service": "prime",
    "start": "2023-04-06",
    "steamAppId": 201810,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "STAR WARS: Rogue Squadron 3D",
    "service": "prime",
    "start": "2023-05-04",
    "steamAppId": 455910,
    "publisher": "LucasArts"
  },
  {
    "title": "Planetary Annihilation: TITANS",
    "service": "prime",
    "start": "2023-05-04",
    "steamAppId": 386070,
    "publisher": "Uber Entertainment"
  },
  {
    "title": "Neverwinter Nights: Enhanced Edition",
    "service": "prime",
    "start": "2023-06-01",
    "steamAppId": 704450,
    "publisher": "Beamdog"
  },
  {
    "title": "Prey",
    "service": "prime",
    "start": "2023-07-11",
    "steamAppId": 480490,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Baldur's Gate II: Enhanced Edition",
    "service": "prime",
    "start": "2023-07-11",
    "steamAppId": 257350,
    "publisher": "Beamdog"
  },
  {
    "title": "STAR WARS: The Force Unleashed",
    "service": "prime",
    "start": "2023-07-11",
    "steamAppId": 32430,
    "publisher": "LucasArts"
  },
  {
    "title": "PayDay 2",
    "service": "prime",
    "start": "2023-08-03",
    "steamAppId": 218620,
    "publisher": "Starbreeze"
  },
  {
    "title": "Quake 4",
    "service": "prime",
    "start": "2023-08-03",
    "steamAppId": 2210,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Football Manager 2023",
    "service": "prime",
    "start": "2023-09-07",
    "steamAppId": 1904540,
    "publisher": "SEGA"
  },
  {
    "title": "Ghostwire: Tokyo",
    "service": "prime",
    "start": "2023-10-05",
    "steamAppId": 1475810,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "DOOM 3",
    "service": "prime",
    "start": "2023-10-05",
    "steamAppId": 208200,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "RAGE 2",
    "service": "prime",
    "start": "2023-11-02",
    "steamAppId": 548570,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "STAR WARS: Knights of the Old Republic",
    "service": "prime",
    "start": "2023-11-02",
    "steamAppId": 32370,
    "publisher": "LucasArts"
  },
  {
    "title": "DEATHLOOP",
    "service": "prime",
    "start": "2023-12-07",
    "steamAppId": 1252330,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Endling - Extinction is Forever",
    "service": "prime",
    "start": "2024-01-04",
    "steamAppId": 898890,
    "publisher": "HandyGames"
  },
  {
    "title": "Fallout",
    "service": "prime",
    "start": "2024-02-01",
    "steamAppId": 38400,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Fallout 2",
    "service": "prime",
    "start": "2024-03-07",
    "steamAppId": 38410,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Chivalry 2",
    "service": "prime",
    "start": "2024-03-07",
    "steamAppId": 1824220,
    "publisher": "Tripwire Presents"
  },
  {
    "title": "Fallout 76",
    "service": "prime",
    "start": "2024-04-04",
    "steamAppId": 1151340,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Tomb Raider: Game of the Year Edition",
    "service": "prime",
    "start": "2024-05-02",
    "steamAppId": 203160,
    "publisher": "Square Enix"
  },
  {
    "title": "LEGO Star Wars III: The Clone Wars",
    "service": "prime",
    "start": "2024-05-02",
    "steamAppId": 32510,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Fallout 3: Game of the Year Edition",
    "service": "prime",
    "start": "2024-05-02",
    "steamAppId": 22370,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "STAR WARS Battlefront II (Classic, 2005)",
    "service": "prime",
    "start": "2024-06-06",
    "steamAppId": 6060,
    "publisher": "LucasArts"
  },
  {
    "title": "Weird West: Definitive Edition",
    "service": "prime",
    "start": "2024-06-06",
    "steamAppId": 1097350,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Suicide Squad: Kill the Justice League",
    "service": "prime",
    "start": "2024-07-16",
    "steamAppId": 315210,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Rise of the Tomb Raider: 20 Year Celebration",
    "service": "prime",
    "start": "2024-07-16",
    "steamAppId": 391220,
    "publisher": "Square Enix"
  },
  {
    "title": "Chivalry 2",
    "service": "prime",
    "start": "2024-07-16",
    "steamAppId": 1824220,
    "publisher": "Tripwire Presents"
  },
  {
    "title": "STAR WARS: Knights of the Old Republic II",
    "service": "prime",
    "start": "2024-07-16",
    "steamAppId": 208580,
    "publisher": "LucasArts"
  },
  {
    "title": "Teenage Mutant Ninja Turtles: Shredders Revenge",
    "service": "prime",
    "start": "2024-07-16",
    "steamAppId": 1361510,
    "publisher": "Dotemu"
  },
  {
    "title": "Deus Ex: Mankind Divided",
    "service": "prime",
    "start": "2024-08-01",
    "steamAppId": 337000,
    "publisher": "Square Enix"
  },
  {
    "title": "Tomb Raider: The Angel of Darkness",
    "service": "prime",
    "start": "2024-08-01",
    "steamAppId": 225020,
    "publisher": "Square Enix"
  },
  {
    "title": "Trek to Yomi",
    "service": "prime",
    "start": "2024-08-01",
    "steamAppId": 1370050,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Middle-earth: Shadow of Mordor Game of the Year Edition",
    "service": "prime",
    "start": "2024-09-05",
    "steamAppId": 241930,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Shadow of the Tomb Raider: Definitive Edition",
    "service": "prime",
    "start": "2024-09-05",
    "steamAppId": 750920,
    "publisher": "Square Enix"
  },
  {
    "title": "LEGO The Lord of the Rings",
    "service": "prime",
    "start": "2024-09-05",
    "steamAppId": 214510,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Borderlands 2",
    "service": "prime",
    "start": "2024-09-05",
    "steamAppId": 49520,
    "publisher": "2K"
  },
  {
    "title": "Borderlands: The Pre-Sequel",
    "service": "prime",
    "start": "2024-09-05",
    "steamAppId": 261640,
    "publisher": "2K"
  },
  {
    "title": "GreedFall",
    "service": "prime",
    "start": "2024-09-05",
    "steamAppId": 606880,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "BioShock Remastered",
    "service": "prime",
    "start": "2024-10-03",
    "steamAppId": 409710,
    "publisher": "2K"
  },
  {
    "title": "DOOM Eternal",
    "service": "prime",
    "start": "2024-10-03",
    "steamAppId": 782330,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Ghostbusters: Spirits Unleashed Ecto Edition",
    "service": "prime",
    "start": "2024-10-03",
    "steamAppId": 2383990,
    "publisher": "IllFonic"
  },
  {
    "title": "A Plague Tale: Innocence",
    "service": "prime",
    "start": "2024-10-03",
    "steamAppId": 752590,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Death's Door",
    "service": "prime",
    "start": "2024-10-03",
    "steamAppId": 894020,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Scorn",
    "service": "prime",
    "start": "2024-10-03",
    "steamAppId": 698670,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "Marvels Guardians of the Galaxy",
    "service": "prime",
    "start": "2024-11-01",
    "steamAppId": 1088850,
    "publisher": "Square Enix"
  },
  {
    "title": "Mafia: Definitive Edition",
    "service": "prime",
    "start": "2024-11-01",
    "steamAppId": 1030840,
    "publisher": "2K"
  },
  {
    "title": "Dishonored - Definitive Edition",
    "service": "prime",
    "start": "2024-11-01",
    "steamAppId": 205100,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Tomb Raider: Anniversary",
    "service": "prime",
    "start": "2024-11-01",
    "steamAppId": 8000,
    "publisher": "Square Enix"
  },
  {
    "title": "Overcooked! Gourmet Edition",
    "service": "prime",
    "start": "2024-11-01",
    "steamAppId": 448510,
    "publisher": "Team17"
  },
  {
    "title": "Super Meat Boy Forever",
    "service": "prime",
    "start": "2024-11-01",
    "steamAppId": 581660,
    "publisher": "Team Meat"
  },
  {
    "title": "The Outer Worlds",
    "service": "prime",
    "start": "2024-12-02",
    "steamAppId": 578650,
    "publisher": "Private Division"
  },
  {
    "title": "Spelunky",
    "service": "prime",
    "start": "2024-12-02",
    "steamAppId": 239350,
    "publisher": "Mossmouth"
  },
  {
    "title": "Warhammer 40,000: Space Marine",
    "service": "prime",
    "start": "2024-12-02",
    "steamAppId": 55150,
    "publisher": "SEGA"
  },
  {
    "title": "Baldur's Gate: Enhanced Edition",
    "service": "prime",
    "start": "2024-12-02",
    "steamAppId": 228280,
    "publisher": "Beamdog"
  },
  {
    "title": "Baldur's Gate II: Enhanced Edition",
    "service": "prime",
    "start": "2024-12-02",
    "steamAppId": 257350,
    "publisher": "Beamdog"
  },
  {
    "title": "DREDGE",
    "service": "prime",
    "start": "2024-12-02",
    "steamAppId": 1562430,
    "publisher": "Team17"
  },
  {
    "title": "Planet Coaster",
    "service": "prime",
    "start": "2024-12-02",
    "steamAppId": 493340,
    "publisher": "Frontier Developments"
  },
  {
    "title": "BioShock 2 Remastered",
    "service": "prime",
    "start": "2025-01-02",
    "steamAppId": 409720,
    "publisher": "2K"
  },
  {
    "title": "Deus Ex: Game of the Year Edition",
    "service": "prime",
    "start": "2025-01-02",
    "steamAppId": 6910,
    "publisher": "Square Enix"
  },
  {
    "title": "ENDER LILIES: Quietus of the Knights",
    "service": "prime",
    "start": "2025-01-02",
    "steamAppId": 1369630,
    "publisher": "Binary Haze Interactive"
  },
  {
    "title": "BioShock Infinite Complete Edition",
    "service": "prime",
    "start": "2025-02-06",
    "steamAppId": 8870,
    "publisher": "2K"
  },
  {
    "title": "The Talos Principle: Gold Edition",
    "service": "prime",
    "start": "2025-02-06",
    "steamAppId": 257510,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Wolfenstein: Youngblood",
    "service": "prime",
    "start": "2025-02-06",
    "steamAppId": 1056960,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Saints Row: The Third Remastered",
    "service": "prime",
    "start": "2025-03-06",
    "steamAppId": 978300,
    "publisher": "Deep Silver"
  },
  {
    "title": "Mafia II: Definitive Edition",
    "service": "prime",
    "start": "2025-03-06",
    "steamAppId": 1030830,
    "publisher": "2K"
  },
  {
    "title": "Mafia III: Definitive Edition",
    "service": "prime",
    "start": "2025-04-03",
    "steamAppId": 360430,
    "publisher": "2K"
  },
  {
    "title": "Minecraft Legends",
    "service": "prime",
    "start": "2025-04-03",
    "steamAppId": 1928870,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Thief: Deadly Shadows",
    "service": "prime",
    "start": "2025-04-03",
    "steamAppId": 6980,
    "publisher": "Square Enix"
  },
  {
    "title": "Ziggurat",
    "service": "gog",
    "start": "2018-06-15",
    "steamAppId": 308420,
    "publisher": "Milkstone Studios"
  },
  {
    "title": "Full Throttle Remastered",
    "service": "gog",
    "start": "2018-11-29",
    "steamAppId": 228360,
    "publisher": "Double Fine Productions"
  },
  {
    "title": "SOMA",
    "service": "gog",
    "start": "2018-12-13",
    "steamAppId": 282140,
    "publisher": "Frictional Games"
  },
  {
    "title": "Toonstruck",
    "service": "gog",
    "start": "2019-06-15",
    "steamAppId": 369830,
    "publisher": "Interplay"
  },
  {
    "title": "Postal 2",
    "service": "gog",
    "start": "2019-12-16",
    "steamAppId": 223470,
    "publisher": "Running With Scissors"
  },
  {
    "title": "Tower of Time",
    "service": "gog",
    "start": "2019-12-30",
    "steamAppId": 617480,
    "publisher": "Event Horizon"
  },
  {
    "title": "The Witcher: Enhanced Edition",
    "service": "gog",
    "start": "2020-05-01",
    "steamAppId": 20900,
    "publisher": "CD PROJEKT RED"
  },
  {
    "title": "Total Annihilation: Commander Pack",
    "service": "gog",
    "start": "2020-06-05",
    "steamAppId": 298030,
    "publisher": "Wargaming"
  },
  {
    "title": "Hitman: Absolution",
    "service": "gog",
    "start": "2020-06-15",
    "steamAppId": 203140,
    "publisher": "IO Interactive"
  },
  {
    "title": "Eye of the Beholder Trilogy",
    "service": "gog",
    "start": "2020-06-22",
    "steamAppId": 2354280,
    "publisher": "SSI"
  },
  {
    "title": "Warhammer 40,000: Rites of War",
    "service": "gog",
    "start": "2020-07-15",
    "steamAppId": 553900,
    "publisher": "Slitherine"
  },
  {
    "title": "Serious Sam: The First Encounter",
    "service": "gog",
    "start": "2020-08-20",
    "steamAppId": 41050,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Europa Universalis II",
    "service": "gog",
    "start": "2020-10-30",
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Butcher",
    "service": "gog",
    "start": "2020-11-16",
    "steamAppId": 474210,
    "publisher": "Transhuman Design"
  },
  {
    "title": "Prison Architect",
    "service": "gog",
    "start": "2020-12-16",
    "steamAppId": 233450,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Brigador: Up-Armored Edition",
    "service": "gog",
    "start": "2020-12-23",
    "steamAppId": 274500,
    "publisher": "Stellar Jockeys"
  },
  {
    "title": "Metro: Last Light Redux",
    "service": "gog",
    "start": "2020-12-30",
    "steamAppId": 287390,
    "publisher": "Deep Silver"
  },
  {
    "title": "Warhammer: Shadow of the Horned Rat",
    "service": "gog",
    "start": "2021-06-03",
    "steamAppId": 1249290,
    "publisher": "Games Workshop"
  },
  {
    "title": "Hellpoint",
    "service": "gog",
    "start": "2021-06-18",
    "steamAppId": 628670,
    "publisher": "tinyBuild"
  },
  {
    "title": "Shadowrun Trilogy",
    "service": "gog",
    "start": "2021-06-23",
    "steamAppId": 234650,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Syberia I & II",
    "service": "gog",
    "start": "2021-07-14",
    "steamAppId": 46500,
    "publisher": "Microids"
  },
  {
    "title": "Wanderlust: Transsiberian",
    "service": "gog",
    "start": "2021-08-19",
    "steamAppId": 1233420,
    "publisher": "Walkabout"
  },
  {
    "title": "Outcast 1.1",
    "service": "gog",
    "start": "2021-11-09",
    "steamAppId": 336610,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Call of Juarez: Gunslinger",
    "service": "gog",
    "start": "2021-12-13",
    "steamAppId": 204450,
    "publisher": "Techland"
  },
  {
    "title": "Shadow Tactics: Blades of the Shogun",
    "service": "gog",
    "start": "2021-12-16",
    "steamAppId": 418240,
    "publisher": "Daedalic Entertainment"
  },
  {
    "title": "X-Morph: Defense Complete Edition",
    "service": "gog",
    "start": "2021-12-27",
    "steamAppId": 408410,
    "publisher": "EXOR Studios"
  },
  {
    "title": "Sanitarium",
    "service": "gog",
    "start": "2022-06-06",
    "steamAppId": 284050,
    "publisher": "Dotemu"
  },
  {
    "title": "Venetica - Gold Edition",
    "service": "gog",
    "start": "2022-06-13",
    "steamAppId": 338140,
    "publisher": "Deck13"
  },
  {
    "title": "Flashback",
    "service": "gog",
    "start": "2022-06-20",
    "steamAppId": 961620,
    "publisher": "Microids"
  },
  {
    "title": "Stasis",
    "service": "gog",
    "start": "2022-08-23",
    "steamAppId": 380150,
    "publisher": "The Brotherhood"
  },
  {
    "title": "Dex",
    "service": "gog",
    "start": "2022-08-29",
    "steamAppId": 269650,
    "publisher": "Dreadlocks"
  },
  {
    "title": "Immortal Redneck",
    "service": "gog",
    "start": "2022-09-01",
    "steamAppId": 595140,
    "publisher": "Crema"
  },
  {
    "title": "Genesis Alpha One Deluxe Edition",
    "service": "gog",
    "start": "2022-10-31",
    "steamAppId": 712190,
    "publisher": "Team17"
  },
  {
    "title": "Narita Boy",
    "service": "gog",
    "start": "2022-11-18",
    "steamAppId": 1069530,
    "publisher": "Team17"
  },
  {
    "title": "Ghost of a Tale",
    "service": "gog",
    "start": "2022-12-12",
    "steamAppId": 417290,
    "publisher": "SeithCG"
  },
  {
    "title": "Greak: Memories of Azur",
    "service": "gog",
    "start": "2022-12-23",
    "steamAppId": 1311070,
    "publisher": "Team17"
  },
  {
    "title": "Worms Revolution Gold Edition",
    "service": "gog",
    "start": "2022-12-27",
    "steamAppId": 200170,
    "publisher": "Team17"
  },
  {
    "title": "Daymare: 1998",
    "service": "gog",
    "start": "2022-12-30",
    "steamAppId": 842100,
    "publisher": "Destructive Creations"
  },
  {
    "title": "Sunblaze",
    "service": "gog",
    "start": "2023-06-12",
    "steamAppId": 1525660,
    "publisher": "Bonus Stage Publishing"
  },
  {
    "title": "Ancient Enemy",
    "service": "gog",
    "start": "2023-06-23",
    "steamAppId": 993790,
    "publisher": "Grey Alien Games"
  },
  {
    "title": "Beholder 2",
    "service": "gog",
    "start": "2023-06-29",
    "steamAppId": 761620,
    "publisher": "Alawar"
  },
  {
    "title": "Hero of the Kingdom II",
    "service": "gog",
    "start": "2023-09-01",
    "steamAppId": 346560,
    "publisher": "Lonely Troops"
  },
  {
    "title": "Requiem: Avenging Angel",
    "service": "gog",
    "start": "2023-09-08",
    "steamAppId": 493310,
    "publisher": "3DO"
  },
  {
    "title": "Blacksad: Under the Skin",
    "service": "gog",
    "start": "2023-10-27",
    "steamAppId": 1003890,
    "publisher": "Microids"
  },
  {
    "title": "Styx: Shards of Darkness",
    "service": "gog",
    "start": "2023-11-17",
    "steamAppId": 355790,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Legend of Keepers: Career of a Dungeon Manager",
    "service": "gog",
    "start": "2023-12-13",
    "steamAppId": 978520,
    "publisher": "Goblinz Publishing"
  },
  {
    "title": "Mordheim: City of the Damned",
    "service": "gog",
    "start": "2024-01-29",
    "steamAppId": 276810,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "FlatOut",
    "service": "gog",
    "start": "2024-02-14",
    "steamAppId": 6220,
    "publisher": "Empire Interactive"
  },
  {
    "title": "Hammerting",
    "service": "gog",
    "start": "2024-03-28",
    "steamAppId": 760650,
    "publisher": "Team17"
  },
  {
    "title": "Shadows: Awakening",
    "service": "gog",
    "start": "2024-06-20",
    "steamAppId": 585450,
    "publisher": "Kalypso Media"
  },
  {
    "title": "Once Upon a Jester",
    "service": "gog",
    "start": "2024-09-02",
    "steamAppId": 1668190,
    "publisher": "Crunching Koalas"
  },
  {
    "title": "Return of the Phantom",
    "service": "gog",
    "start": "2024-10-31",
    "steamAppId": 1299710,
    "publisher": "MicroProse"
  },
  {
    "title": "Oaken",
    "service": "gog",
    "start": "2024-11-27",
    "steamAppId": 1348690,
    "publisher": "Goblinz Publishing"
  },
  {
    "title": "The Whispered World: Special Edition",
    "service": "gog",
    "start": "2024-12-12",
    "steamAppId": 268540,
    "publisher": "Daedalic Entertainment"
  },
  {
    "title": "Dark Deity",
    "service": "gog",
    "start": "2024-12-23",
    "steamAppId": 1374840,
    "publisher": "Freedom Games"
  },
  {
    "title": "Vambrace: Cold Soul",
    "service": "gog",
    "start": "2024-12-30",
    "steamAppId": 904380,
    "publisher": "Headup"
  },
  {
    "title": "Left 4 Dead 2",
    "service": "steam_free",
    "start": "2013-12-25",
    "steamAppId": 550,
    "publisher": "Valve"
  },
  {
    "title": "PAYDAY 2",
    "service": "steam_free",
    "start": "2017-06-08",
    "steamAppId": 218620,
    "publisher": "Starbreeze"
  },
  {
    "title": "Ziggurat",
    "service": "steam_free",
    "start": "2018-06-06",
    "steamAppId": 308420,
    "publisher": "Milkstone Studios"
  },
  {
    "title": "Shadowrun Returns Deluxe",
    "service": "steam_free",
    "start": "2018-06-21",
    "steamAppId": 234650,
    "publisher": "Harebrained Schemes"
  },
  {
    "title": "For Honor",
    "service": "steam_free",
    "start": "2018-08-22",
    "steamAppId": 304390,
    "publisher": "Ubisoft"
  },
  {
    "title": "Metro 2033",
    "service": "steam_free",
    "start": "2018-10-25",
    "steamAppId": 43110,
    "publisher": "Deep Silver"
  },
  {
    "title": "Outcast - Second Contact",
    "service": "steam_free",
    "start": "2018-11-21",
    "steamAppId": 618970,
    "publisher": "Bigben Interactive"
  },
  {
    "title": "Company of Heroes 2",
    "service": "steam_free",
    "start": "2018-12-06",
    "steamAppId": 231430,
    "publisher": "SEGA"
  },
  {
    "title": "Sins of a Solar Empire: Rebellion",
    "service": "steam_free",
    "start": "2018-12-20",
    "steamAppId": 204880,
    "publisher": "Stardock"
  },
  {
    "title": "A Story About My Uncle",
    "service": "steam_free",
    "start": "2019-01-10",
    "steamAppId": 278360,
    "publisher": "Coffee Stain Publishing"
  },
  {
    "title": "GRID 2",
    "service": "steam_free",
    "start": "2019-03-14",
    "steamAppId": 44350,
    "publisher": "Codemasters"
  },
  {
    "title": "Kathy Rain",
    "service": "steam_free",
    "start": "2019-05-17",
    "steamAppId": 370910,
    "publisher": "Raw Fury"
  },
  {
    "title": "Guacamelee! Super Turbo Championship Edition",
    "service": "steam_free",
    "start": "2019-05-23",
    "steamAppId": 275390,
    "publisher": "DrinkBox Studios"
  },
  {
    "title": "Age of Wonders III",
    "service": "steam_free",
    "start": "2019-07-15",
    "steamAppId": 226840,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Dirt Rally",
    "service": "steam_free",
    "start": "2019-09-17",
    "steamAppId": 310560,
    "publisher": "Codemasters"
  },
  {
    "title": "Tomb Raider",
    "service": "steam_free",
    "start": "2020-03-20",
    "steamAppId": 203160,
    "publisher": "Square Enix"
  },
  {
    "title": "Lara Croft and the Temple of Osiris",
    "service": "steam_free",
    "start": "2020-03-20",
    "steamAppId": 289690,
    "publisher": "Square Enix"
  },
  {
    "title": "Total War: SHOGUN 2",
    "service": "steam_free",
    "start": "2020-04-27",
    "steamAppId": 201270,
    "publisher": "SEGA"
  },
  {
    "title": "The LEGO NINJAGO Movie Video Game",
    "service": "steam_free",
    "start": "2020-05-14",
    "steamAppId": 640590,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "10 Second Ninja X",
    "service": "steam_free",
    "start": "2020-05-22",
    "steamAppId": 435790,
    "publisher": "Curve Games"
  },
  {
    "title": "Kao the Kangaroo: Round 2",
    "service": "steam_free",
    "start": "2020-06-09",
    "steamAppId": 1048540,
    "publisher": "Tate Multimedia"
  },
  {
    "title": "Injustice: Gods Among Us Ultimate Edition",
    "service": "steam_free",
    "start": "2020-06-25",
    "steamAppId": 242700,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Sonic The Hedgehog 2",
    "service": "steam_free",
    "start": "2020-10-14",
    "steamAppId": 71163,
    "publisher": "SEGA"
  },
  {
    "title": "Little Nightmares",
    "service": "steam_free",
    "start": "2021-01-13",
    "steamAppId": 424840,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Metro 2033",
    "service": "steam_free",
    "start": "2021-03-11",
    "steamAppId": 43110,
    "publisher": "Deep Silver"
  },
  {
    "title": "Company of Heroes 2",
    "service": "steam_free",
    "start": "2021-05-27",
    "steamAppId": 231430,
    "publisher": "SEGA"
  },
  {
    "title": "Tell Me Why",
    "service": "steam_free",
    "start": "2021-06-03",
    "steamAppId": 1180660,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Mafia",
    "service": "steam_free",
    "start": "2021-09-01",
    "steamAppId": 40990,
    "publisher": "2K"
  },
  {
    "title": "Titan Quest Anniversary Edition",
    "service": "steam_free",
    "start": "2021-09-16",
    "steamAppId": 475150,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Jagged Alliance 1: Gold Edition",
    "service": "steam_free",
    "start": "2021-09-16",
    "steamAppId": 283270,
    "publisher": "THQ Nordic"
  },
  {
    "title": "Call of Juarez: Gunslinger",
    "service": "steam_free",
    "start": "2021-12-09",
    "steamAppId": 204450,
    "publisher": "Techland"
  },
  {
    "title": "Everything",
    "service": "steam_free",
    "start": "2022-03-17",
    "steamAppId": 582270,
    "publisher": "Double Fine"
  },
  {
    "title": "Black Desert",
    "service": "steam_free",
    "start": "2022-04-18",
    "steamAppId": 582660,
    "publisher": "Pearl Abyss"
  },
  {
    "title": "ARK: Survival Evolved",
    "service": "steam_free",
    "start": "2022-06-13",
    "steamAppId": 346110,
    "publisher": "Studio Wildcard"
  },
  {
    "title": "Warhammer: Vermintide 2",
    "service": "steam_free",
    "start": "2022-11-03",
    "steamAppId": 552500,
    "publisher": "Fatshark"
  },
  {
    "title": "Figment",
    "service": "steam_free",
    "start": "2023-03-09",
    "steamAppId": 493540,
    "publisher": "Bedtime Digital Games"
  },
  {
    "title": "Tiny Tina's Assault on Dragon Keep: A Wonderlands One-shot Adventure",
    "service": "steam_free",
    "start": "2023-03-16",
    "steamAppId": 1712840,
    "publisher": "2K"
  },
  {
    "title": "The Murder of Sonic the Hedgehog",
    "service": "steam_free",
    "start": "2023-03-30",
    "steamAppId": 2324650,
    "publisher": "SEGA"
  },
  {
    "title": "Desktop Dungeons",
    "service": "steam_free",
    "start": "2023-04-20",
    "steamAppId": 226620,
    "publisher": "QCF Design"
  },
  {
    "title": "Metro: Last Light Complete Edition",
    "service": "steam_free",
    "start": "2023-05-18",
    "steamAppId": 43160,
    "publisher": "Deep Silver"
  },
  {
    "title": "Warhammer 40,000: Gladius - Relics of War",
    "service": "steam_free",
    "start": "2023-05-25",
    "steamAppId": 489630,
    "publisher": "Slitherine"
  },
  {
    "title": "Hue",
    "service": "steam_free",
    "start": "2023-06-01",
    "steamAppId": 383270,
    "publisher": "Curve Games"
  },
  {
    "title": "World of Warships Anniversary Pack",
    "service": "steam_free",
    "start": "2023-08-31",
    "steamAppId": 552990,
    "publisher": "Wargaming"
  },
  {
    "title": "Half-Life",
    "service": "steam_free",
    "start": "2023-11-16",
    "steamAppId": 70,
    "publisher": "Valve"
  },
  {
    "title": "Dead Island: Riptide Definitive Edition",
    "service": "steam_free",
    "start": "2024-02-13",
    "steamAppId": 383180,
    "publisher": "Deep Silver"
  },
  {
    "title": "Content Warning",
    "service": "steam_free",
    "start": "2024-04-01",
    "steamAppId": 2881650,
    "publisher": "Landfall"
  },
  {
    "title": "Machinika: Museum",
    "service": "steam_free",
    "start": "2024-05-16",
    "steamAppId": 1507190,
    "publisher": "PID Games"
  },
  {
    "title": "Weapon of Choice DX",
    "service": "steam_free",
    "start": "2024-08-22",
    "steamAppId": 373600,
    "publisher": "Mommys Best Games"
  },
  {
    "title": "Half-Life 2",
    "service": "steam_free",
    "start": "2024-11-15",
    "steamAppId": 220,
    "publisher": "Valve"
  },
  {
    "title": "Pankapu",
    "service": "steam_free",
    "start": "2024-12-12",
    "steamAppId": 418670,
    "publisher": "Dear Villagers"
  },
  {
    "title": "Satisfactory",
    "service": "humble_bundle",
    "start": "2022-03-18",
    "steamAppId": 526870,
    "publisher": "Coffee Stain Publishing"
  },
  {
    "title": "Spyro Reignited Trilogy",
    "service": "humble_bundle",
    "start": "2022-03-18",
    "steamAppId": 996580,
    "publisher": "Activision"
  },
  {
    "title": "Back 4 Blood",
    "service": "humble_bundle",
    "start": "2022-03-18",
    "steamAppId": 924970,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Slay the Spire",
    "service": "humble_bundle",
    "start": "2022-03-18",
    "steamAppId": 646570,
    "publisher": "MegaCrit"
  },
  {
    "title": "The Long Dark",
    "service": "humble_bundle",
    "start": "2022-03-18",
    "steamAppId": 305620,
    "publisher": "Hinterland Studio"
  },
  {
    "title": "Resident Evil Village",
    "service": "humble_bundle",
    "start": "2022-09-14",
    "steamAppId": 1196590,
    "publisher": "Capcom"
  },
  {
    "title": "Resident Evil 2",
    "service": "humble_bundle",
    "start": "2022-09-14",
    "steamAppId": 883710,
    "publisher": "Capcom"
  },
  {
    "title": "Resident Evil 3",
    "service": "humble_bundle",
    "start": "2022-09-14",
    "steamAppId": 952060,
    "publisher": "Capcom"
  },
  {
    "title": "Resident Evil 7 Biohazard",
    "service": "humble_bundle",
    "start": "2022-09-14",
    "steamAppId": 418370,
    "publisher": "Capcom"
  },
  {
    "title": "Monster Hunter Rise",
    "service": "humble_bundle",
    "start": "2023-05-10",
    "steamAppId": 1446780,
    "publisher": "Capcom"
  },
  {
    "title": "Monster Hunter: World",
    "service": "humble_bundle",
    "start": "2023-05-10",
    "steamAppId": 582010,
    "publisher": "Capcom"
  },
  {
    "title": "Phoenix Wright: Ace Attorney Trilogy",
    "service": "humble_bundle",
    "start": "2023-05-10",
    "steamAppId": 787480,
    "publisher": "Capcom"
  },
  {
    "title": "Batman: Arkham Origins",
    "service": "humble_bundle",
    "start": "2023-11-20",
    "steamAppId": 209000,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Gotham Knights",
    "service": "humble_bundle",
    "start": "2023-11-20",
    "steamAppId": 1496790,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Mortal Kombat 11",
    "service": "humble_bundle",
    "start": "2023-11-20",
    "steamAppId": 976310,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Mad Max",
    "service": "humble_bundle",
    "start": "2023-11-20",
    "steamAppId": 234140,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Fallout 4",
    "service": "humble_bundle",
    "start": "2024-05-15",
    "steamAppId": 377160,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "The Elder Scrolls V: Skyrim Special Edition",
    "service": "humble_bundle",
    "start": "2024-05-15",
    "steamAppId": 489830,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Street Fighter 6",
    "service": "humble_bundle",
    "start": "2024-08-14",
    "steamAppId": 1364780,
    "publisher": "Capcom"
  },
  {
    "title": "Dragons Dogma: Dark Arisen",
    "service": "humble_bundle",
    "start": "2024-08-14",
    "steamAppId": 367500,
    "publisher": "Capcom"
  },
  {
    "title": "Devil May Cry 5",
    "service": "humble_bundle",
    "start": "2024-08-14",
    "steamAppId": 601150,
    "publisher": "Capcom"
  },
  {
    "title": "DOOM",
    "service": "fanatical_bundle",
    "start": "2023-03-10",
    "steamAppId": 379720,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Wolfenstein II: The New Colossus",
    "service": "fanatical_bundle",
    "start": "2023-03-10",
    "steamAppId": 612880,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Dishonored: Death of the Outsider",
    "service": "fanatical_bundle",
    "start": "2023-06-15",
    "steamAppId": 614570,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "The Elder Scrolls Online",
    "service": "fanatical_bundle",
    "start": "2023-09-20",
    "steamAppId": 306130,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "The Evil Within",
    "service": "fanatical_bundle",
    "start": "2024-02-15",
    "steamAppId": 268050,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Frostpunk",
    "service": "fanatical_bundle",
    "start": "2024-04-12",
    "steamAppId": 323190,
    "publisher": "11 bit studios"
  },
  {
    "title": "Moonlighter",
    "service": "fanatical_bundle",
    "start": "2024-04-12",
    "steamAppId": 606150,
    "publisher": "11 bit studios"
  },
  {
    "title": "This War of Mine",
    "service": "fanatical_bundle",
    "start": "2024-04-12",
    "steamAppId": 282070,
    "publisher": "11 bit studios"
  },
  {
    "title": "Dusk",
    "service": "fanatical_bundle",
    "start": "2024-07-19",
    "steamAppId": 519860,
    "publisher": "New Blood Interactive"
  },
  {
    "title": "AMID EVIL",
    "service": "fanatical_bundle",
    "start": "2024-07-19",
    "steamAppId": 673130,
    "publisher": "New Blood Interactive"
  },
  {
    "title": "Metro Exodus",
    "service": "fanatical_bundle",
    "start": "2024-10-10",
    "steamAppId": 412020,
    "publisher": "Deep Silver"
  },
  {
    "title": "S.T.A.L.K.E.R.: Shadow of Chernobyl",
    "service": "fanatical_bundle",
    "start": "2024-10-10",
    "steamAppId": 4500,
    "publisher": "GSC Game World"
  },
  {
    "title": "Outer Wilds",
    "service": "gamepass",
    "start": "2019-05-30",
    "steamAppId": 753640,
    "publisher": "Annapurna Interactive"
  },
  {
    "title": "Metro Exodus",
    "service": "gamepass",
    "start": "2019-06-09",
    "steamAppId": 412020,
    "publisher": "Deep Silver"
  },
  {
    "title": "Hollow Knight",
    "service": "gamepass",
    "start": "2019-06-09",
    "steamAppId": 367520,
    "publisher": "Team Cherry"
  },
  {
    "title": "The Outer Worlds",
    "service": "gamepass",
    "start": "2019-10-25",
    "steamAppId": 578650,
    "publisher": "Private Division"
  },
  {
    "title": "Halo: The Master Chief Collection",
    "service": "gamepass",
    "start": "2019-12-03",
    "steamAppId": 976730,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "No Mans Sky",
    "service": "gamepass",
    "start": "2020-06-11",
    "steamAppId": 275850,
    "publisher": "Hello Games"
  },
  {
    "title": "Microsoft Flight Simulator",
    "service": "gamepass",
    "start": "2020-08-18",
    "steamAppId": 1250410,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Spiritfarer",
    "service": "gamepass",
    "start": "2020-08-18",
    "steamAppId": 972660,
    "publisher": "Thunder Lotus Games"
  },
  {
    "title": "Crusader Kings III",
    "service": "gamepass",
    "start": "2020-09-01",
    "steamAppId": 1158310,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "DOOM Eternal",
    "service": "gamepass",
    "start": "2020-10-01",
    "steamAppId": 782330,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Deep Rock Galactic",
    "service": "gamepass",
    "start": "2020-11-10",
    "steamAppId": 548430,
    "publisher": "Coffee Stain Publishing"
  },
  {
    "title": "Control",
    "service": "gamepass",
    "start": "2020-12-03",
    "steamAppId": 870780,
    "publisher": "505 Games"
  },
  {
    "title": "Skyrim Special Edition",
    "service": "gamepass",
    "start": "2021-03-12",
    "steamAppId": 489830,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Dishonored: Definitive Edition",
    "service": "gamepass",
    "start": "2021-03-12",
    "steamAppId": 205100,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Prey",
    "service": "gamepass",
    "start": "2021-03-12",
    "steamAppId": 480490,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Octopath Traveler",
    "service": "gamepass",
    "start": "2021-03-18",
    "steamAppId": 921570,
    "publisher": "Square Enix"
  },
  {
    "title": "Yakuza 6: The Song of Life",
    "service": "gamepass",
    "start": "2021-03-25",
    "steamAppId": 1388590,
    "publisher": "SEGA"
  },
  {
    "title": "Outriders",
    "service": "gamepass",
    "start": "2021-04-01",
    "steamAppId": 680420,
    "publisher": "Square Enix"
  },
  {
    "title": "Yakuza: Like a Dragon",
    "service": "gamepass",
    "start": "2021-06-13",
    "steamAppId": 1235140,
    "publisher": "SEGA"
  },
  {
    "title": "The Ascent",
    "service": "gamepass",
    "start": "2021-07-29",
    "steamAppId": 979690,
    "publisher": "Curve Games"
  },
  {
    "title": "Hades",
    "service": "gamepass",
    "start": "2021-08-13",
    "steamAppId": 1145360,
    "publisher": "Supergiant Games"
  },
  {
    "title": "HUMANKIND",
    "service": "gamepass",
    "start": "2021-08-17",
    "steamAppId": 1124300,
    "publisher": "SEGA"
  },
  {
    "title": "Psychonauts 2",
    "service": "gamepass",
    "start": "2021-08-25",
    "steamAppId": 607080,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Back 4 Blood",
    "service": "gamepass",
    "start": "2021-10-12",
    "steamAppId": 924970,
    "publisher": "Warner Bros. Games"
  },
  {
    "title": "Age of Empires IV",
    "service": "gamepass",
    "start": "2021-10-28",
    "steamAppId": 1466860,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Unpacking",
    "service": "gamepass",
    "start": "2021-11-02",
    "steamAppId": 1135690,
    "publisher": "Humble Games"
  },
  {
    "title": "Forza Horizon 5",
    "service": "gamepass",
    "start": "2021-11-09",
    "steamAppId": 1551360,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Halo Infinite",
    "service": "gamepass",
    "start": "2021-12-08",
    "steamAppId": 1240440,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Mass Effect Legendary Edition",
    "service": "gamepass",
    "start": "2022-01-13",
    "steamAppId": 1328670,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Hitman Trilogy",
    "service": "gamepass",
    "start": "2022-01-20",
    "steamAppId": 1659040,
    "publisher": "IO Interactive"
  },
  {
    "title": "Deaths Door",
    "service": "gamepass",
    "start": "2022-01-20",
    "steamAppId": 894020,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Total War: WARHAMMER III",
    "service": "gamepass",
    "start": "2022-02-17",
    "steamAppId": 1142710,
    "publisher": "SEGA"
  },
  {
    "title": "Far: Changing Tides",
    "service": "gamepass",
    "start": "2022-03-01",
    "steamAppId": 1570010,
    "publisher": "Frontier Foundry"
  },
  {
    "title": "Tunic",
    "service": "gamepass",
    "start": "2022-03-16",
    "steamAppId": 553420,
    "publisher": "Finji"
  },
  {
    "title": "Citizen Sleeper",
    "service": "gamepass",
    "start": "2022-05-05",
    "steamAppId": 1578650,
    "publisher": "Fellow Traveller"
  },
  {
    "title": "Teenage Mutant Ninja Turtles: Shredders Revenge",
    "service": "gamepass",
    "start": "2022-06-14",
    "steamAppId": 1361510,
    "publisher": "Dotemu"
  },
  {
    "title": "Two Point Campus",
    "service": "gamepass",
    "start": "2022-08-09",
    "steamAppId": 1649080,
    "publisher": "SEGA"
  },
  {
    "title": "Deathloop",
    "service": "gamepass",
    "start": "2022-09-20",
    "steamAppId": 1252330,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Slime Rancher 2",
    "service": "gamepass",
    "start": "2022-09-20",
    "steamAppId": 1657630,
    "publisher": "Monomi Park"
  },
  {
    "title": "Chivalry 2",
    "service": "gamepass",
    "start": "2022-10-06",
    "steamAppId": 1824220,
    "publisher": "Tripwire Presents"
  },
  {
    "title": "Scorn",
    "service": "gamepass",
    "start": "2022-10-14",
    "steamAppId": 698670,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "A Plague Tale: Requiem",
    "service": "gamepass",
    "start": "2022-10-18",
    "steamAppId": 1182900,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Persona 5 Royal",
    "service": "gamepass",
    "start": "2022-10-21",
    "steamAppId": 1687950,
    "publisher": "SEGA"
  },
  {
    "title": "Return to Monkey Island",
    "service": "gamepass",
    "start": "2022-11-08",
    "steamAppId": 2060130,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Pentiment",
    "service": "gamepass",
    "start": "2022-11-15",
    "steamAppId": 1205520,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Warhammer 40,000: Darktide",
    "service": "gamepass",
    "start": "2022-11-30",
    "steamAppId": 1361210,
    "publisher": "Fatshark"
  },
  {
    "title": "High On Life",
    "service": "gamepass",
    "start": "2022-12-13",
    "steamAppId": 1583230,
    "publisher": "Squanch Games"
  },
  {
    "title": "Persona 4 Golden",
    "service": "gamepass",
    "start": "2023-01-19",
    "steamAppId": 1113000,
    "publisher": "SEGA"
  },
  {
    "title": "Monster Hunter Rise",
    "service": "gamepass",
    "start": "2023-01-20",
    "steamAppId": 1446780,
    "publisher": "Capcom"
  },
  {
    "title": "Hi-Fi RUSH",
    "service": "gamepass",
    "start": "2023-01-25",
    "steamAppId": 1817230,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Atomic Heart",
    "service": "gamepass",
    "start": "2023-02-21",
    "steamAppId": 668580,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Wo Long: Fallen Dynasty",
    "service": "gamepass",
    "start": "2023-03-03",
    "steamAppId": 1448440,
    "publisher": "KOEI TECMO"
  },
  {
    "title": "Ghostwire: Tokyo",
    "service": "gamepass",
    "start": "2023-04-12",
    "steamAppId": 1475810,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Redfall",
    "service": "gamepass",
    "start": "2023-05-02",
    "steamAppId": 1294810,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Chicory: A Colorful Tale",
    "service": "gamepass",
    "start": "2023-05-30",
    "steamAppId": 1123450,
    "publisher": "Finji"
  },
  {
    "title": "Car Mechanic Simulator 2021",
    "service": "gamepass",
    "start": "2023-06-01",
    "steamAppId": 1190000,
    "publisher": "PlayWay"
  },
  {
    "title": "Techtonica",
    "service": "gamepass",
    "start": "2023-07-18",
    "steamAppId": 1457320,
    "publisher": "Fire Hose Games"
  },
  {
    "title": "Sea of Stars",
    "service": "gamepass",
    "start": "2023-08-29",
    "steamAppId": 1244090,
    "publisher": "Sabotage Studio"
  },
  {
    "title": "Starfield",
    "service": "gamepass",
    "start": "2023-09-06",
    "steamAppId": 1716740,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Lies of P",
    "service": "gamepass",
    "start": "2023-09-18",
    "steamAppId": 1627720,
    "publisher": "Neowiz"
  },
  {
    "title": "Payday 3",
    "service": "gamepass",
    "start": "2023-09-21",
    "steamAppId": 1272080,
    "publisher": "Deep Silver"
  },
  {
    "title": "Cocoon",
    "service": "gamepass",
    "start": "2023-09-29",
    "steamAppId": 1497440,
    "publisher": "Annapurna Interactive"
  },
  {
    "title": "The Lamplighters League",
    "service": "gamepass",
    "start": "2023-10-03",
    "steamAppId": 1167750,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Like a Dragon: Ishin!",
    "service": "gamepass",
    "start": "2023-10-17",
    "steamAppId": 1805480,
    "publisher": "SEGA"
  },
  {
    "title": "Cities: Skylines II",
    "service": "gamepass",
    "start": "2023-10-24",
    "steamAppId": 949230,
    "publisher": "Paradox Interactive"
  },
  {
    "title": "Dead Space (2023)",
    "service": "gamepass",
    "start": "2023-10-26",
    "steamAppId": 1693980,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Jusant",
    "service": "gamepass",
    "start": "2023-10-31",
    "steamAppId": 1977170,
    "publisher": "DON'T NOD"
  },
  {
    "title": "Like a Dragon Gaiden: The Man Who Erased His Name",
    "service": "gamepass",
    "start": "2023-11-09",
    "steamAppId": 2375550,
    "publisher": "SEGA"
  },
  {
    "title": "Remnant II",
    "service": "gamepass",
    "start": "2023-11-30",
    "steamAppId": 1282100,
    "publisher": "Gearbox Publishing"
  },
  {
    "title": "SteamWorld Build",
    "service": "gamepass",
    "start": "2023-12-01",
    "steamAppId": 2134770,
    "publisher": "Thunderful"
  },
  {
    "title": "Close to the Sun",
    "service": "gamepass",
    "start": "2024-01-03",
    "steamAppId": 968870,
    "publisher": "Wired Productions"
  },
  {
    "title": "Assassins Creed Valhalla",
    "service": "gamepass",
    "start": "2024-01-09",
    "steamAppId": 2208920,
    "publisher": "Ubisoft"
  },
  {
    "title": "Resident Evil 2",
    "service": "gamepass",
    "start": "2024-01-16",
    "steamAppId": 883710,
    "publisher": "Capcom"
  },
  {
    "title": "Palworld",
    "service": "gamepass",
    "start": "2024-01-19",
    "steamAppId": 1623730,
    "publisher": "Pocketpair"
  },
  {
    "title": "Persona 3 Reload",
    "service": "gamepass",
    "start": "2024-02-02",
    "steamAppId": 2161700,
    "publisher": "SEGA"
  },
  {
    "title": "Resident Evil 3",
    "service": "gamepass",
    "start": "2024-02-13",
    "steamAppId": 952060,
    "publisher": "Capcom"
  },
  {
    "title": "Tales of Arise",
    "service": "gamepass",
    "start": "2024-02-20",
    "steamAppId": 740130,
    "publisher": "Bandai Namco"
  },
  {
    "title": "Diablo IV",
    "service": "gamepass",
    "start": "2024-03-07",
    "steamAppId": 2344520,
    "publisher": "Blizzard"
  },
  {
    "title": "Control Ultimate Edition",
    "service": "gamepass",
    "start": "2024-03-12",
    "steamAppId": 870780,
    "publisher": "505 Games"
  },
  {
    "title": "Lightyear Frontier",
    "service": "gamepass",
    "start": "2024-03-19",
    "steamAppId": 1677110,
    "publisher": "Amplifier Creations"
  },
  {
    "title": "Evil West",
    "service": "gamepass",
    "start": "2024-03-26",
    "steamAppId": 1065310,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Harold Halibut",
    "service": "gamepass",
    "start": "2024-04-16",
    "steamAppId": 924750,
    "publisher": "Slow Bros."
  },
  {
    "title": "Eiyuden Chronicle: Hundred Heroes",
    "service": "gamepass",
    "start": "2024-04-23",
    "steamAppId": 1658280,
    "publisher": "505 Games"
  },
  {
    "title": "Another Crabs Treasure",
    "service": "gamepass",
    "start": "2024-04-25",
    "steamAppId": 1887840,
    "publisher": "Aggro Crab"
  },
  {
    "title": "Manor Lords",
    "service": "gamepass",
    "start": "2024-04-26",
    "steamAppId": 1363080,
    "publisher": "Hooded Horse"
  },
  {
    "title": "Little Kitty, Big City",
    "service": "gamepass",
    "start": "2024-05-07",
    "steamAppId": 1177980,
    "publisher": "Double Dagger Studio"
  },
  {
    "title": "Brothers: A Tale of Two Sons",
    "service": "gamepass",
    "start": "2024-05-14",
    "steamAppId": 225080,
    "publisher": "505 Games"
  },
  {
    "title": "Senuas Saga: Hellblade II",
    "service": "gamepass",
    "start": "2024-05-21",
    "steamAppId": 2461850,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Lords of the Fallen",
    "service": "gamepass",
    "start": "2024-05-28",
    "steamAppId": 1501750,
    "publisher": "CI Games"
  },
  {
    "title": "Octopath Traveler II",
    "service": "gamepass",
    "start": "2024-06-05",
    "steamAppId": 1971650,
    "publisher": "Square Enix"
  },
  {
    "title": "The Callisto Protocol",
    "service": "gamepass",
    "start": "2024-06-13",
    "steamAppId": 1544020,
    "publisher": "Krafton"
  },
  {
    "title": "Still Wakes the Deep",
    "service": "gamepass",
    "start": "2024-06-18",
    "steamAppId": 1622910,
    "publisher": "Secret Mode"
  },
  {
    "title": "Tchia",
    "service": "gamepass",
    "start": "2024-07-11",
    "steamAppId": 1496590,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "Flintlock: The Siege of Dawn",
    "service": "gamepass",
    "start": "2024-07-18",
    "steamAppId": 1832040,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "Dungeons of Hinterberg",
    "service": "gamepass",
    "start": "2024-07-18",
    "steamAppId": 1983260,
    "publisher": "Curve Games"
  },
  {
    "title": "Kunitsu-Gami: Path of the Goddess",
    "service": "gamepass",
    "start": "2024-07-19",
    "steamAppId": 2510710,
    "publisher": "Capcom"
  },
  {
    "title": "Creatures of Ava",
    "service": "gamepass",
    "start": "2024-08-07",
    "steamAppId": 2304440,
    "publisher": "11 bit studios"
  },
  {
    "title": "Mafia: Definitive Edition",
    "service": "gamepass",
    "start": "2024-08-13",
    "steamAppId": 1030840,
    "publisher": "2K"
  },
  {
    "title": "Atlas Fallen: Reign of Sand",
    "service": "gamepass",
    "start": "2024-08-22",
    "steamAppId": 1230530,
    "publisher": "Focus Entertainment"
  },
  {
    "title": "Star Trucker",
    "service": "gamepass",
    "start": "2024-09-03",
    "steamAppId": 2380050,
    "publisher": "Raw Fury"
  },
  {
    "title": "Age of Mythology: Retold",
    "service": "gamepass",
    "start": "2024-09-04",
    "steamAppId": 1934680,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Frostpunk 2",
    "service": "gamepass",
    "start": "2024-09-20",
    "steamAppId": 1601580,
    "publisher": "11 bit studios"
  },
  {
    "title": "Ara: History Untold",
    "service": "gamepass",
    "start": "2024-09-24",
    "steamAppId": 2021880,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Sifu",
    "service": "gamepass",
    "start": "2024-10-02",
    "steamAppId": 2138710,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "South Park: The Fractured But Whole",
    "service": "gamepass",
    "start": "2024-10-15",
    "steamAppId": 488790,
    "publisher": "Ubisoft"
  },
  {
    "title": "Call of Duty: Black Ops 6",
    "service": "gamepass",
    "start": "2024-10-25",
    "steamAppId": 2933620,
    "publisher": "Activision"
  },
  {
    "title": "Metal Slug Tactics",
    "service": "gamepass",
    "start": "2024-11-05",
    "steamAppId": 1590760,
    "publisher": "Dotemu"
  },
  {
    "title": "Microsoft Flight Simulator 2024",
    "service": "gamepass",
    "start": "2024-11-19",
    "steamAppId": 2537590,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "S.T.A.L.K.E.R. 2: Heart of Chornobyl",
    "service": "gamepass",
    "start": "2024-11-20",
    "steamAppId": 1643320,
    "publisher": "GSC Game World"
  },
  {
    "title": "Nine Sols",
    "service": "gamepass",
    "start": "2024-11-26",
    "steamAppId": 1809540,
    "publisher": "RedCandleGames"
  },
  {
    "title": "Indiana Jones and the Great Circle",
    "service": "gamepass",
    "start": "2024-12-09",
    "steamAppId": 2677660,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Eternal Strands",
    "service": "gamepass",
    "start": "2025-01-28",
    "steamAppId": 1574790,
    "publisher": "Yellow Brick Games"
  },
  {
    "title": "Sniper Elite: Resistance",
    "service": "gamepass",
    "start": "2025-01-30",
    "steamAppId": 2169200,
    "publisher": "Rebellion"
  },
  {
    "title": "Avowed",
    "service": "gamepass",
    "start": "2025-02-18",
    "steamAppId": 2457220,
    "publisher": "Xbox Game Studios"
  },
  {
    "title": "Atomfall",
    "service": "gamepass",
    "start": "2025-03-27",
    "steamAppId": 801800,
    "publisher": "Rebellion"
  },
  {
    "title": "Clair Obscur: Expedition 33",
    "service": "gamepass",
    "start": "2025-04-24",
    "steamAppId": 1903340,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "DOOM: The Dark Ages",
    "service": "gamepass",
    "start": "2025-05-15",
    "steamAppId": 3017860,
    "publisher": "Bethesda Softworks"
  },
  {
    "title": "Hollow Knight: Silksong",
    "service": "gamepass",
    "start": "2025-09-04",
    "steamAppId": 1030300,
    "publisher": "Team Cherry"
  },
  {
    "title": "DREDGE",
    "service": "gamepass",
    "start": "2026-05-06",
    "steamAppId": 1562430,
    "publisher": "Team17"
  },
  {
    "title": "Returnal",
    "service": "psplus_extra",
    "start": "2022-06-13",
    "steamAppId": 1649240,
    "publisher": "PlayStation Publishing"
  },
  {
    "title": "Stray",
    "service": "psplus_extra",
    "start": "2022-07-19",
    "steamAppId": 1332010,
    "publisher": "Annapurna Interactive"
  },
  {
    "title": "Horizon Forbidden West",
    "service": "psplus_extra",
    "start": "2023-02-21",
    "steamAppId": 2420110,
    "publisher": "PlayStation Publishing"
  },
  {
    "title": "Tchia",
    "service": "psplus_extra",
    "start": "2023-03-21",
    "steamAppId": 1496590,
    "publisher": "Kepler Interactive"
  },
  {
    "title": "Ratchet & Clank: Rift Apart",
    "service": "psplus_extra",
    "start": "2023-05-16",
    "steamAppId": 1895880,
    "publisher": "PlayStation Publishing"
  },
  {
    "title": "It Takes Two",
    "service": "psplus_extra",
    "start": "2023-07-18",
    "steamAppId": 1426210,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Sea of Stars",
    "service": "psplus_extra",
    "start": "2023-08-15",
    "steamAppId": 1244090,
    "publisher": "Sabotage Studio"
  },
  {
    "title": "Disco Elysium - The Final Cut",
    "service": "psplus_extra",
    "start": "2023-10-17",
    "steamAppId": 632470,
    "publisher": "ZA/UM"
  },
  {
    "title": "Teardown",
    "service": "psplus_extra",
    "start": "2023-11-21",
    "steamAppId": 1167630,
    "publisher": "Tuxedo Labs"
  },
  {
    "title": "Need for Speed Unbound",
    "service": "psplus_extra",
    "start": "2024-02-20",
    "steamAppId": 1846380,
    "publisher": "Electronic Arts"
  },
  {
    "title": "Marvels Midnight Suns",
    "service": "psplus_extra",
    "start": "2024-03-19",
    "steamAppId": 368260,
    "publisher": "2K"
  },
  {
    "title": "Dave the Diver",
    "service": "psplus_extra",
    "start": "2024-04-16",
    "steamAppId": 1868140,
    "publisher": "Mintrocket"
  },
  {
    "title": "Animal Well",
    "service": "psplus_extra",
    "start": "2024-05-09",
    "steamAppId": 813230,
    "publisher": "Bigmode"
  },
  {
    "title": "Monster Hunter Rise",
    "service": "psplus_extra",
    "start": "2024-06-18",
    "steamAppId": 1446780,
    "publisher": "Capcom"
  },
  {
    "title": "Remnant II",
    "service": "psplus_extra",
    "start": "2024-07-16",
    "steamAppId": 1282100,
    "publisher": "Gearbox Publishing"
  },
  {
    "title": "The Witcher 3: Wild Hunt",
    "service": "psplus_extra",
    "start": "2024-08-20",
    "steamAppId": 292030,
    "publisher": "CD PROJEKT RED"
  },
  {
    "title": "Cult of the Lamb",
    "service": "psplus_extra",
    "start": "2024-08-20",
    "steamAppId": 1313140,
    "publisher": "Devolver Digital"
  },
  {
    "title": "The Plucky Squire",
    "service": "psplus_extra",
    "start": "2024-09-17",
    "steamAppId": 1627570,
    "publisher": "Devolver Digital"
  },
  {
    "title": "Dead Island 2",
    "service": "psplus_extra",
    "start": "2024-10-15",
    "steamAppId": 934700,
    "publisher": "Deep Silver"
  },
  {
    "title": "Dying Light 2 Stay Human",
    "service": "psplus_extra",
    "start": "2024-11-19",
    "steamAppId": 534380,
    "publisher": "Techland"
  }
]`) as HistoryRecord[];

