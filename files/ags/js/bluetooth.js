import { Spinner } from './misc.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import { Icon, Label, Box, Button, Stack } from 'resource:///com/github/Aylur/ags/widget.js';
import * as Widget from  'resource:///com/github/Aylur/ags/widget.js';

export const Indicator = ({
    enabled = Icon({ icon: 'bluetooth-active-symbolic', class_name: 'enabled' }),
    disabled = Icon({ icon: 'bluetooth-disabled-symbolic', class_name: 'disabled' }),
    ...props
} = {}) => Stack({
    ...props,
    items: [
        ['true', enabled],
        ['false', disabled],
    ],
    connections: [[Bluetooth, stack => {
        stack.shown = `${Bluetooth.enabled}`;
    }]],
});

export const Toggle = props => Button({
    ...props,
    on_clicked: () => Bluetooth.enabled = !Bluetooth.enabled,
    connections: [[Bluetooth, button => button.toggleClassName('on', Bluetooth.enabled)]],
});

export const ConnectedLabel = props => Label({
    ...props,
    connections: [[Bluetooth, label => {
        if (!Bluetooth.enabled)
            return label.label = 'Disabled';

        if (Bluetooth.connectedDevices.length === 0)
            return label.label = 'Not Connected';

        if (Bluetooth.connectedDevices.length === 1)
            return label.label = Bluetooth.connectedDevices[0].alias;

        label.label = `${Bluetooth.connectedDevices.length} Connected`;
    }]],
});

export const Devices = props => Box({
    ...props,
    vertical: true,
    connections: [[Bluetooth, box => {
        box.children = Array.from(Bluetooth.devices.values()).map(device => Box({
            hexpand: false,
            children: [
                Icon(device.iconName + '-symbolic'),
                Label(device.name),
                Box({ hexpand: true }),
                device._connecting ? Spinner() : Widget({
                    type: imports.gi.Gtk.Switch,
                    active: device.connected,
                    connections: [['activate', ({ active }) => {
                        device.setConnection(active);
                    }]],
                }),
            ],
        }));
    }]],
});
