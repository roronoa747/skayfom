# Graph Report - C:\\Users\\ilyas\\Documents\\skayfom  (2026-06-16)

## Corpus Check
- Corpus is ~12 235 words - fits in a single context window. You may not need a graph.

## Summary
- 209 nodes · 141 edges · 164 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Structure Signals
- Entity graph basis: 54 non-file, non-concept node(s)
- Weakly connected components: 13
- Singleton components: 10
- Isolated nodes: 10
- Largest component: 40 node(s) (74% of the entity graph basis)
- Low-cohesion communities: 0
- Largest low-cohesion community: none on the entity graph basis

## Workspace Bridges
1. `init\(\)` - connects `Entities UI — Card`, `Features UI`, `Features UI — Filters`, `Shared Catalog`, `Shared Marquee`; home: `App Model — Init`; degree 9; score 81.34
  source files: `C:/Users/ilyas/Documents/skayfom/src/app/main.js`, `C:/Users/ilyas/Documents/skayfom/src/entities/cart/model.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/model.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/shared/api/catalog.js`, `C:/Users/ilyas/Documents/skayfom/src/widgets/catalog/ui.js`
2. `initEventListeners\(\)` - connects `App Model — Init`, `Entities UI — Card`, `Features Model`, `Shared Loader`; home: `Features UI`; degree 9; score 65.94
  source files: `C:/Users/ilyas/Documents/skayfom/src/app/main.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/model.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/features/mixBuilder/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/shared/ui/loader.js`, `C:/Users/ilyas/Documents/skayfom/src/widgets/catalog/ui.js`
3. `renderBrandFilters\(\)` - connects `App Model — Init`, `Features Model`, `Shared Marquee`; home: `Features UI — Filters`; degree 5; score 99.47
  source files: `C:/Users/ilyas/Documents/skayfom/src/app/main.js`, `C:/Users/ilyas/Documents/skayfom/src/features/catalogFilters/model.js`, `C:/Users/ilyas/Documents/skayfom/src/features/catalogFilters/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/model.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/shared/ui/marquee.js`
4. `renderCatalog\(\)` - connects `App Model — Init`, `Features UI`, `Shared Scroll`; home: `Entities UI — Card`; degree 4; score 37.42
  source files: `C:/Users/ilyas/Documents/skayfom/src/app/main.js`, `C:/Users/ilyas/Documents/skayfom/src/entities/product/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/shared/ui/scroll.js`, `C:/Users/ilyas/Documents/skayfom/src/widgets/catalog/ui.js`
5. `renderVibeFilters\(\)` - connects `App Model — Init`, `Features Model`; home: `Shared Marquee`; degree 3; score 34.33
  source files: `C:/Users/ilyas/Documents/skayfom/src/app/main.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/model.js`, `C:/Users/ilyas/Documents/skayfom/src/features/filters/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/shared/ui/marquee.js`
6. `initJSMarquee\(\)` - connects `Features UI — Filters`; home: `Shared Marquee`; degree 3; score 72.37
  source files: `C:/Users/ilyas/Documents/skayfom/src/features/filters/ui.js`, `C:/Users/ilyas/Documents/skayfom/src/shared/ui/marquee.js`

## God Nodes
1. `notify\(\)` - 13 edges
2. `init\(\)` - 10 edges
3. `initEventListeners\(\)` - 10 edges
4. `renderBrandFilters\(\)` - 7 edges
5. `initJSMarquee\(\)` - 6 edges
6. `renderCatalog\(\)` - 6 edges
7. `renderCartUI\(\)` - 5 edges
8. `renderVibeFilters\(\)` - 5 edges
9. `setFilters\(\)` - 5 edges
10. `addToCart\(\)` - 4 edges

## Surprising Connections
- `init\(\)` --calls--> `renderBrandFilters\(\)`  [EXTRACTED]
  C:/Users/ilyas/Documents/skayfom/src/app/main.js → C:/Users/ilyas/Documents/skayfom/src/features/filters/ui.js  _bridges separate communities_
- `init\(\)` --calls--> `renderVibeFilters\(\)`  [EXTRACTED]
  C:/Users/ilyas/Documents/skayfom/src/app/main.js → C:/Users/ilyas/Documents/skayfom/src/features/filters/ui.js  _bridges separate communities_
