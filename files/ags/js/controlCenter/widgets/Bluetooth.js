import icons from '../../icons.js';
import { Menu, ArrowToggleButton } from '../ToggleButton.js';
import { Bluetooth, Widget } from '../../imports.js';
import HoverableButton from '../../misc/HoverableButton.js';

export const BluetoothToggle = () => ArrowToggleButton({
    name: 'bluetooth',
    icon: Widget.Icon({
        connections: [[Bluetooth, icon => {
            icon.icon = Bluetooth.enabled
                ? icons.bluetooth.enabled
                : icons.bluetooth.disabled;
        }]],
    }),
    label: Widget.Label({
        class_name: 'title',
        hpack: 'start',
        label: 'Bluetooth',
    }),
    status: Widget.Label({
        hpack: 'start',
        truncate: 'end',
        connections: [[Bluetooth, label => {
            if (!Bluetooth.enabled)
                return label.label = 'Disabled';

            if (Bluetooth.connectedDevices.length === 0)
                return label.label = 'Not Connected';

            if (Bluetooth.connectedDevices.length === 1)
                return label.label = Bluetooth.connectedDevices[0].alias;

            label.label = `${Bluetooth.connectedDevices.length} Connected`;
        }]],
    }),
    connection: [Bluetooth, () => Bluetooth.enabled],
    deactivate: () => Bluetooth.enabled = false,
    activate: () => Bluetooth.enabled = true,
});

export const BluetoothDevices = () => Menu({
    name: 'bluetooth',
    icon: Widget.Icon(icons.bluetooth.disabled),
    title: Widget.Label('Bluetooth'),
    menu_content: [
        Widget.Box({
            hexpand: true,
            vertical: true,
            connections: [[Bluetooth, box => box.children = Bluetooth.devices
                .filter(d => d.name)
                .map(device => HoverableButton({
                    class_name: 'bluetooth__entry',
                    on_clicked: () => device.setConnection(!device.connected),
                    child: Widget.Box({
                        children: [
                            Widget.Icon(device.iconName + '-symbolic'),
                            Widget.Label(device.name),
                            device.batteryPercentage > 0 && Widget.Label(`${device.batteryPercentage}%`),
                            Widget.Box({ hexpand: true }),
                            device.connecting ? Widget.Spinner({ active: true }) : device.connected && Widget.Icon({
                                icon: icons.tick,
                                hexpand: true,
                                hpack: 'end',
                            }),
                        ],
                    }),
                })),
            ]],
        }),
    ],
});
