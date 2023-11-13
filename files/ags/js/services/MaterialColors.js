import Service from 'resource:///com/github/Aylur/ags/service.js';
import Mpris, { MprisPlayer } from 'resource:///com/github/Aylur/ags/service/mpris.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

class MaterialColors extends Service {
    static {
        Service.register(this, {});
    }

    #colors = new Map();
    #coverPaths = new Map();
    #connections = new Map();

    get colors() { return this.#colors; }
    get cover_paths() { return this.#coverPaths; }

    constructor() {
        super();

        Mpris.connect('player-added', (_, busName) => {
            const player = Mpris.getPlayer(busName);
            if (this.#connections.has(player))
                return;

            const id = player.connect(
                'notify::cover-path',
                this.#onTrackId.bind(this),
            );

            this.#connections.set(player, id);
        });

        Mpris.connect('player-closed', (_, busName) => {
            const player = Mpris.getPlayer(busName);
            if (!this.#connections.has(player))
                return;

            const id = this.#connections.get(player);
            player.disconnect(id);
            this.#connections.delete(player);
        });
    }

    /** @param {MprisPlayer} player */
    #onTrackId(player) {
        execAsync(`python ${App.configDir}/bin/getCoverColors ${player.coverPath}`)
            .then(commandString => {
                this.#colors.set(player.busName, JSON.parse(commandString));
                this.#coverPaths.set(player.busName, player.coverPath);
                this.emit('changed');
            })
            .catch(() => {});
    }
}

export default new MaterialColors();
