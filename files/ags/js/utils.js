import App from 'resource:///com/github/Aylur/ags/app.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Gdk from 'gi://Gdk';
import icons from './icons.js';
import { Utils } from './imports.js';

/** @type {function(string): number[]}*/
export const hexToRgb = hex =>
    hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16));

export function reloadCss() {
    return Utils.subprocess([
        'inotifywait',
        '--recursive',
        '--event', 'create,modify',
        '-m', App.configDir + '/scss',
    ], () => {
        Utils.exec(`sassc ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
        App.resetCss();
        App.applyCss(`${App.configDir}/style.css`);
    });
}

/** @type {function(number, number): number[]}*/
export function range(length, start = 1) {
    return Array.from({ length }, (_, i) => i + start);
}

/** @type {function([any], any): any}*/
export function substitute(collection, item) {
    return collection.find(([from]) => from === item)?.[1] || item;
}

/** @type {function((id: number) => typeof Gtk.Widget): typeof Gtk.Widget[]}*/
export function forMonitors(widget) {
    const n = Gdk.Display.get_default().get_n_monitors();
    return range(n, 0).map(widget);
}

export function warnOnLowBattery() {
    Battery.connect('changed', () => {
        const low = 15;
        if ((Battery.percent === low || Battery.percent <= 5) && !Battery.charging ) {
            Utils.execAsync([
                'notify-send',
                `${Battery.percent}% on battery`,
                'Please charge your device',
                '-i', icons.battery.warning,
                '-u', 'critical',
            ]);
        }
    });
}

export function getAudioTypeIcon(icon) {
    const substitues = [
        ['audio-headset-bluetooth', icons.audio.type.headset],
        ['audio-card-analog-usb', icons.audio.type.speaker],
        ['audio-card-analog-pci', icons.audio.type.card],
    ];

    for (const [from, to] of substitues) {
        if (from === icon)
            return to;
    }

    return icon;
}

export async function globalServices() {
    globalThis.ags = await import('./imports.js');
    globalThis.brightness = (await import('./services/Brightness.js')).default;
    globalThis.indicator = (await import('./services/onScreenIndicator.js')).default;
    globalThis.audio = globalThis.ags.Audio;
    globalThis.mpris = globalThis.ags.Mpris;
}

export function launchApp(app) {
    Utils.execAsync(`hyprctl dispatch exec "${app.executable}"`);
    app.frequency += 1;
}
