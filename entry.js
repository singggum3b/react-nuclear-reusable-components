require("client/.css/style.css");
require("client/js/lib.entry.js")(window);
require("client/js/app.entry.js");

//=================HMR Management=======================
if (module.hot) {
	module.hot.accept(["client/js/app.entry.js"]);
}
