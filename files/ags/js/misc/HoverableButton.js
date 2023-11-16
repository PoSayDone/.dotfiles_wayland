import { Widget } from '../imports.js';

export default ({
    ...props
} = {}) => Widget.Button({
    cursor: 'pointer',
    ...props,
});
