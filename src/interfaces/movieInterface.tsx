// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Welcome {
    items: Item[];
}

export interface Item {
    kind:       string;
    id:         string;
    etag:       string;
    selfLink:   string;
    volumeInfo: VolumeInfo;
    saleInfo:   SaleInfo;
    accessInfo: AccessInfo;
    searchInfo: SearchInfo;
}

export interface AccessInfo {
    country:                string;
    viewability:            string;
    embeddable:             boolean;
    publicDomain:           boolean;
    textToSpeechPermission: string;
    epub:                   Epub;
    pdf:                    Epub;
    webReaderLink:          string;
    accessViewStatus:       string;
    quoteSharingAllowed:    boolean;
}

export interface Epub {
    isAvailable: boolean;
}

export interface SaleInfo {
    country:     string;
    saleability: string;
    isEbook:     boolean;
}

export interface SearchInfo {
    textSnippet: string;
}

export interface VolumeInfo {
    title:               string;
    subtitle:            string;
    authors:             string[];
    publisher:           string;
    publishedDate:       Date;
    description:         string;
    industryIdentifiers: IndustryIdentifier[];
    readingModes:        ReadingModes;
    pageCount:           number;
    printType:           string;
    categories:          string[];
    maturityRating:      string;
    allowAnonLogging:    boolean;
    contentVersion:      string;
    panelizationSummary: PanelizationSummary;
    imageLinks:          ImageLinks;
    language:            string;
    previewLink:         string;
    infoLink:            string;
    canonicalVolumeLink: string;
}

export interface ImageLinks {
    smallThumbnail: string;
    thumbnail:      string;
}

export interface IndustryIdentifier {
    type:       string;
    identifier: string;
}

export interface PanelizationSummary {
    containsEpubBubbles:  boolean;
    containsImageBubbles: boolean;
}

export interface ReadingModes {
    text:  boolean;
    image: boolean;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toWelcome(json: string): Welcome {
        return cast(JSON.parse(json), r("Welcome"));
    }

    public static welcomeToJson(value: Welcome): string {
        return JSON.stringify(uncast(value, r("Welcome")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Welcome": o([
        { json: "items", js: "items", typ: a(r("Item")) },
    ], false),
    "Item": o([
        { json: "kind", js: "kind", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "etag", js: "etag", typ: "" },
        { json: "selfLink", js: "selfLink", typ: "" },
        { json: "volumeInfo", js: "volumeInfo", typ: r("VolumeInfo") },
        { json: "saleInfo", js: "saleInfo", typ: r("SaleInfo") },
        { json: "accessInfo", js: "accessInfo", typ: r("AccessInfo") },
        { json: "searchInfo", js: "searchInfo", typ: r("SearchInfo") },
    ], false),
    "AccessInfo": o([
        { json: "country", js: "country", typ: "" },
        { json: "viewability", js: "viewability", typ: "" },
        { json: "embeddable", js: "embeddable", typ: true },
        { json: "publicDomain", js: "publicDomain", typ: true },
        { json: "textToSpeechPermission", js: "textToSpeechPermission", typ: "" },
        { json: "epub", js: "epub", typ: r("Epub") },
        { json: "pdf", js: "pdf", typ: r("Epub") },
        { json: "webReaderLink", js: "webReaderLink", typ: "" },
        { json: "accessViewStatus", js: "accessViewStatus", typ: "" },
        { json: "quoteSharingAllowed", js: "quoteSharingAllowed", typ: true },
    ], false),
    "Epub": o([
        { json: "isAvailable", js: "isAvailable", typ: true },
    ], false),
    "SaleInfo": o([
        { json: "country", js: "country", typ: "" },
        { json: "saleability", js: "saleability", typ: "" },
        { json: "isEbook", js: "isEbook", typ: true },
    ], false),
    "SearchInfo": o([
        { json: "textSnippet", js: "textSnippet", typ: "" },
    ], false),
    "VolumeInfo": o([
        { json: "title", js: "title", typ: "" },
        { json: "subtitle", js: "subtitle", typ: "" },
        { json: "authors", js: "authors", typ: a("") },
        { json: "publisher", js: "publisher", typ: "" },
        { json: "publishedDate", js: "publishedDate", typ: Date },
        { json: "description", js: "description", typ: "" },
        { json: "industryIdentifiers", js: "industryIdentifiers", typ: a(r("IndustryIdentifier")) },
        { json: "readingModes", js: "readingModes", typ: r("ReadingModes") },
        { json: "pageCount", js: "pageCount", typ: 0 },
        { json: "printType", js: "printType", typ: "" },
        { json: "categories", js: "categories", typ: a("") },
        { json: "maturityRating", js: "maturityRating", typ: "" },
        { json: "allowAnonLogging", js: "allowAnonLogging", typ: true },
        { json: "contentVersion", js: "contentVersion", typ: "" },
        { json: "panelizationSummary", js: "panelizationSummary", typ: r("PanelizationSummary") },
        { json: "imageLinks", js: "imageLinks", typ: r("ImageLinks") },
        { json: "language", js: "language", typ: "" },
        { json: "previewLink", js: "previewLink", typ: "" },
        { json: "infoLink", js: "infoLink", typ: "" },
        { json: "canonicalVolumeLink", js: "canonicalVolumeLink", typ: "" },
    ], false),
    "ImageLinks": o([
        { json: "smallThumbnail", js: "smallThumbnail", typ: "" },
        { json: "thumbnail", js: "thumbnail", typ: "" },
    ], false),
    "IndustryIdentifier": o([
        { json: "type", js: "type", typ: "" },
        { json: "identifier", js: "identifier", typ: "" },
    ], false),
    "PanelizationSummary": o([
        { json: "containsEpubBubbles", js: "containsEpubBubbles", typ: true },
        { json: "containsImageBubbles", js: "containsImageBubbles", typ: true },
    ], false),
    "ReadingModes": o([
        { json: "text", js: "text", typ: true },
        { json: "image", js: "image", typ: true },
    ], false),
};
