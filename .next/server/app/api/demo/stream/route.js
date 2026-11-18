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
exports.id = "app/api/demo/stream/route";
exports.ids = ["app/api/demo/stream/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fstream%2Froute&page=%2Fapi%2Fdemo%2Fstream%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fstream%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fstream%2Froute&page=%2Fapi%2Fdemo%2Fstream%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fstream%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_ciigan_gemini_antigravity_scratch_frontend_opt_demo_src_app_api_demo_stream_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/demo/stream/route.ts */ \"(rsc)/./src/app/api/demo/stream/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/demo/stream/route\",\n        pathname: \"/api/demo/stream\",\n        filename: \"route\",\n        bundlePath: \"app/api/demo/stream/route\"\n    },\n    resolvedPagePath: \"/home/ciigan/.gemini/antigravity/scratch/frontend-opt-demo/src/app/api/demo/stream/route.ts\",\n    nextConfigOutput,\n    userland: _home_ciigan_gemini_antigravity_scratch_frontend_opt_demo_src_app_api_demo_stream_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZkZW1vJTJGc3RyZWFtJTJGcm91dGUmcGFnZT0lMkZhcGklMkZkZW1vJTJGc3RyZWFtJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGZGVtbyUyRnN0cmVhbSUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGY2lpZ2FuJTJGLmdlbWluaSUyRmFudGlncmF2aXR5JTJGc2NyYXRjaCUyRmZyb250ZW5kLW9wdC1kZW1vJTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGY2lpZ2FuJTJGLmdlbWluaSUyRmFudGlncmF2aXR5JTJGc2NyYXRjaCUyRmZyb250ZW5kLW9wdC1kZW1vJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUMyQztBQUN4SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL2hvbWUvY2lpZ2FuLy5nZW1pbmkvYW50aWdyYXZpdHkvc2NyYXRjaC9mcm9udGVuZC1vcHQtZGVtby9zcmMvYXBwL2FwaS9kZW1vL3N0cmVhbS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvZGVtby9zdHJlYW0vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9kZW1vL3N0cmVhbVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZGVtby9zdHJlYW0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9jaWlnYW4vLmdlbWluaS9hbnRpZ3Jhdml0eS9zY3JhdGNoL2Zyb250ZW5kLW9wdC1kZW1vL3NyYy9hcHAvYXBpL2RlbW8vc3RyZWFtL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fstream%2Froute&page=%2Fapi%2Fdemo%2Fstream%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fstream%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "(rsc)/./src/app/api/demo/stream/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/demo/stream/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nconst dynamic = \"force-dynamic\";\nconst STAGES = [\n    {\n        step: 1,\n        title: \"Khung HTML Shell + Header\",\n        delayMs: 20\n    },\n    {\n        step: 2,\n        title: \"Khối Số dư tài khoản (Suspense #1)\",\n        delayMs: 260\n    },\n    {\n        step: 3,\n        title: \"Khối Đơn hàng gần đây (Suspense #2)\",\n        delayMs: 320\n    },\n    {\n        step: 4,\n        title: \"Khối Phân tích gợi ý (Suspense #3)\",\n        delayMs: 360\n    }\n];\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const mode = searchParams.get(\"mode\") === \"blocking\" ? \"blocking\" : \"stream\";\n    const encoder = new TextEncoder();\n    const t0 = performance.now();\n    if (mode === \"blocking\") {\n        const out = [];\n        for (const s of STAGES){\n            await new Promise((r)=>setTimeout(r, s.delayMs));\n            out.push({\n                step: s.step,\n                title: s.title,\n                serverAtMs: Math.round(performance.now() - t0)\n            });\n        }\n        const body = out.map((item)=>JSON.stringify(item)).join(\"\\n\") + \"\\n\";\n        return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(body, {\n            headers: {\n                \"Content-Type\": \"application/x-ndjson; charset=utf-8\",\n                \"Cache-Control\": \"no-store\"\n            }\n        });\n    }\n    const stream = new ReadableStream({\n        async start (controller) {\n            for (const s of STAGES){\n                await new Promise((r)=>setTimeout(r, s.delayMs));\n                const chunk = JSON.stringify({\n                    step: s.step,\n                    title: s.title,\n                    serverAtMs: Math.round(performance.now() - t0)\n                }) + \"\\n\";\n                controller.enqueue(encoder.encode(chunk));\n            }\n            controller.close();\n        }\n    });\n    return new next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse(stream, {\n        headers: {\n            \"Content-Type\": \"application/x-ndjson; charset=utf-8\",\n            \"Cache-Control\": \"no-store\",\n            \"X-Accel-Buffering\": \"no\"\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9kZW1vL3N0cmVhbS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBMkM7QUFFcEMsTUFBTUMsVUFBVSxnQkFBZ0I7QUFFdkMsTUFBTUMsU0FBUztJQUNiO1FBQUVDLE1BQU07UUFBR0MsT0FBTztRQUE2QkMsU0FBUztJQUFHO0lBQzNEO1FBQUVGLE1BQU07UUFBR0MsT0FBTztRQUFzQ0MsU0FBUztJQUFJO0lBQ3JFO1FBQUVGLE1BQU07UUFBR0MsT0FBTztRQUF1Q0MsU0FBUztJQUFJO0lBQ3RFO1FBQUVGLE1BQU07UUFBR0MsT0FBTztRQUFzQ0MsU0FBUztJQUFJO0NBQ3RFO0FBRU0sZUFBZUMsSUFBSUMsT0FBZ0I7SUFDeEMsTUFBTSxFQUFFQyxZQUFZLEVBQUUsR0FBRyxJQUFJQyxJQUFJRixRQUFRRyxHQUFHO0lBQzVDLE1BQU1DLE9BQU9ILGFBQWFJLEdBQUcsQ0FBQyxZQUFZLGFBQWEsYUFBYTtJQUNwRSxNQUFNQyxVQUFVLElBQUlDO0lBQ3BCLE1BQU1DLEtBQUtDLFlBQVlDLEdBQUc7SUFFMUIsSUFBSU4sU0FBUyxZQUFZO1FBQ3ZCLE1BQU1PLE1BQWtFLEVBQUU7UUFDMUUsS0FBSyxNQUFNQyxLQUFLakIsT0FBUTtZQUN0QixNQUFNLElBQUlrQixRQUFRLENBQUNDLElBQU1DLFdBQVdELEdBQUdGLEVBQUVkLE9BQU87WUFDaERhLElBQUlLLElBQUksQ0FBQztnQkFDUHBCLE1BQU1nQixFQUFFaEIsSUFBSTtnQkFDWkMsT0FBT2UsRUFBRWYsS0FBSztnQkFDZG9CLFlBQVlDLEtBQUtDLEtBQUssQ0FBQ1YsWUFBWUMsR0FBRyxLQUFLRjtZQUM3QztRQUNGO1FBQ0EsTUFBTVksT0FBT1QsSUFBSVUsR0FBRyxDQUFDLENBQUNDLE9BQVNDLEtBQUtDLFNBQVMsQ0FBQ0YsT0FBT0csSUFBSSxDQUFDLFFBQVE7UUFDbEUsT0FBTyxJQUFJaEMscURBQVlBLENBQUMyQixNQUFNO1lBQzVCTSxTQUFTO2dCQUNQLGdCQUFnQjtnQkFDaEIsaUJBQWlCO1lBQ25CO1FBQ0Y7SUFDRjtJQUVBLE1BQU1DLFNBQVMsSUFBSUMsZUFBZTtRQUNoQyxNQUFNQyxPQUFNQyxVQUFVO1lBQ3BCLEtBQUssTUFBTWxCLEtBQUtqQixPQUFRO2dCQUN0QixNQUFNLElBQUlrQixRQUFRLENBQUNDLElBQU1DLFdBQVdELEdBQUdGLEVBQUVkLE9BQU87Z0JBQ2hELE1BQU1pQyxRQUNKUixLQUFLQyxTQUFTLENBQUM7b0JBQ2I1QixNQUFNZ0IsRUFBRWhCLElBQUk7b0JBQ1pDLE9BQU9lLEVBQUVmLEtBQUs7b0JBQ2RvQixZQUFZQyxLQUFLQyxLQUFLLENBQUNWLFlBQVlDLEdBQUcsS0FBS0Y7Z0JBQzdDLEtBQUs7Z0JBQ1BzQixXQUFXRSxPQUFPLENBQUMxQixRQUFRMkIsTUFBTSxDQUFDRjtZQUNwQztZQUNBRCxXQUFXSSxLQUFLO1FBQ2xCO0lBQ0Y7SUFFQSxPQUFPLElBQUl6QyxxREFBWUEsQ0FBQ2tDLFFBQVE7UUFDOUJELFNBQVM7WUFDUCxnQkFBZ0I7WUFDaEIsaUJBQWlCO1lBQ2pCLHFCQUFxQjtRQUN2QjtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIi9ob21lL2NpaWdhbi8uZ2VtaW5pL2FudGlncmF2aXR5L3NjcmF0Y2gvZnJvbnRlbmQtb3B0LWRlbW8vc3JjL2FwcC9hcGkvZGVtby9zdHJlYW0vcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5cbmV4cG9ydCBjb25zdCBkeW5hbWljID0gXCJmb3JjZS1keW5hbWljXCI7XG5cbmNvbnN0IFNUQUdFUyA9IFtcbiAgeyBzdGVwOiAxLCB0aXRsZTogXCJLaHVuZyBIVE1MIFNoZWxsICsgSGVhZGVyXCIsIGRlbGF5TXM6IDIwIH0sXG4gIHsgc3RlcDogMiwgdGl0bGU6IFwiS2jhu5FpIFPhu5EgZMawIHTDoGkga2hv4bqjbiAoU3VzcGVuc2UgIzEpXCIsIGRlbGF5TXM6IDI2MCB9LFxuICB7IHN0ZXA6IDMsIHRpdGxlOiBcIkto4buRaSDEkMahbiBow6BuZyBn4bqnbiDEkcOieSAoU3VzcGVuc2UgIzIpXCIsIGRlbGF5TXM6IDMyMCB9LFxuICB7IHN0ZXA6IDQsIHRpdGxlOiBcIkto4buRaSBQaMOibiB0w61jaCBn4bujaSDDvSAoU3VzcGVuc2UgIzMpXCIsIGRlbGF5TXM6IDM2MCB9LFxuXTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgY29uc3QgbW9kZSA9IHNlYXJjaFBhcmFtcy5nZXQoXCJtb2RlXCIpID09PSBcImJsb2NraW5nXCIgPyBcImJsb2NraW5nXCIgOiBcInN0cmVhbVwiO1xuICBjb25zdCBlbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gIGNvbnN0IHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cbiAgaWYgKG1vZGUgPT09IFwiYmxvY2tpbmdcIikge1xuICAgIGNvbnN0IG91dDogQXJyYXk8eyBzdGVwOiBudW1iZXI7IHRpdGxlOiBzdHJpbmc7IHNlcnZlckF0TXM6IG51bWJlciB9PiA9IFtdO1xuICAgIGZvciAoY29uc3QgcyBvZiBTVEFHRVMpIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIHMuZGVsYXlNcykpO1xuICAgICAgb3V0LnB1c2goe1xuICAgICAgICBzdGVwOiBzLnN0ZXAsXG4gICAgICAgIHRpdGxlOiBzLnRpdGxlLFxuICAgICAgICBzZXJ2ZXJBdE1zOiBNYXRoLnJvdW5kKHBlcmZvcm1hbmNlLm5vdygpIC0gdDApLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvbnN0IGJvZHkgPSBvdXQubWFwKChpdGVtKSA9PiBKU09OLnN0cmluZ2lmeShpdGVtKSkuam9pbihcIlxcblwiKSArIFwiXFxuXCI7XG4gICAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2UoYm9keSwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtbmRqc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcIm5vLXN0b3JlXCIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3Qgc3RyZWFtID0gbmV3IFJlYWRhYmxlU3RyZWFtKHtcbiAgICBhc3luYyBzdGFydChjb250cm9sbGVyKSB7XG4gICAgICBmb3IgKGNvbnN0IHMgb2YgU1RBR0VTKSB7XG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyKSA9PiBzZXRUaW1lb3V0KHIsIHMuZGVsYXlNcykpO1xuICAgICAgICBjb25zdCBjaHVuayA9XG4gICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgc3RlcDogcy5zdGVwLFxuICAgICAgICAgICAgdGl0bGU6IHMudGl0bGUsXG4gICAgICAgICAgICBzZXJ2ZXJBdE1zOiBNYXRoLnJvdW5kKHBlcmZvcm1hbmNlLm5vdygpIC0gdDApLFxuICAgICAgICAgIH0pICsgXCJcXG5cIjtcbiAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKGVuY29kZXIuZW5jb2RlKGNodW5rKSk7XG4gICAgICB9XG4gICAgICBjb250cm9sbGVyLmNsb3NlKCk7XG4gICAgfSxcbiAgfSk7XG5cbiAgcmV0dXJuIG5ldyBOZXh0UmVzcG9uc2Uoc3RyZWFtLCB7XG4gICAgaGVhZGVyczoge1xuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi94LW5kanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgXCJDYWNoZS1Db250cm9sXCI6IFwibm8tc3RvcmVcIixcbiAgICAgIFwiWC1BY2NlbC1CdWZmZXJpbmdcIjogXCJub1wiLFxuICAgIH0sXG4gIH0pO1xufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImR5bmFtaWMiLCJTVEFHRVMiLCJzdGVwIiwidGl0bGUiLCJkZWxheU1zIiwiR0VUIiwicmVxdWVzdCIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsIm1vZGUiLCJnZXQiLCJlbmNvZGVyIiwiVGV4dEVuY29kZXIiLCJ0MCIsInBlcmZvcm1hbmNlIiwibm93Iiwib3V0IiwicyIsIlByb21pc2UiLCJyIiwic2V0VGltZW91dCIsInB1c2giLCJzZXJ2ZXJBdE1zIiwiTWF0aCIsInJvdW5kIiwiYm9keSIsIm1hcCIsIml0ZW0iLCJKU09OIiwic3RyaW5naWZ5Iiwiam9pbiIsImhlYWRlcnMiLCJzdHJlYW0iLCJSZWFkYWJsZVN0cmVhbSIsInN0YXJ0IiwiY29udHJvbGxlciIsImNodW5rIiwiZW5xdWV1ZSIsImVuY29kZSIsImNsb3NlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/demo/stream/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fdemo%2Fstream%2Froute&page=%2Fapi%2Fdemo%2Fstream%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdemo%2Fstream%2Froute.ts&appDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fciigan%2F.gemini%2Fantigravity%2Fscratch%2Ffrontend-opt-demo&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();