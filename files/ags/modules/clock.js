const { Widget } = ags;
const { execAsync } = ags.Utils;
const { DateTime } = imports.gi.GLib;

Widget.widgets['clock'] = ({
    format = '%a %d %b, %H:%M',
    interval = 1000,
    ...props
}) => Widget({
    ...props,
    className: 'clock',
    type: 'label',
    connections: [[interval, label => label.label = DateTime.new_now_local().format(format)]],
});

Widget.widgets['uptime'] = props => Widget({
    ...props,
    type: 'label',
    connections: [[1000, label => execAsync(['bash', '-c', "uptime | awk '{print $3}' | tr ',' ' '"], time => {
        label.label = time.trim();
    })]],
});
