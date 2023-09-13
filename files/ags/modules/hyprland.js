const { Hyprland } = ags.Service;
const { execAsync } = ags.Utils;
const { Box, Button, Label } = ags.Widget;

export const Workspaces = ({
    fixed = 9,
    ...props
} = {}) => Box({
    ...props,
    className: 'workspaces',
    children: Array.from({ length: fixed }, (_, i) => i + 1).map(i => Button({
        className: 'workspace-indicator',
        valign: 'center',
        onClicked: () => execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
        connections: [[Hyprland, btn => {
            const { workspaces, active } = Hyprland;
            const occupied = workspaces.has(i) && workspaces.get(i).windows > 0;
            btn.toggleClassName('active', active.workspace.id === i);
            btn.toggleClassName('occupied', occupied);
            btn.toggleClassName('empty', !occupied);
        }]],
    })),
});
