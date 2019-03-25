const {
    src,
    dest,
    watch,
    series
} = require('gulp');

const tailwindcss = require('tailwindcss');
const postcss = require('gulp-postcss'); // CSS preprocessor

// PostCSS Plugins
const purgecss = require('@fullhuman/postcss-purgecss'); // removes unused classes
const autoprefixer = require('autoprefixer'); // adds vendor prefixes to CSS rules using https://caniuse.com
const cssnano = require('cssnano'); // minifies css

const path = {
    html: './index.html',
    css: './src/styles.css',
    config: './src/tailwind.config.js',
    dev: './resources/css/',
    prod: './dist/css/'
};

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 */
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g);
    }
}

function buildDev() {
    let plugins = [
        tailwindcss(path.config),
        autoprefixer
    ];
    return src(path.css)
        .pipe(postcss(plugins))
        .pipe(dest(path.dev));
}


function watchTailwind() {
    watch(path.css, buildDev);
    watch(path.config, buildDev);
}

function build() {
    let cssnanoConfig = {
        preset: 'default'
    };

    let purgecssConfig = {
        content: [path.html],
        extractors: [{
            extractor: TailwindExtractor,
            extensions: ["html", "js"]
        }]
    };
    let plugins = [
        tailwindcss(path.config),
        purgecss(purgecssConfig),
        autoprefixer,
        cssnano(cssnanoConfig)
    ];

    return src(path.css)
        .pipe(postcss(plugins))
        .pipe(dest(path.prod));
}

exports.default = series(buildDev, watchTailwind);
exports.dev = buildDev;
exports.build = build;