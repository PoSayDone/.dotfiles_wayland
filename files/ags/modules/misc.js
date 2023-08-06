const {App} = ags;
const { CONFIG_DIR, exec } = ags.Utils;

 function reloadCss() {
	exec(`sassc ${CONFIG_DIR}/scss/main.scss ${CONFIG_DIR}/style.css`);
	App.applyCss(`${CONFIG_DIR}/style.css`)
}
