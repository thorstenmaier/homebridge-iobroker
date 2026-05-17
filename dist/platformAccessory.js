"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoBrokerLightAccessory = void 0;
class IoBrokerLightAccessory {
    constructor(platform, accessory) {
        this.platform = platform;
        this.accessory = accessory;
        this.config = this.platform.config.devices.find(device => device.name === this.accessory.displayName);
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'IoBroker')
            .setCharacteristic(this.platform.Characteristic.Model, 'IoBroker')
            .setCharacteristic(this.platform.Characteristic.SerialNumber, 'IoBroker');
        // get the service if it exists, otherwise create a new service
        // you can create multiple services for each accessory
        const servicestype = this.config.switch ? this.platform.Service.Switch : this.platform.Service.Lightbulb;
        this.service = this.accessory.getService(servicestype) || this.accessory.addService(servicestype);
        // set the service name, this is what is displayed as the default name on the Home app
        this.service.setCharacteristic(this.platform.Characteristic.Name, accessory.displayName);
        // each service must implement at-minimum the "required characteristics" for the given service type
        // see https://developers.homebridge.io/#/service/Lightbulb
        // register handlers for the On/Off Characteristic
        // see https://developers.homebridge.io/#/characteristic/On
        this.service.getCharacteristic(this.platform.Characteristic.On)
            .onSet(this.setOn.bind(this)) // SET - bind to the `setOn` method below
            .onGet(this.getOn.bind(this)); // GET - bind to the `getOn` method below
        if (this.config.brightness) {
            // add a Brightness Characteristic
            // see https://developers.homebridge.io/#/characteristic/Brightness
            this.service.getCharacteristic(this.platform.Characteristic.Brightness)
                .onSet(this.setBrightness.bind(this)) // SET - bind to the 'setBrightness` method below
                .onGet(this.getBrightness.bind(this)); // GET - bind to the 'getBrightness' method below
        }
        if (this.config.colortemp) {
            // add a Color Temperature Characteristic
            // see https://developers.homebridge.io/#/characteristic/ColorTemperature
            this.service.getCharacteristic(this.platform.Characteristic.ColorTemperature)
                .onSet(this.setColorTemperature.bind(this)) // SET - bind to the 'setColorTemperature' method below
                .onGet(this.getColorTemperature.bind(this)); // GET - bind to the 'getColorTemperature' method below
        }
    }
    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    async setOn(value) {
        this.set(this.config.onstate, value);
    }
    /**
     * Handle the "GET" requests from HomeKit
     * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
     *
     * GET requests should return as fast as possbile. A long delay here will result in
     * HomeKit being unresponsive and a bad user experience in general.
     *
     * If your device takes time to respond you should update the status of your device
     * asynchronously instead using the `updateCharacteristic` method instead.
  
     * @example
     * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
     */
    async getOn() {
        return this.get(this.config.onstate);
    }
    async setBrightness(value) {
        this.set(this.config.brightness, value);
    }
    async getBrightness() {
        return this.get(this.config.brightness);
    }
    async setColorTemperature(value) {
        this.set(this.config.colortemp, value);
    }
    async getColorTemperature() {
        return this.get(this.config.colortemp);
    }
    async get(state, args) {
        return new Promise((resolve) => {
            this.platform.getData('get/' + state.replaceAll('#', '%23'), args).then((data) => {
                resolve(JSON.parse(data).val);
            });
        });
    }
    async set(state, value) {
        return new Promise((resolve) => {
            this.platform.getData('set/' + state.replaceAll('#', '%23'), 'value=' + value).then((data) => {
                resolve(JSON.parse(data).val);
            });
        });
    }
}
exports.IoBrokerLightAccessory = IoBrokerLightAccessory;
//# sourceMappingURL=platformAccessory.js.map