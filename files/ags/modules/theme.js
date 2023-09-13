const { Service } = ags;
const { exec } = ags.Utils;
const { Box } = ags.Widget;

class ThemeService extends Service {
    static { Service.register(this); }

    static _reloadCss = () => {
        const path = ags.App.configDir;
        exec(`sassc ${path}/styles/main.scss ${path}/style.css`);
        ags.App.applyCss(`${path}/style.css`);
        this.emit('changed');
    };

    constructor() {
        super();
    }
}

class Theme {
    static { Service.export(this, 'Theme'); }
    static instance = new ThemeService();

    static reloadCss() { Theme.instance._reloadCss();}
}

export const ThemeBox = props => Box({
    ...props,
    connections: [[Theme, box => {}]],
});
