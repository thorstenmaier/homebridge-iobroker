"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoBrokerPlatform = void 0;
const settings_1 = require("./settings");
const platformAccessory_1 = require("./platformAccessory");
const http_1 = require("http");
class IoBrokerPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        this.accessories = [];
        this.trys = 0;
        this.log.debug('Finished initializing platform:', this.config.name);
        this.api.on('didFinishLaunching', () => {
            log.debug('Executed didFinishLaunching callback');
            this.discoverDevices();
        });
    }
    configureAccessory(accessory) {
        this.log.info('Loading accessory from cache:', accessory.displayName);
        this.accessories.push(accessory);
    }
    discoverDevices() {
        this.getData('help').then(() => {
            this.log.info('Reached IoBroker. Adding Devices...');
            this.config.devices.forEach(device => {
                const uuid = this.api.hap.uuid.generate(device.name);
                const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);
                if (existingAccessory) {
                    this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
                    new platformAccessory_1.IoBrokerLightAccessory(this, existingAccessory);
                }
                else {
                    this.log.info('Adding new accessory:', device.name);
                    const accessory = new this.api.platformAccessory(device.name, uuid);
                    new platformAccessory_1.IoBrokerLightAccessory(this, accessory);
                    this.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
                }
            });
        }, (err) => {
            this.log.error('Error connecting to IoBroker:', err.message);
            if (this.trys < 5) {
                this.trys++;
                this.log.error('Retrying in 5 seconds... Try:', this.trys);
                setTimeout(() => {
                    this.discoverDevices();
                }, 5000);
            }
            else {
                this.log.error('Could not connect to IoBroker. Aborting.');
            }
        });
    }
    getData(command, args) {
        return new Promise((resolve, reject) => {
            const url = 'http://' + this.config.url + ':' + this.config.port + '/' + command + (args ? '?' + args : '');
            this.log.debug('Calling url:', url);
            http_1.get(url, (res) => {
                let body = '';
                res.on('readable', () => {
                    body += res.read();
                });
                res.on('end', () => {
                    this.log.debug(body);
                    resolve(body);
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}
exports.IoBrokerPlatform = IoBrokerPlatform;
//# sourceMappingURL=platform.js.map