- `init\(\)` --calls--> `renderCatalog\(\)`  [EXTRACTED]
  C:/Users/ilyas/Documents/skayfom/src/app/main.js → C:/Users/ilyas/Documents/skayfom/src/widgets/catalog/ui.js  _bridges separate communities_
- `init\(\)` --calls--> `loadCatalogData\(\)`  [EXTRACTED]
  C:/Users/ilyas/Documents/skayfom/src/app/main.js → C:/Users/ilyas/Documents/skayfom/src/shared/api/catalog.js  _bridges separate communities_
- `handleAddToCart\(\)` --calls--> `addToCart\(\)`  [EXTRACTED]
  C:/Users/ilyas/Documents/skayfom/src/app/main.js → C:/Users/ilyas/Documents/skayfom/src/entities/cart/model.js  _bridges separate communities_

## Semantic Anomalies
- **[HIGH] Bridge node** - renderBrandFilters\(\) bridges Features UI — Filters and Entities UI, App Model, App Model — Init, Features Model, Shared Marquee.
  _High betweenness centrality \(64.466\) across 6 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - initJSMarquee\(\) bridges Shared Marquee and App Model, Entities UI, Features UI — Filters.
  _High betweenness centrality \(59.367\) across 4 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - init\(\) bridges App Model — Init and App Model, Features UI, Features UI — Filters, Shared Marquee, Entities UI — Card, Shared Catalog.
  _High betweenness centrality \(22.341\) across 7 communities makes this node a likely dependency chokepoint._
- **[HIGH] Cross-boundary edge** - handleAddToCart\(\) → addToCart\(\) crosses graph boundaries in an unexpected way.
  _bridges separate communities_
- **[HIGH] Cross-boundary edge** - init\(\) → loadCatalogData\(\) crosses graph boundaries in an unexpected way.
  _bridges separate communities_

## Communities

### Community 0 - "Features Model"
Cohesion (entity basis within full-graph community): 0.15
Nodes (13): addToCart\(\), clearFilters\(\), clearIngredients\(\), notify\(\), removeFromCart\(\), setBrand\(\), setProductCategory\(\), setSearchQuery\(\) (+5 more)

### Community 1 - "App Model"
Cohesion (entity basis within full-graph community): 0
Nodes (7): closeOrderModal\(\), initDeliveryMap\(\), initReviewsSlider\(\), initYandexSuggest\(\), showErrorState\(\), updateAddressFromCoords\(\), getCartTotal\(\)

### Community 2 - "App Model — Init"
Cohesion (entity basis within full-graph community): 0.4
Nodes (5): checkAgeGate\(\), init\(\), initDOM\(\), subscribeToCart\(\), subscribeToFilters\(\)

### Community 3 - "Shared Marquee"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): initJSMarquee\(\), autoScroll\(\), renderVibeFilters\(\)

### Community 4 - "Shared Catalog"
Cohesion (entity basis within full-graph community): 0
Nodes (2): loadCatalogData\(\), loadFallback\(\)

### Community 5 - "Shared Loader"
Cohesion (entity basis within full-graph community): 1
Nodes (2): triggerSmoke\(\), generateWhatsAppLink\(\)

### Community 6 - "Features UI"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): initEventListeners\(\), initMixBuilderUI\(\), initStaticFilters\(\)

### Community 7 - "App Model — Cart"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): openCartDrawer\(\), renderCartUI\(\), getCartCount\(\)

### Community 8 - "Features UI — Filters"
Cohesion (entity basis within full-graph community): 1
Nodes (3): setFilters\(\), renderBrandFilters\(\), renderCategoryFilters\(\)

### Community 9 - "App Location"
Cohesion (entity basis within full-graph community): 1
Nodes (2): fallbackLocationDetection\(\), showLocationError\(\)

### Community 10 - "App Add"
Cohesion (entity basis within full-graph community): 1
Nodes (2): handleAddToCart\(\), showToast\(\)

### Community 11 - "App Builder"
Cohesion (entity basis within full-graph community): 1
Nodes (2): initResponsiveMixBuilder\(\), moveMixBuilder\(\)

### Community 12 - "Match Images"
Cohesion (entity basis within full-graph community): 1
Nodes (1): getAllFiles\(\)

