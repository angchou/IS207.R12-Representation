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
exports.id = "app/api/demo/cache/route";
exports.ids = ["app/api/demo/cache/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fcache%2Froute&page=%2Fapi%2Fdemo%2Fcache%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fcache%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fcache%2Froute&page=%2Fapi%2Fdemo%2Fcache%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fcache%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_ciigan_gemini_antigravity_scratch_frontend_opt_demo_src_app_api_demo_cache_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/demo/cache/route.ts */ \"(rsc)/./src/app/api/demo/cache/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/demo/cache/route\",\n        pathname: \"/api/demo/cache\",\n        filename: \"route\",\n        bundlePath: \"app/api/demo/cache/route\"\n    },\n    resolvedPagePath: \"/home/ciigan/.gemini/antigravity/scratch/frontend-opt-demo/src/app/api/demo/cache/route.ts\",\n    nextConfigOutput,\n    userland: _home_ciigan_gemini_antigravity_scratch_frontend_opt_demo_src_app_api_demo_cache_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkZW1vJTJGY2FjaGUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmRlbW8lMkZjYWNoZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmRlbW8lMkZjYWNoZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGY2lpZ2FuJTJGLmdlbWluaSUyRmFudGlncmF2aXR5JTJGc2NyYXRjaCUyRmZyb250ZW5kLW9wdC1kZW1vJTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGY2lpZ2FuJTJGLmdlbWluaSUyRmFudGlncmF2aXR5JTJGc2NyYXRjaCUyRmZyb250ZW5kLW9wdC1kZW1vJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMwQztBQUN2SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvY2lpZ2FuLy5nZW1pbmkvYW50aWdyYXZpdHkvc2NyYXRjaC9mcm9udGVuZC1vcHQtZGVtby9zcmMvYXBwL2FwaS9kZW1vL2NhY2hlL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9kZW1vL2NhY2hlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvZGVtby9jYWNoZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZGVtby9jYWNoZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9ob21lL2NpaWdhbi8uZ2VtaW5pL2FudGlncmF2aXR5L3NjcmF0Y2gvZnJvbnRlbmQtb3B0LWRlbW8vc3JjL2FwcC9hcGkvZGVtby9jYWNoZS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fcache%2Froute&page=%2Fapi%2Fdemo%2Fcache%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fcache%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "(rsc)/./src/app/api/demo/cache/route.ts":
/*!*****************************************!*\
  !*** ./src/app/api/demo/cache/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/cache */ \"(rsc)/./node_modules/next/cache.js\");\n/* harmony import */ var next_cache__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_cache__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst CACHE_TAG = \"demo-isr-product\";\nconst getCachedProduct = (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.unstable_cache)(async ()=>{\n    // Giả lập truy vấn DB chậm 280ms khi CACHE MISS\n    await new Promise((resolve)=>setTimeout(resolve, 280));\n    return {\n        productId: \"SP-0001\",\n        name: \"Workstation Pro 16\",\n        generatedAt: new Date().toISOString(),\n        dbQueryCostMs: 280\n    };\n}, [\n    \"demo-isr-product-key\"\n], {\n    tags: [\n        CACHE_TAG\n    ],\n    revalidate: 60\n});\nasync function GET() {\n    const t0 = performance.now();\n    const entry = await getCachedProduct();\n    const serverElapsedMs = Number((performance.now() - t0).toFixed(2));\n    const cacheStatus = serverElapsedMs < 100 ? \"HIT\" : \"MISS (vừa dựng lại từ nguồn)\";\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        cacheStatus,\n        serverElapsedMs,\n        tag: CACHE_TAG,\n        entry\n    });\n}\nasync function POST() {\n    (0,next_cache__WEBPACK_IMPORTED_MODULE_1__.revalidateTag)(CACHE_TAG);\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        revalidated: true,\n        tag: CACHE_TAG,\n        at: new Date().toISOString()\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9kZW1vL2NhY2hlL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTJDO0FBQ2dCO0FBRTNELE1BQU1HLFlBQVk7QUFFbEIsTUFBTUMsbUJBQW1CSCwwREFBY0EsQ0FDckM7SUFDRSxnREFBZ0Q7SUFDaEQsTUFBTSxJQUFJSSxRQUFRLENBQUNDLFVBQVlDLFdBQVdELFNBQVM7SUFDbkQsT0FBTztRQUNMRSxXQUFXO1FBQ1hDLE1BQU07UUFDTkMsYUFBYSxJQUFJQyxPQUFPQyxXQUFXO1FBQ25DQyxlQUFlO0lBQ2pCO0FBQ0YsR0FDQTtJQUFDO0NBQXVCLEVBQ3hCO0lBQUVDLE1BQU07UUFBQ1g7S0FBVTtJQUFFWSxZQUFZO0FBQUc7QUFHL0IsZUFBZUM7SUFDcEIsTUFBTUMsS0FBS0MsWUFBWUMsR0FBRztJQUMxQixNQUFNQyxRQUFRLE1BQU1oQjtJQUNwQixNQUFNaUIsa0JBQWtCQyxPQUFPLENBQUNKLFlBQVlDLEdBQUcsS0FBS0YsRUFBQyxFQUFHTSxPQUFPLENBQUM7SUFDaEUsTUFBTUMsY0FBY0gsa0JBQWtCLE1BQU0sUUFBUTtJQUVwRCxPQUFPckIscURBQVlBLENBQUN5QixJQUFJLENBQUM7UUFDdkJEO1FBQ0FIO1FBQ0FLLEtBQUt2QjtRQUNMaUI7SUFDRjtBQUNGO0FBRU8sZUFBZU87SUFDcEJ6Qix5REFBYUEsQ0FBQ0M7SUFDZCxPQUFPSCxxREFBWUEsQ0FBQ3lCLElBQUksQ0FBQztRQUN2QkcsYUFBYTtRQUNiRixLQUFLdkI7UUFDTDBCLElBQUksSUFBSWxCLE9BQU9DLFdBQVc7SUFDNUI7QUFDRiIsInNvdXJjZXMiOlsiL2hvbWUvY2lpZ2FuLy5nZW1pbmkvYW50aWdyYXZpdHkvc2NyYXRjaC9mcm9udGVuZC1vcHQtZGVtby9zcmMvYXBwL2FwaS9kZW1vL2NhY2hlL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xuaW1wb3J0IHsgdW5zdGFibGVfY2FjaGUsIHJldmFsaWRhdGVUYWcgfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5jb25zdCBDQUNIRV9UQUcgPSBcImRlbW8taXNyLXByb2R1Y3RcIjtcblxuY29uc3QgZ2V0Q2FjaGVkUHJvZHVjdCA9IHVuc3RhYmxlX2NhY2hlKFxuICBhc3luYyAoKSA9PiB7XG4gICAgLy8gR2nhuqMgbOG6rXAgdHJ1eSB24bqlbiBEQiBjaOG6rW0gMjgwbXMga2hpIENBQ0hFIE1JU1NcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyODApKTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvZHVjdElkOiBcIlNQLTAwMDFcIixcbiAgICAgIG5hbWU6IFwiV29ya3N0YXRpb24gUHJvIDE2XCIsXG4gICAgICBnZW5lcmF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgZGJRdWVyeUNvc3RNczogMjgwLFxuICAgIH07XG4gIH0sXG4gIFtcImRlbW8taXNyLXByb2R1Y3Qta2V5XCJdLFxuICB7IHRhZ3M6IFtDQUNIRV9UQUddLCByZXZhbGlkYXRlOiA2MCB9XG4pO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xuICBjb25zdCB0MCA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICBjb25zdCBlbnRyeSA9IGF3YWl0IGdldENhY2hlZFByb2R1Y3QoKTtcbiAgY29uc3Qgc2VydmVyRWxhcHNlZE1zID0gTnVtYmVyKChwZXJmb3JtYW5jZS5ub3coKSAtIHQwKS50b0ZpeGVkKDIpKTtcbiAgY29uc3QgY2FjaGVTdGF0dXMgPSBzZXJ2ZXJFbGFwc2VkTXMgPCAxMDAgPyBcIkhJVFwiIDogXCJNSVNTICh24burYSBk4buxbmcgbOG6oWkgdOG7qyBuZ3Xhu5NuKVwiO1xuXG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgY2FjaGVTdGF0dXMsXG4gICAgc2VydmVyRWxhcHNlZE1zLFxuICAgIHRhZzogQ0FDSEVfVEFHLFxuICAgIGVudHJ5LFxuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QoKSB7XG4gIHJldmFsaWRhdGVUYWcoQ0FDSEVfVEFHKTtcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICByZXZhbGlkYXRlZDogdHJ1ZSxcbiAgICB0YWc6IENBQ0hFX1RBRyxcbiAgICBhdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICB9KTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJ1bnN0YWJsZV9jYWNoZSIsInJldmFsaWRhdGVUYWciLCJDQUNIRV9UQUciLCJnZXRDYWNoZWRQcm9kdWN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwicHJvZHVjdElkIiwibmFtZSIsImdlbmVyYXRlZEF0IiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwiZGJRdWVyeUNvc3RNcyIsInRhZ3MiLCJyZXZhbGlkYXRlIiwiR0VUIiwidDAiLCJwZXJmb3JtYW5jZSIsIm5vdyIsImVudHJ5Iiwic2VydmVyRWxhcHNlZE1zIiwiTnVtYmVyIiwidG9GaXhlZCIsImNhY2hlU3RhdHVzIiwianNvbiIsInRhZyIsIlBPU1QiLCJyZXZhbGlkYXRlZCIsImF0Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/demo/cache/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fcache%2Froute&page=%2Fapi%2Fdemo%2Fcache%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fcache%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();