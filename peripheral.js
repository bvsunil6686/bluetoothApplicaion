var util = require('util');

//
// Require bleno peripheral library.
// https://github.com/sandeepmistry/bleno
//
var bleno = require('bleno');

//
// Pizza
// * has crust
// * has toppings
// * can be baked
//
var bleApp = require('./ble-app');

//
// The BLE Pizza Service!
//
var BleService = require('./ble-service');

//
// A name to advertise our Pizza Service.
//
var name = 'CDK-Bluetooth-Services';
var bleService = new BleService(new bleApp.Pizza());

//
// Wait until the BLE radio powers on before attempting to advertise.
// If you don't have a BLE radio, then it will never power on!
//
bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // We will also advertise the service ID in the advertising packet,
    // so it's easier to find.
    //
    bleno.startAdvertising(name, [bleService.uuid], function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
  else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(err) {
  if (!err) {
    console.log('started advertising...');
    //
    // Once we are advertising, it's time to set up our services,
    // along with our characteristics.
    //
    bleno.setServices([
      bleService
    ]);
  }
});
