import Brightness from './services/Brightness.js';
import { Icon, Label, Slider } from 'resource:///com/github/Aylur/ags/widget.js';

export const BrightnessSlider = props => Slider({
    ...props,
    draw_value: false,
    hexpand: true,
    connections: [
        [Brightness, slider => {
            slider.value = Brightness.screen;
        }],
    ],
    on_change: ({ value }) => Brightness.screen = value,
});

export const Indicator = props => Icon({
    ...props,
    icon: 'display-brightness-symbolic',
});

export const PercentLabel = props => Label({
    ...props,
    connections: [
        [Brightness, label => label.label = `${Math.floor(Brightness.screen * 100)}%`],
    ],
});
