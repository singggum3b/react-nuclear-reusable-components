require(".css/style.css");
require("js/lib.entry.js")(window);
require("js/app.entry.js");

//=================HMR Management=======================
if (module.hot) {
	module.hot.accept(["js/app.entry.js"]);
}
