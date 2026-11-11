const {test}=require('node:test');
const assert=require('node:assert/strict');
const P=require('../model.js');
const input={title:' Вымыть пол ',room:'Кухня',description:'',due:'2026-10-05T10:00',interval:7,reminder:0};
const task=()=>P.create(input,'a',new Date('2026-10-01T09:00'));
test('validation rejects empty and overlong fields and invalid dates',()=>{
  for(const title of [' ', 'x'.repeat(101)])assert.ok(P.validate({...input,title}).title);
  assert.ok(P.validate({...input,description:'x'.repeat(501)}).description);
  assert.ok(P.validate({...input,due:'2026-02-30T10:00'}).due);
  for(const interval of [-1,366,1.5])assert.ok(P.validate({...input,interval}).interval);
  assert.equal(task().title,'Вымыть пол');
});
test('late completion skips missed occurrences and keeps history',()=>{
  const original=[task()];const next=P.complete(original,'a',new Date('2026-10-14T12:00'),'b');
  assert.equal(next[1].due,'2026-10-19T10:00');assert.equal(next[0].status,'completed');assert.equal(original[0].status,'pending');
  assert.equal(P.complete(next,'a',new Date(),'c').length,2);assert.equal(next[1].seriesId,'a');
});
test('early and exact completion use strictly later dates',()=>{
  assert.equal(P.complete([task()],'a',new Date('2026-10-04T12:00'),'b')[1].due,'2026-10-12T10:00');
  assert.equal(P.complete([task()],'a',new Date('2026-10-12T10:00'),'b')[1].due,'2026-10-19T10:00');
});
test('one-off completion does not create another task',()=>assert.equal(P.complete([P.create({...input,interval:0},'a')],'a').length,1));
test('reminders ignore completed, disabled and already notified tasks',()=>{
  const t=task();const now=new Date('2026-10-05T09:45');assert.equal(P.reminders([{...t,reminder:15}],now).length,1);
  for(const patch of [{status:'completed'},{notified:true},{reminder:null}])assert.equal(P.reminders([{...t,...patch}],new Date('2026-10-06')).length,0);
});
test('changing deadline resets notification without changing completed history',()=>{
  const t={...task(),notified:true};assert.equal(P.update([t],'a',{...input,due:'2026-10-06T10:00'})[0].notified,false);
  assert.deepEqual(P.update([{...t,status:'completed'}],'a',input),[{...t,status:'completed'}]);
});
test('100 records restore without losing IDs or reminder flags',()=>{
  const data=Array.from({length:100},(_,i)=>({...P.create({...input,interval:i%2?0:7},'id'+i),notified:i%3===0}));
  assert.deepEqual(P.decode(P.encode(data)),data);
});
test('corrupt storage, duplicate IDs and duplicate active series are rejected',()=>{
  assert.throws(()=>P.decode('{'));assert.throws(()=>P.decode(P.encode([task(),task()])));
  assert.throws(()=>P.decode(P.encode([task(),{...task(),id:'b'}])));
});
test('storage failure leaves last successful state intact',()=>{
  const previous=[task()];const next=P.complete(previous,'a',new Date(),'b');
  assert.throws(()=>P.persist({setItem(){throw Error('QuotaExceededError');}},next));assert.equal(previous[0].status,'pending');
});
test('room status and date filters intersect with seven calendar days',()=>{
  const a=task(),b={...a,id:'b',due:'2026-10-11T23:59'},c={...a,id:'c',due:'2026-10-12T00:00'};
  const now=new Date('2026-10-05T12:00');
  assert.equal(P.select([c,b,a],{room:'Кухня',status:'pending',period:'week'},now).length,2);
  assert.equal(P.select([c,b,a],{period:'today'},now)[0].id,'a');
  assert.equal(P.select([a,{...b,status:'completed'}],{period:'overdue'},new Date('2026-10-12')).length,1);
  assert.equal(P.select([a],{room:'Ванная'},now).length,0);
});
