"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("../config/config.json"));
const secureContainers = {
    "kappa": "5c093ca986f7740a1867ab12",
    "gamma": "5857a8bc2459772bad15db29",
    "epsilon": "59db794186f77448bc595262",
    "beta": "5857a8b324597729ab0a0e7d",
    "alpha": "544a11ac4bdc2d470e8b456a",
    "waistPouch": "5732ee6a24597719ae0c0281"
};
class Mod {
    container;
    postAkiLoad(container) {
        this.container = container;
    }
    postDBLoad(container) {
        const jsonUtil = container.resolve("JsonUtil");
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global);
        const SMALL_SICC_ID = "5d235bb686f77443f4331278";
        const itemId = "Revingly_MICC", itemCategory = "5795f317245977243854e041", itemFleaPrice = config.price, itemPrefabPath = "assets/content/items/containers/item_container_lopouch/micc.bundle", itemName = "Medical SICC", itemShortName = "MICC", itemDescription = "SICC for med items", itemTraderPrice = config.price;
        const item = jsonUtil.clone(tables.templates.items[SMALL_SICC_ID]);
        item._id = itemId;
        item._props.Prefab.path = itemPrefabPath;
        item._props.Grids = this.createGrid(container, itemId, config.columns);
        tables.templates.items[itemId] = item;
        // Add locales
        for (const locale of locales) {
            locale[`${itemId} Name`] = itemName;
            locale[`${itemId} ShortName`] = itemShortName;
            locale[`${itemId} Description`] = itemDescription;
        }
        handbook.Items.push({
            "Id": itemId,
            "ParentId": itemCategory,
            "Price": itemFleaPrice
        });
        const trader = tables.traders["54cb57776803fa99248b456e"];
        trader.assort.items.push({
            "_id": itemId,
            "_tpl": itemId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999
            }
        });
        trader.assort.barter_scheme[itemId] = [
            [
                {
                    "count": itemTraderPrice,
                    "_tpl": "5449016a4bdc2d6f028b456f" // roubles
                }
            ]
        ];
        trader.assort.loyal_level_items[itemId] = config.trader_loyalty_level;
        this.allowMiccIntoContainers(itemId, tables.templates.items, secureContainers);
        this.allowMiccIntoContainers(itemId, tables.templates.items, config.containers);
    }
    allowMiccIntoContainers(itemId, items, containers) {
        let currentCase = null;
        try {
            for (const secureCase in containers) {
                currentCase = secureCase;
                items[containers[secureCase]]
                    ._props
                    .Grids[0]
                    ._props
                    .filters[0]
                    .Filter
                    .push(itemId);
            }
        }
        catch (error) {
            // In case a mod that changes the containers does remove the 'Filter' from filters array
            items[containers[currentCase]]
                ._props
                .Grids[0]
                ._props
                .filters
                .push({ "Filter": [itemId] });
        }
    }
    createGrid(container, itemId, columns) {
        const grids = [];
        for (const [key, val] of Object.entries(columns)) {
            grids.push(this.generateColumn(container, itemId, `column_${key}`, val.cellH, val.cellV));
        }
        return grids;
    }
    generateColumn(container, itemId, name, cellH, cellV) {
        const hashUtil = container.resolve("HashUtil");
        const MEDS = "543be5664bdc2dd4348b4569";
        const INJECTOR_CASE = "619cbf7d23893217ec30b689";
        const MEDICAL_SUPPLIES = "57864c8c245977548867e7f1";
        return {
            "_name": name,
            "_id": hashUtil.generate(),
            "_parent": itemId,
            "_props": {
                "filters": [
                    {
                        "Filter": [MEDS, INJECTOR_CASE, MEDICAL_SUPPLIES],
                        "ExcludedFilter": []
                    }
                ],
                "cellsH": cellH,
                "cellsV": cellV,
                "minCount": 0,
                "maxCount": 0,
                "maxWeight": 0,
                "isSortingTable": false
            },
            "_proto": "55d329c24bdc2d892f8b4567"
        };
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map