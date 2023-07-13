const { Widget } = ags;
const { DateTime } = imports.gi.GLib;

Widget.widgets['clock'] = ({
    format = '%a %e %b, %H:%M',
    interval = 1000,
    ...props
}) => ags.Utils.interval(
    Widget({
        ...props,
        className: 'clock',
        type: 'label',
        hexpand: false,
        justify: 'center',
    }),
    interval,
    label => {
        label.label = DateTime.new_now_local().format(format);
    },
);
