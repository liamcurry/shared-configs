"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = {
    extends: ["tslint:recommended"],
    defaultSeverity: "error",
    rules: {
        "no-var-requires": true,
        "object-literal-sort-keys": false,
        "no-console": true,
        "no-unused-variable": true,
        "strict-boolean-expressions": true,
        "strict-type-predicates": true,
        "member-access": true,
        "no-any": true,
        "no-magic-numbers": true,
        "no-non-null-assertion": true,
        "no-parameter-reassignment": true,
        "no-unnecessary-type-assertion": true,
        "prefer-for-of": true,
        "arrow-parens": false,
        "typedef-whitespace": [
            true,
            {
                "call-signature": "nospace",
                "index-signature": "nospace",
                parameter: "nospace",
                "property-declaration": "nospace",
                "variable-declaration": "nospace",
            },
            {
                "call-signature": "onespace",
                "index-signature": "onespace",
                parameter: "onespace",
                "property-declaration": "onespace",
                "variable-declaration": "onespace",
            },
        ],
        "no-return-await": true,
        "interface-name": [true, "never-prefix"],
    },
    jsRules: {},
    rulesDirectory: [],
};
module.exports = config;
