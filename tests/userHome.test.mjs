import test from "node:test";
import assert from "node:assert/strict";
import { defaultFilters, initialDiscoveryState, filterTrainers, discoveryReducer, updateRange, toggleRegion, hasFilters, PRICE_LIMITS } from "../features/user-home/state.js";
const trainers=[
 {id:"a",name:"김재민",location:{name:"오류 헬스장"},specialties:["재활운동"],regionIds:["paju"],prices:[{count:10,price:"450000"}]},
 {id:"b",name:"김오류",location:{name:"다짐"},specialties:["체형교정"],regionIds:["seoul"],prices:[{count:10,price:"400000"},{count:20,price:"800000"}]},
];
test("search combines trainer and gym names, price/count, region and purposes",()=>{
 const filters=defaultFilters();
 assert.equal(filterTrainers(trainers," 오류 ",filters).length,2);
 assert.deepEqual(filterTrainers(trainers,"",{...filters,regions:[{id:"paju"}],purposes:["재활운동"]}).map(t=>t.id),["a"]);
 assert.equal(filterTrainers(trainers,"",{...filters,count:20}).length,0);
 assert.deepEqual(filterTrainers(trainers,"",{...filters,count:20,min:700000,max:900000}).map(t=>t.id),["b"]);
 assert.equal(filterTrainers(trainers,"없는 이름",filters).length,0);
 assert.equal(hasFilters(defaultFilters()),false);
 assert.equal(hasFilters({...filters,count:20}),true);
});
test("comparison deduplicates, caps three, removes without altering likes",()=>{
 let state=initialDiscoveryState;
 for(const id of ["a","b","a","c","d"])state=discoveryReducer(state,{type:"compare",id});
 assert.deepEqual(state.compared,["a","b","c"]);
 state=discoveryReducer(state,{type:"like",id:"b"});
 state=discoveryReducer(state,{type:"remove",id:"b"});
 assert.deepEqual(state.compared,["a","c"]);assert.deepEqual(state.liked,["b"]);
 state=discoveryReducer(state,{type:"compare",id:"d"});assert.deepEqual(state.compared,["a","c","d"]);
});
test("region limit and range handles prevent overflow and crossing",()=>{
 let regions=[];for(let i=0;i<6;i++)regions=toggleRegion(regions,{id:String(i)});
 assert.equal(regions.length,5);regions=toggleRegion(regions,{id:"2"});assert.equal(regions.length,4);
 assert.equal(updateRange({min:100000,max:700000},"min",900000).min,700000);
 assert.equal(updateRange({min:100000,max:700000},"max",-5000).max,100000);
 assert.equal(updateRange({count:20,min:450000,max:900000},"max",1500000).max,1400000);
 assert.equal(updateRange({min:0,max:PRICE_LIMITS.max},"max",Infinity).max,PRICE_LIMITS.max);
 assert.equal(updateRange({min:0,max:700000},"min",154321).min,150000);
});
test("applying filters and survey clones drafts and resets only list scroll",()=>{
 const filters=defaultFilters();let state=discoveryReducer({...initialDiscoveryState,compared:["a"],scrollOffset:200},{type:"filters",value:filters});
 filters.purposes.push("changed");assert.deepEqual(state.filters.purposes,[]);assert.equal(state.scrollOffset,0);assert.deepEqual(state.compared,["a"]);
 const answers={location:[{id:"paju"}]};state=discoveryReducer(state,{type:"survey",value:answers});answers.location[0].id="changed";assert.equal(state.survey.location[0].id,"paju");
});
