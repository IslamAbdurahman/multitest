<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMockRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'user_id' => auth()->id(),
        ]);

        $slug = \Str::slug($this->name) . '-' . uniqid();

        $this->merge([
            'slug' => $slug,
        ]);

        if (!$this->filled('description')) {
            $this->merge([
                'description' => 'This speaking test is powered by multitest.uz. All audio recordings are the exclusive property of this platform and are designed specifically for our users. Please follow the instructions carefully.',
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],
            'audio_path' => [
                'nullable',
                'file',
                'max:12048',
                'mimetypes:audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,audio/ogg,video/mp4'
            ],
            'starts_at' => ['nullable', 'date'],
            'slug' => ['required', 'string', 'max:255', 'unique:mocks,slug,' . $this->route('mock')],
            'active' => ['required', 'boolean'],
            'open' => ['required', 'boolean'],
        ];
    }
}
