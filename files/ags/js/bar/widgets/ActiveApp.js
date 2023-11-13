import { Hyprland, Utils, Widget } from '../../imports.js';

export const ActiveApp = () => Widget.Box({
    className: 'activeapp',
    children: [
        Widget.Icon({
            size: 18,
            connections: [
                [Hyprland.active.client, icon => {
                    if (Utils.lookUpIcon(Hyprland.active.client._class))
                        icon.icon = Hyprland.active.client._class;
                    else
                        icon.icon = 'application-x-executable';
                }],
            ],
        }),
        Widget.Label({
            xalign: 0,
            connections: [
                [Hyprland.active.client, label => { // Hyprland.active.client
                    label.label = String(Hyprland.active.client._class.length === 0 ? 'workspace' : Hyprland.active.client._class);
                }],
            ],
        }),
    ],
});
