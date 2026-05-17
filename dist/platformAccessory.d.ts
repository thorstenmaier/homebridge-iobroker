import { PlatformAccessory, CharacteristicValue } from 'homebridge';
import { IoBrokerPlatform } from './platform';
export declare class IoBrokerLightAccessory {
    private readonly platform;
    private readonly accessory;
    private service;
    config: any;
    constructor(platform: IoBrokerPlatform, accessory: PlatformAccessory);
    /**
     * Handle "SET" requests from HomeKit
     * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
     */
    setOn(value: CharacteristicValue): Promise<void>;
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
    getOn(): Promise<CharacteristicValue>;
    setBrightness(value: CharacteristicValue): Promise<void>;
    getBrightness(): Promise<CharacteristicValue>;
    setColorTemperature(value: CharacteristicValue): Promise<void>;
    getColorTemperature(): Promise<CharacteristicValue>;
    get(state: string, args?: any): Promise<CharacteristicValue>;
    set(state: string, value: CharacteristicValue): Promise<unknown>;
}
//# sourceMappingURL=platformAccessory.d.ts.map