### Community 13 - "Features Model — Changed"
Cohesion (entity basis within full-graph community): 1
Nodes (2): notifyFiltersChanged\(\), toggleSetFilter\(\)

### Community 14 - "Shared Scroll"
Cohesion (entity basis within full-graph community): 1
Nodes (1): initScrollReveal\(\)

### Community 15 - "Entities UI"
Cohesion (entity basis within full-graph community): 1
Nodes (1): createCartItemElement\(\)

### Community 16 - "Entities UI — Card"
Cohesion (entity basis within full-graph community): 1
Nodes (2): createCard\(\), renderCatalog\(\)

### Community 17 - "1009 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 18 - "1011 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 19 - "110 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 20 - "1101 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 21 - "1103 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 22 - "1104 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 23 - "1105 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 24 - "1108 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 25 - "1109 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 26 - "1110 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 27 - "1111 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 28 - "1112 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 29 - "1114 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 30 - "1115 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 31 - "1116 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 32 - "1117 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 33 - "117 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 34 - "1201 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 35 - "1202 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 36 - "1203 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 37 - "1204 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 38 - "1206 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 39 - "1207 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 40 - "1208 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 41 - "1209 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 42 - "121 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 43 - "1211 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 44 - "1213 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 45 - "1214 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 46 - "1215 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 47 - "1216 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 48 - "1217 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 49 - "1218 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 50 - "1219 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 51 - "122 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 52 - "1220 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 53 - "1221 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 54 - "1222 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 55 - "1223 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 56 - "1224 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 57 - "1226 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 58 - "1227 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 59 - "1228 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 60 - "1229 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 61 - "1230 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 62 - "1231 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 63 - "1232 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 64 - "1233 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 65 - "1234 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 66 - "1235 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 67 - "1236 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 68 - "1237 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 69 - "1238 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 70 - "1239 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 71 - "1240 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 72 - "1241 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 73 - "1242 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 74 - "1243 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 75 - "1244 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 76 - "1245 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 77 - "1246 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 78 - "1247 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 79 - "1249 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 80 - "1250 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 81 - "136 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 82 - "137 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 83 - "1410 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 84 - "401 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 85 - "402 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 86 - "404 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 87 - "405 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 88 - "406 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 89 - "407 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 90 - "409 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 91 - "411 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 92 - "412 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 93 - "413 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 94 - "415 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 95 - "416 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 96 - "417 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 97 - "418 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 98 - "419 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 99 - "420 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 100 - "421 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 101 - "422 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 102 - "423 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 103 - "424 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 104 - "425 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 105 - "426 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 106 - "427 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 107 - "428 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 108 - "501 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 109 - "502 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 110 - "503 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 111 - "504 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 112 - "505 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 113 - "506 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 114 - "507 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 115 - "508 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 116 - "509 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 117 - "510 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 118 - "511 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 119 - "512 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 120 - "513 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 121 - "516 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 122 - "517 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 123 - "518 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 124 - "520 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 125 - "522 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 126 - "523 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 127 - "524 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 128 - "525 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 129 - "526 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 130 - "527 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 131 - "528 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 132 - "530 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 133 - "532 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 134 - "533 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 135 - "535 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 136 - "537 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 137 - "538 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 138 - "539 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 139 - "540 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 140 - "541 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 141 - "543 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 142 - "545 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 143 - "709 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 144 - "808 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 145 - "818 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 146 - "Favicon SVG"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 147 - "Insta1 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 148 - "Insta2 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 149 - "Logo Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 150 - "Match Images Fast Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 151 - "Match Images Final Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 152 - "Parse Overdose Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 153 - "Parse Yandex Disk Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 154 - "Reprocess Png Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 155 - "Resolve Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 156 - "Search Yandex Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 157 - "Semantic Match Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 158 - "Server Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 159 - "Test Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 160 - "Test Dl Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 161 - "Test Out Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 162 - "Test Png Ps1"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 163 - "Vite Config Js"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

