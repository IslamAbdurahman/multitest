<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    public function run(): void
    {
        $languages = [
            ['code' => 'en', 'flag' => '🇺🇸', 'name_uz' => 'Ingliz tili', 'name_ru' => 'Английский язык', 'name_en' => 'English'],
            ['code' => 'de', 'flag' => '🇩🇪', 'name_uz' => 'Nemis tili', 'name_ru' => 'Немецкий язык', 'name_en' => 'German'],
            ['code' => 'fr', 'flag' => '🇫🇷', 'name_uz' => 'Fransuz tili', 'name_ru' => 'Французский язык', 'name_en' => 'French'],
            ['code' => 'ko', 'flag' => '🇰🇷', 'name_uz' => 'Koreys tili', 'name_ru' => 'Корейский язык', 'name_en' => 'Korean'],
            ['code' => 'ja', 'flag' => '🇯🇵', 'name_uz' => 'Yapon tili', 'name_ru' => 'Японский язык', 'name_en' => 'Japanese'],
            ['code' => 'ar', 'flag' => '🇸🇦', 'name_uz' => 'Arab tili', 'name_ru' => 'Арабский язык', 'name_en' => 'Arabic'],
            ['code' => 'zh', 'flag' => '🇨🇳', 'name_uz' => 'Xitoy tili', 'name_ru' => 'Китайский язык', 'name_en' => 'Chinese'],
            ['code' => 'tr', 'flag' => '🇹🇷', 'name_uz' => 'Turk tili', 'name_ru' => 'Турецкий язык', 'name_en' => 'Turkish'],
            ['code' => 'fa', 'flag' => '🇮🇷', 'name_uz' => 'Fors tili', 'name_ru' => 'Персидский язык', 'name_en' => 'Persian'],
            ['code' => 'prs', 'flag' => '🇦🇫', 'name_uz' => 'Dariy tili', 'name_ru' => 'Язык дари', 'name_en' => 'Dari'],
            ['code' => 'ur', 'flag' => '🇵🇰', 'name_uz' => 'Urdu tili', 'name_ru' => 'Язык урду', 'name_en' => 'Urdu'],
            ['code' => 'hi', 'flag' => '🇮🇳', 'name_uz' => 'Hindiy tili', 'name_ru' => 'Хинди', 'name_en' => 'Hindi'],
            ['code' => 'ug', 'flag' => '🇺🇮', 'name_uz' => 'Uyg\'ur tili', 'name_ru' => 'Уйгурский язык', 'name_en' => 'Uyghur'],
            ['code' => 'ps', 'flag' => '🇦🇫', 'name_uz' => 'Pushtu tili', 'name_ru' => 'Язык пушту', 'name_en' => 'Pashto'],
            ['code' => 'es', 'flag' => '🇪🇸', 'name_uz' => 'Ispan tili', 'name_ru' => 'Испанский язык', 'name_en' => 'Spanish'],
            ['code' => 'it', 'flag' => '🇮🇹', 'name_uz' => 'Italyan tili', 'name_ru' => 'Итальянский язык', 'name_en' => 'Italian'],
        ];

        foreach ($languages as $language) {
            Language::query()->updateOrCreate(
                ['code' => $language['code']],
                [
                    'flag' => $language['flag'],
                    'name_uz' => $language['name_uz'],
                    'name_ru' => $language['name_ru'],
                    'name_en' => $language['name_en'],
                ]
            );
        }
    }
}
