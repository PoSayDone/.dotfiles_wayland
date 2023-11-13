import Service from 'resource:///com/github/Aylur/ags/service.js';
import { execAsync, exec } from 'resource:///com/github/Aylur/ags/utils.js';

class Brightness extends Service {
    static {
        Service.register(this, {}, {
            'screen': ['float', 'rw'],
        });
    }

    _screen = 0;

    get screen() { return this._screen; }

    set screen(percent) {
        if (percent < 0)
            percent = 0;

        if (percent > 1)
            percent = 1;

        execAsync(`brightnessctl s ${percent * 100}% -q`)
            .then(() => {
                this._screen = percent;
                this.changed('screen');
            })
            .catch(print);
    }

    constructor() {
        super();
        this._screen = Number(exec('brightnessctl g')) / Number(exec('brightnessctl m'));
    }
}

export default new Brightness();
