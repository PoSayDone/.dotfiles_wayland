import { Box, Label, Overlay, Icon, Revealer, EventBox } from 'resource:///com/github/Aylur/ags/widget.js';
import { timeout, exec } from 'resource:///com/github/Aylur/ags/utils.js';

export const FontIcon = ({ icon = '', ...props }) => {
    const box = Box({
        css: 'min-width: 1px; min-height: 1px;',
    });
    const label = Label({
        label: icon,
        hpack: 'center',
        vpack: 'center',
    });
    return Box({
        ...props,
        setup: box => box.label = label,
        class_name: 'icon',
        children: [Overlay({
            child: box,
            overlays: [label],
            passThrough: true,
            connections: [['draw', overlay => {
                const size = overlay.get_style_context()
                    .get_property('font-size', imports.gi.Gtk.StateFlags.NORMAL) || 11;

                box.setCss(`min-width: ${size}px; min-height: ${size}px;`);
            }]],
        })],
    });
};

export const DistroIcon = props => FontIcon({
    ...props,
    class_name: 'distro-icon',
    icon: (() => {
        // eslint-disable-next-line quotes
        const distro = exec(`bash -c "cat /etc/os-release | grep '^ID' | head -n 1 | cut -d '=' -f2"`)
            .toLowerCase();

        switch (distro) {
            case 'fedora': return '';
            case 'arch': return '';
            case 'nixos': return '';
            case 'debian': return '';
            case 'opensuse-tumbleweed': return '';
            case 'ubuntu': return '';
            case 'endeavouros': return '';
            default: return '';
        }
    })(),
});

export const Spinner = ({ icon = 'process-working-symbolic' }) => Icon({
    icon,
    properties: [['deg', 0]],
    connections: [[10, w => {
        w.setCss(`-gtk-icon-transform: rotate(${w._deg++ % 360}deg);`);
    }]],
});

export const Progress = ({ height = 18, width = 180, vertical = false, child, ...props }) => {
    const fill = Box({
        class_name: 'fill',
        hexpand: vertical,
        vexpand: !vertical,
        hpack: vertical ? 'fill' : 'start',
        vpack: vertical ? 'end' : 'fill',
        children: [child],
    });
    const progress = Box({
        ...props,
        class_name: 'progress',
        css: `
            min-width: ${width}px;
            min-height: ${height}px;
        `,
        children: [fill],
    });
    progress.setValue = value => {
        if (value < 0)
            return;

        const axis = vertical ? 'height' : 'width';
        const axisv = vertical ? height : width;
        const min = vertical ? width : height;
        const preferred = (axisv - min) * value + min;

        if (!fill._size) {
            fill._size = preferred;
            fill.setCss(`min-${axis}: ${preferred}px;`);
            return;
        }

        const frames = 10;
        const goal = preferred - fill._size;
        const step = goal / frames;

        for (let i = 0; i < frames; ++i) {
            timeout(5 * i, () => {
                fill._size += step;
                fill.setCss(`min-${axis}: ${fill._size}px`);
            });
        }
    };
    return progress;
};

export const HoverRevealer = ({
    indicator,
    child,
    direction = 'left',
    duration = 300,
    connections,
    ...rest
}) => Box({
    children: [EventBox({
        ...rest,
        onHover: w => {
            if (w._open)
                return;

            w.get_child().get_children()[direction === 'down' || direction === 'right' ? 1 : 0].reveal_child = true;
            timeout(duration, () => w._open = true);
        },
        onHoverLost: w => {
            if (!w._open)
                return;

            w.get_child().get_children()[direction === 'down' || direction === 'right' ? 1 : 0].reveal_child = false;
            w._open = false;
        },
        child: Box({
            vertical: direction === 'down' || direction === 'up',
            children: [
                direction === 'down' || direction === 'right' ? indicator : null,
                Revealer({
                    transition: `slide_${direction}`,
                    connections,
                    transitionDuration: duration,
                    child,
                }),
                direction === 'up' || direction === 'left' ? indicator : null,
            ],
        }),
    })],
});
