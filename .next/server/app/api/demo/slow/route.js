/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/demo/slow/route";
exports.ids = ["app/api/demo/slow/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fslow%2Froute&page=%2Fapi%2Fdemo%2Fslow%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fslow%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fslow%2Froute&page=%2Fapi%2Fdemo%2Fslow%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fslow%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_ciigan_gemini_antigravity_scratch_frontend_opt_demo_src_app_api_demo_slow_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/demo/slow/route.ts */ \"(rsc)/./src/app/api/demo/slow/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/demo/slow/route\",\n        pathname: \"/api/demo/slow\",\n        filename: \"route\",\n        bundlePath: \"app/api/demo/slow/route\"\n    },\n    resolvedPagePath: \"/home/ciigan/.gemini/antigravity/scratch/frontend-opt-demo/src/app/api/demo/slow/route.ts\",\n    nextConfigOutput,\n    userland: _home_ciigan_gemini_antigravity_scratch_frontend_opt_demo_src_app_api_demo_slow_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkZW1vJTJGc2xvdyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZGVtbyUyRnNsb3clMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZkZW1vJTJGc2xvdyUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGY2lpZ2FuJTJGLmdlbWluaSUyRmFudGlncmF2aXR5JTJGc2NyYXRjaCUyRmZyb250ZW5kLW9wdC1kZW1vJTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGY2lpZ2FuJTJGLmdlbWluaSUyRmFudGlncmF2aXR5JTJGc2NyYXRjaCUyRmZyb250ZW5kLW9wdC1kZW1vJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN5QztBQUN0SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvY2lpZ2FuLy5nZW1pbmkvYW50aWdyYXZpdHkvc2NyYXRjaC9mcm9udGVuZC1vcHQtZGVtby9zcmMvYXBwL2FwaS9kZW1vL3Nsb3cvcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2RlbW8vc2xvdy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2RlbW8vc2xvd1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZGVtby9zbG93L3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvY2lpZ2FuLy5nZW1pbmkvYW50aWdyYXZpdHkvc2NyYXRjaC9mcm9udGVuZC1vcHQtZGVtby9zcmMvYXBwL2FwaS9kZW1vL3Nsb3cvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fslow%2Froute&page=%2Fapi%2Fdemo%2Fslow%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fslow%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/demo/slow/route.ts":
/*!****************************************!*\
  !*** ./src/app/api/demo/slow/route.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nconst dynamic = \"force-dynamic\";\nconst PAYLOADS = {\n    user: {\n        endpoint: \"/api/demo/slow?name=user\",\n        account: \"Nhóm Thuyết Trình Frontend\",\n        plan: \"Enterprise\"\n    },\n    orders: {\n        endpoint: \"/api/demo/slow?name=orders\",\n        recentOrders: 28,\n        pendingShipment: 3\n    },\n    recs: {\n        endpoint: \"/api/demo/slow?name=recs\",\n        suggestedSkus: [\n            \"SP-0102\",\n            \"SP-0441\",\n            \"SP-1208\",\n            \"SP-2910\"\n        ]\n    }\n};\nasync function GET(request) {\n    const t0 = performance.now();\n    const { searchParams } = new URL(request.url);\n    const name = searchParams.get(\"name\") || \"task\";\n    const delay = Math.min(2000, Math.max(0, Number(searchParams.get(\"delay\") ?? 300)));\n    await new Promise((resolve)=>setTimeout(resolve, delay));\n    const serverElapsedMs = Math.round(performance.now() - t0);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        name,\n        requestedDelayMs: delay,\n        serverElapsedMs,\n        finishedAt: new Date().toISOString(),\n        data: PAYLOADS[name] ?? {\n            endpoint: name\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9kZW1vL3Nsb3cvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTJDO0FBRXBDLE1BQU1DLFVBQVUsZ0JBQWdCO0FBRXZDLE1BQU1DLFdBQW1DO0lBQ3ZDQyxNQUFNO1FBQ0pDLFVBQVU7UUFDVkMsU0FBUztRQUNUQyxNQUFNO0lBQ1I7SUFDQUMsUUFBUTtRQUNOSCxVQUFVO1FBQ1ZJLGNBQWM7UUFDZEMsaUJBQWlCO0lBQ25CO0lBQ0FDLE1BQU07UUFDSk4sVUFBVTtRQUNWTyxlQUFlO1lBQUM7WUFBVztZQUFXO1lBQVc7U0FBVTtJQUM3RDtBQUNGO0FBRU8sZUFBZUMsSUFBSUMsT0FBZ0I7SUFDeEMsTUFBTUMsS0FBS0MsWUFBWUMsR0FBRztJQUMxQixNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlMLFFBQVFNLEdBQUc7SUFDNUMsTUFBTUMsT0FBT0gsYUFBYUksR0FBRyxDQUFDLFdBQVc7SUFDekMsTUFBTUMsUUFBUUMsS0FBS0MsR0FBRyxDQUFDLE1BQU1ELEtBQUtFLEdBQUcsQ0FBQyxHQUFHQyxPQUFPVCxhQUFhSSxHQUFHLENBQUMsWUFBWTtJQUU3RSxNQUFNLElBQUlNLFFBQVEsQ0FBQ0MsVUFBWUMsV0FBV0QsU0FBU047SUFDbkQsTUFBTVEsa0JBQWtCUCxLQUFLUSxLQUFLLENBQUNoQixZQUFZQyxHQUFHLEtBQUtGO0lBRXZELE9BQU9kLHFEQUFZQSxDQUFDZ0MsSUFBSSxDQUFDO1FBQ3ZCWjtRQUNBYSxrQkFBa0JYO1FBQ2xCUTtRQUNBSSxZQUFZLElBQUlDLE9BQU9DLFdBQVc7UUFDbENDLE1BQU1uQyxRQUFRLENBQUNrQixLQUFLLElBQUk7WUFBRWhCLFVBQVVnQjtRQUFLO0lBQzNDO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL2NpaWdhbi8uZ2VtaW5pL2FudGlncmF2aXR5L3NjcmF0Y2gvZnJvbnRlbmQtb3B0LWRlbW8vc3JjL2FwcC9hcGkvZGVtby9zbG93L3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuXG5leHBvcnQgY29uc3QgZHluYW1pYyA9IFwiZm9yY2UtZHluYW1pY1wiO1xuXG5jb25zdCBQQVlMT0FEUzogUmVjb3JkPHN0cmluZywgb2JqZWN0PiA9IHtcbiAgdXNlcjoge1xuICAgIGVuZHBvaW50OiBcIi9hcGkvZGVtby9zbG93P25hbWU9dXNlclwiLFxuICAgIGFjY291bnQ6IFwiTmjDs20gVGh1eeG6v3QgVHLDrG5oIEZyb250ZW5kXCIsXG4gICAgcGxhbjogXCJFbnRlcnByaXNlXCIsXG4gIH0sXG4gIG9yZGVyczoge1xuICAgIGVuZHBvaW50OiBcIi9hcGkvZGVtby9zbG93P25hbWU9b3JkZXJzXCIsXG4gICAgcmVjZW50T3JkZXJzOiAyOCxcbiAgICBwZW5kaW5nU2hpcG1lbnQ6IDMsXG4gIH0sXG4gIHJlY3M6IHtcbiAgICBlbmRwb2ludDogXCIvYXBpL2RlbW8vc2xvdz9uYW1lPXJlY3NcIixcbiAgICBzdWdnZXN0ZWRTa3VzOiBbXCJTUC0wMTAyXCIsIFwiU1AtMDQ0MVwiLCBcIlNQLTEyMDhcIiwgXCJTUC0yOTEwXCJdLFxuICB9LFxufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgY29uc3QgbmFtZSA9IHNlYXJjaFBhcmFtcy5nZXQoXCJuYW1lXCIpIHx8IFwidGFza1wiO1xuICBjb25zdCBkZWxheSA9IE1hdGgubWluKDIwMDAsIE1hdGgubWF4KDAsIE51bWJlcihzZWFyY2hQYXJhbXMuZ2V0KFwiZGVsYXlcIikgPz8gMzAwKSkpO1xuXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGRlbGF5KSk7XG4gIGNvbnN0IHNlcnZlckVsYXBzZWRNcyA9IE1hdGgucm91bmQocGVyZm9ybWFuY2Uubm93KCkgLSB0MCk7XG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICBuYW1lLFxuICAgIHJlcXVlc3RlZERlbGF5TXM6IGRlbGF5LFxuICAgIHNlcnZlckVsYXBzZWRNcyxcbiAgICBmaW5pc2hlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgZGF0YTogUEFZTE9BRFNbbmFtZV0gPz8geyBlbmRwb2ludDogbmFtZSB9LFxuICB9KTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJkeW5hbWljIiwiUEFZTE9BRFMiLCJ1c2VyIiwiZW5kcG9pbnQiLCJhY2NvdW50IiwicGxhbiIsIm9yZGVycyIsInJlY2VudE9yZGVycyIsInBlbmRpbmdTaGlwbWVudCIsInJlY3MiLCJzdWdnZXN0ZWRTa3VzIiwiR0VUIiwicmVxdWVzdCIsInQwIiwicGVyZm9ybWFuY2UiLCJub3ciLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJuYW1lIiwiZ2V0IiwiZGVsYXkiLCJNYXRoIiwibWluIiwibWF4IiwiTnVtYmVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0Iiwic2VydmVyRWxhcHNlZE1zIiwicm91bmQiLCJqc29uIiwicmVxdWVzdGVkRGVsYXlNcyIsImZpbmlzaGVkQXQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJkYXRhIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/demo/slow/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fslow%2Froute&page=%2Fapi%2Fdemo%2Fslow%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fslow%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();