<?php
$html = '<p><img src="/storage/question_images/IrpUKcTXjfigCbEtRQe8.png" width="300" height="189"> &nbsp; <img src="/storage/question_images/RXfKPAu2TvhPbWlpR0qK.png" width="300" height="189"></p>';

$urls = [];
if (preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches)) {
    foreach ($matches[1] as $url) {
        if (!str_starts_with($url, 'http')) {
            $url = 'http://localhost' . $url; // Simulating url($url)
        }
        $urls[] = $url;
    }
}
print_r($urls);