## Knowledge Gaps
- **30 weakly connected node(s):** `getAllFiles\(\)`, `initDOM\(\)`, `showToast\(\)`, `initYandexSuggest\(\)`, `checkAgeGate\(\)` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `App Location`** (2 nodes): `fallbackLocationDetection\(\)`, `showLocationError\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Add`** (2 nodes): `handleAddToCart\(\)`, `showToast\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Builder`** (2 nodes): `initResponsiveMixBuilder\(\)`, `moveMixBuilder\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Match Images`** (2 nodes): `match\_images.ps1`, `getAllFiles\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Features Model — Changed`** (2 nodes): `notifyFiltersChanged\(\)`, `toggleSetFilter\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Shared Scroll`** (2 nodes): `scroll.js`, `initScrollReveal\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Entities UI`** (2 nodes): `ui.js`, `createCartItemElement\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Entities UI — Card`** (2 nodes): `createCard\(\)`, `renderCatalog\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1009 Png`** (1 nodes): `1009.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1011 Png`** (1 nodes): `1011.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `110 Png`** (1 nodes): `110.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1101 Png`** (1 nodes): `1101.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1103 Png`** (1 nodes): `1103.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1104 Png`** (1 nodes): `1104.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1105 Png`** (1 nodes): `1105.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1108 Png`** (1 nodes): `1108.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1109 Png`** (1 nodes): `1109.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1110 Png`** (1 nodes): `1110.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1111 Png`** (1 nodes): `1111.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1112 Png`** (1 nodes): `1112.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1114 Png`** (1 nodes): `1114.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1115 Png`** (1 nodes): `1115.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1116 Png`** (1 nodes): `1116.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1117 Png`** (1 nodes): `1117.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `117 Png`** (1 nodes): `117.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1201 Png`** (1 nodes): `1201.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1202 Png`** (1 nodes): `1202.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1203 Png`** (1 nodes): `1203.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1204 Png`** (1 nodes): `1204.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1206 Png`** (1 nodes): `1206.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1207 Png`** (1 nodes): `1207.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1208 Png`** (1 nodes): `1208.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1209 Png`** (1 nodes): `1209.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `121 Png`** (1 nodes): `121.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1211 Png`** (1 nodes): `1211.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1213 Png`** (1 nodes): `1213.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1214 Png`** (1 nodes): `1214.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1215 Png`** (1 nodes): `1215.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1216 Png`** (1 nodes): `1216.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1217 Png`** (1 nodes): `1217.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1218 Png`** (1 nodes): `1218.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1219 Png`** (1 nodes): `1219.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `122 Png`** (1 nodes): `122.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1220 Png`** (1 nodes): `1220.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1221 Png`** (1 nodes): `1221.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1222 Png`** (1 nodes): `1222.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1223 Png`** (1 nodes): `1223.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1224 Png`** (1 nodes): `1224.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1226 Png`** (1 nodes): `1226.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1227 Png`** (1 nodes): `1227.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1228 Png`** (1 nodes): `1228.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1229 Png`** (1 nodes): `1229.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1230 Png`** (1 nodes): `1230.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1231 Png`** (1 nodes): `1231.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1232 Png`** (1 nodes): `1232.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1233 Png`** (1 nodes): `1233.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1234 Png`** (1 nodes): `1234.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1235 Png`** (1 nodes): `1235.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1236 Png`** (1 nodes): `1236.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1237 Png`** (1 nodes): `1237.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1238 Png`** (1 nodes): `1238.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1239 Png`** (1 nodes): `1239.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1240 Png`** (1 nodes): `1240.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1241 Png`** (1 nodes): `1241.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1242 Png`** (1 nodes): `1242.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1243 Png`** (1 nodes): `1243.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1244 Png`** (1 nodes): `1244.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1245 Png`** (1 nodes): `1245.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1246 Png`** (1 nodes): `1246.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1247 Png`** (1 nodes): `1247.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1249 Png`** (1 nodes): `1249.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1250 Png`** (1 nodes): `1250.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `136 Png`** (1 nodes): `136.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `137 Png`** (1 nodes): `137.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `1410 Png`** (1 nodes): `1410.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `401 Png`** (1 nodes): `401.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `402 Png`** (1 nodes): `402.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `404 Png`** (1 nodes): `404.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `405 Png`** (1 nodes): `405.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `406 Png`** (1 nodes): `406.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `407 Png`** (1 nodes): `407.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `409 Png`** (1 nodes): `409.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `411 Png`** (1 nodes): `411.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `412 Png`** (1 nodes): `412.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `413 Png`** (1 nodes): `413.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `415 Png`** (1 nodes): `415.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `416 Png`** (1 nodes): `416.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `417 Png`** (1 nodes): `417.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `418 Png`** (1 nodes): `418.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `419 Png`** (1 nodes): `419.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `420 Png`** (1 nodes): `420.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `421 Png`** (1 nodes): `421.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `422 Png`** (1 nodes): `422.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `423 Png`** (1 nodes): `423.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `424 Png`** (1 nodes): `424.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `425 Png`** (1 nodes): `425.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `426 Png`** (1 nodes): `426.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `427 Png`** (1 nodes): `427.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `428 Png`** (1 nodes): `428.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `501 Png`** (1 nodes): `501.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `502 Png`** (1 nodes): `502.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `503 Png`** (1 nodes): `503.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `504 Png`** (1 nodes): `504.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `505 Png`** (1 nodes): `505.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `506 Png`** (1 nodes): `506.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `507 Png`** (1 nodes): `507.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `508 Png`** (1 nodes): `508.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `509 Png`** (1 nodes): `509.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `510 Png`** (1 nodes): `510.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `511 Png`** (1 nodes): `511.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `512 Png`** (1 nodes): `512.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `513 Png`** (1 nodes): `513.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `516 Png`** (1 nodes): `516.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `517 Png`** (1 nodes): `517.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `518 Png`** (1 nodes): `518.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `520 Png`** (1 nodes): `520.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `522 Png`** (1 nodes): `522.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `523 Png`** (1 nodes): `523.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `524 Png`** (1 nodes): `524.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `525 Png`** (1 nodes): `525.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `526 Png`** (1 nodes): `526.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `527 Png`** (1 nodes): `527.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `528 Png`** (1 nodes): `528.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `530 Png`** (1 nodes): `530.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `532 Png`** (1 nodes): `532.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `533 Png`** (1 nodes): `533.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `535 Png`** (1 nodes): `535.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `537 Png`** (1 nodes): `537.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `538 Png`** (1 nodes): `538.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `539 Png`** (1 nodes): `539.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `540 Png`** (1 nodes): `540.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `541 Png`** (1 nodes): `541.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `543 Png`** (1 nodes): `543.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `545 Png`** (1 nodes): `545.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `709 Png`** (1 nodes): `709.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `808 Png`** (1 nodes): `808.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `818 Png`** (1 nodes): `818.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Favicon SVG`** (1 nodes): `favicon.svg`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Insta1 Png`** (1 nodes): `insta1.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Insta2 Png`** (1 nodes): `insta2.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Logo Png`** (1 nodes): `logo.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Match Images Fast Ps1`** (1 nodes): `match\_images\_fast.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Match Images Final Ps1`** (1 nodes): `match\_images\_final.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Parse Overdose Ps1`** (1 nodes): `parse\_overdose.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Parse Yandex Disk Ps1`** (1 nodes): `parse\_yandex\_disk.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Reprocess Png Ps1`** (1 nodes): `reprocess\_png.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Resolve Ps1`** (1 nodes): `resolve.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Search Yandex Ps1`** (1 nodes): `search\_yandex.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Semantic Match Ps1`** (1 nodes): `semantic\_match.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Server Ps1`** (1 nodes): `server.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test Png`** (1 nodes): `test.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test Dl Png`** (1 nodes): `test\_dl.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test Out Png`** (1 nodes): `test\_out.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Test Png Ps1`** (1 nodes): `test\_png.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Vite Config Js`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does \`renderBrandFilters\(\)\` connect \`Features UI — Filters\` to \`Entities UI\`, \`App Model\`, \`App Model — Init\`, \`Features Model\`, \`Shared Marquee\`?**
  _High betweenness centrality \(64.466\) - this node is a cross-community bridge._
- **Why does \`initJSMarquee\(\)\` connect \`Shared Marquee\` to \`App Model\`, \`Entities UI\`, \`Features UI — Filters\`?**
  _High betweenness centrality \(59.367\) - this node is a cross-community bridge._
- **Why does \`initResponsiveMixBuilder\(\)\` connect \`App Builder\` to \`App Model\`?**
  _High betweenness centrality \(58.000\) - this node is a cross-community bridge._
- **What connects \`getAllFiles\(\)\`, \`initDOM\(\)\`, \`showToast\(\)\` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
