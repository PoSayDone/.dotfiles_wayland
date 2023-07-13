const { App, Widget } = ags;
const { Hyprland, Applications } = ags.Service;
const { execAsync, exec, lookUpIcon, warning } = ags.Utils;
const { Bluetooth, Battery, Audio, System } = ags.Service;
const { DateTime } = imports.gi.GLib;

Widget.widgets['hyprland/workspaces'] = ({
    monitors, // number[]
    fixed, // number
    active, // Widget
    empty, // Widget
    occupied, // Widget
    ...props
}) => {
    if (!monitors && !fixed) {
        const err = 'hyprland/workspaces needs either "fixed" or "monitors" to be defined';
        warning(err);
        return Widget(err);
    }

    const button = (windows, i) => {
        const { active: { workspace }, workspaces } = Hyprland;

        const child = workspace.id === i
            ? active
            : windows > 0
                ? occupied
                : empty;

        return Widget({
            type: 'button',
            onClick: () => execAsync(`hyprctl dispatch workspace ${i}`),
            className: `${workspace.id === i ? 'active' : ''} ${windows > 0 ? 'occupied' : 'empty'}`,
            child: child ? Widget(child) : `${workspaces.get(i)?.name || i}`,
        });
    };

    const forFixed = box => {
        box.get_children().forEach(ch => ch.destroy());
        const { workspaces } = Hyprland;
        for (let i = 1; i < fixed + 1; ++i) {
            if (workspaces.has(i)) {
                const { windows } = workspaces.get(i);
                box.add(button(windows, i));
            } else {
                box.add(button(0, i));
            }
        }
    };

    const forMonitors = box => {
        box.get_children().forEach(ch => ch.destroy());
        Hyprland.workspaces.forEach(({ id, windows, monitor }) => {
            if (monitors.includes(Hyprland.monitors.get(monitor).id))
                box.add(button(windows, id));
        });
    };

    return Widget({
        ...props,
        type: 'box',
        className: 'workspaces',
        connections: [[Hyprland, box => {
            fixed ? forFixed(box) : forMonitors(box);
            box.show_all();
        }]],
    });
};