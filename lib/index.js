"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConsumerOfAll = exports.useConsumer = exports.useSubscribers = exports.useSubscriberToAll = exports.useSubscriber = void 0;
const reastig_1 = require("./reastig");
const hooks_1 = require("./hooks");
Object.defineProperty(exports, "useSubscriber", { enumerable: true, get: function () { return hooks_1.useSubscriber; } });
Object.defineProperty(exports, "useSubscriberToAll", { enumerable: true, get: function () { return hooks_1.useSubscriberToAll; } });
Object.defineProperty(exports, "useSubscribers", { enumerable: true, get: function () { return hooks_1.useSubscribers; } });
Object.defineProperty(exports, "useConsumer", { enumerable: true, get: function () { return hooks_1.useConsumer; } });
Object.defineProperty(exports, "useConsumerOfAll", { enumerable: true, get: function () { return hooks_1.useConsumerOfAll; } });
exports.default = reastig_1.default;
//# sourceMappingURL=index.js.map