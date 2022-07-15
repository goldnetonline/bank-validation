const mix = require('laravel-mix');
const purgecss = require('@fullhuman/postcss-purgecss');

const purgeCssOptions = (outputPath) => ({
    postCss: purgecss({
        content: ['./public/*.html', './src/**/*.js'],
        css: [outputPath],
    }),
});

mix.setPublicPath('./public').disableNotifications();

mix.sass(
    'src/scss/main.scss',
    'public/css/',
    { processUrls: true },
    purgeCssOptions('./public/css/main.css')
);

mix.js('src/js/main.js', 'public/js/');

if (mix.inProduction()) {
    mix.version();
}
