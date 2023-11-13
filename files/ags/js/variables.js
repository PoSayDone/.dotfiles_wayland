import { Variable } from './imports.js';

const prettyUptime = str => {
    if (str.length >= 4)
        return str;

    if (str.length === 1)
        return '0:0' + str;

    if (str.length === 2)
        return '0:' + str;
};

export const uptime = Variable(0, {
    poll: [60_000, 'uptime', line => prettyUptime(line.split(/\s+/)[2].replace(',', ''))],
});
