const { Widget } = ags;
const { Bluetooth } = ags.Service;

Widget.widgets['bluetooth/indicator'] = ({
    enabled = { type: 'icon', icon: 'bluetooth-active-symbolic' },
    disabled = { type: 'icon', icon: 'bluetooth-disabled-symbolic' },
    ...props
}) => Widget({
    ...props,
    type: 'dynamic',
    items: [
        { value: true, widget: enabled },
        { value: false, widget: disabled },
    ],
    connections: [[Bluetooth, dynamic => dynamic.update(value => value === Bluetooth.enabled)]],
});

Widget.widgets['bluetooth/status-label'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Bluetooth, label => label.label = (Bluetooth.enabled ? 'On' : 'Off')]],
});

Widget.widgets['bluetooth/status'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[Bluetooth, label => {
        label.label = Bluetooth.connectedDevices[0]?.alias || 'Not Connected';
    }]],
});

Widget.widgets['bluetooth/toggle'] = props => Widget({
    ...props,
    type: 'button',
    onClick: () => Bluetooth.enabled = !Bluetooth.enabled,
    connections: [[Bluetooth, button => button.toggleClassName('on', Bluetooth.enabled)]],
});

Widget.widgets['bluetooth/label'] = props => Widget({
    ...props,
    type: 'label',
    label: 'Bluetooth',
});

Widget.widgets['bluetooth/devices'] = props => Widget({
    ...props,
    type: 'box',
    orientation: 'vertical',
    connections: [[Bluetooth, box => {
        box.get_children().forEach(ch => ch.destroy());
        for (const [, device] of Bluetooth.devices) {
            box.add(Widget({
                type: 'box',
                hexpand: false,
                children: [
                    {
                        type: 'icon',
                        icon: device.iconName + '-symbolic',
                    },
                    {
                        type: 'label',
                        label: device.name,
                    },
                    { type: 'box', hexpand: true },
                    device._connecting ? { type: 'spinner' } : {
                        type: 'switch',
                        active: device.connected,
                        onActivate: ({ active }) => device.setConnection(active),
                    },
                ],
            }));
        }
        box.show_all();
    }]],
});
