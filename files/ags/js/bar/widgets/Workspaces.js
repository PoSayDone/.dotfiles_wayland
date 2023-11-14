import { Hyprland, Widget, Utils } from '../../imports.js';
import { setupCursorHover } from '../../misc/SetupCursorHover.js';
import { range } from '../../utils.js';

const ws = 10;
const dispatch = arg => () => Utils.execAsync(`hyprctl dispatch workspace ${arg}`);

const Workspaces = () => Widget.Box({
    children: range(ws || 20).map(i => Widget.Button({
        setup: btn => {
            btn.id = i;
            setupCursorHover(btn);
        },
        on_clicked: dispatch(i),
        class_name: 'workspace-indicator',
        vpack: 'center',
        connections: [[Hyprland, btn => {
            btn.toggleClassName('active', Hyprland.active.workspace.id === i);
            btn.toggleClassName('occupied', Hyprland.getWorkspace(i)?.windows > 0);
        }]],
    })),
    connections: ws ? [] : [[Hyprland.active.workspace, box => box.children.map(btn => {
        btn.visible = Hyprland.workspaces.some(ws => ws.id === btn.id);
    })]],
});

export default () => Widget.Box({
    class_name: 'workspaces',
    child: Widget.Box({
        hpack: 'center',
        child: Widget.EventBox({
            onScrollUp: dispatch(`${ws ? 'r' : 'm'}+1`),
            onScrollDown: dispatch(`${ws ? 'r' : 'm'}-1`),
            class_name: 'eventbox',
            child: Workspaces(),
        }),
    }),
});
