const {
    src,
    dest,
    watch,
    series
} = require('gulp');

const postcss = require('gulp-postcss'); // CSS preprocessor
const tailwindcss = require('tailwindcss');

// Plugins
const autoprefixer = require('autoprefixer'); // adds vendor prefixes to CSS rules using https://caniuse.com


function buildDev() {
    let plugins = [
        tailwindcss('./src/tailwind.config.js'),
        autoprefixer
    ];
    return src('./src/styles.css')
        .pipe(postcss(plugins))
        .pipe(dest('./resources/css/'));
}


function watchTailwind() {
    watch('./src/styles.css', buildDev);
    watch('./src/tailwind.config.js', buildDev);
}

exports.default = series(buildDev, watchTailwind);