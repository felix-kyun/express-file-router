import debug from "debug";

const _log = debug("file-router");
export const log = (message: string | (() => string)) => {
	if (_log.enabled) {
		if (typeof message === "function") {
			_log(message());
		} else {
			_log(message);
		}
	}
};

const _verbose = debug("file-router:verbose");
export const verbose = (message: string | (() => string)) => {
	if (_verbose.enabled) {
		if (typeof message === "function") {
			_verbose(message());
		} else {
			_verbose(message);
		}
	}
};
