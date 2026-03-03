<?php

namespace App\Http\Requests;

use App\Models\MockTest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use mysql_xdevapi\Exception;

class StoreAttemptRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation(): void
    {

        $this->merge([
            'started_at' => date('Y-m-d H:i:s'),
        ]);

        if ($this->finished_at) {
            $this->merge([
                'finished_at' => date('Y-m-d H:i:s', strtotime($this->finished_at)),
            ]);
        }

        $this->merge([
            'user_id' => auth()->id(),
        ]);

        if (!$this->test_id) {
            $test = MockTest::query()
                ->where('mock_id', $this->mock_id)
                ->inRandomOrder()
                ->first();

            if (!$test) {
                throw ValidationException::withMessages([
                    'error' => 'No test found for this Mock.',
                ]);
//                throw new \Exception('No test found for this Mock.');
            }

            $this->merge([
                'test_id' => $test->test_id,
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
            'mock_id' => ['nullable', 'exists:mocks,id'],
            'test_id' => ['required', 'exists:tests,id'],
            'started_at' => ['required', 'date'],
            'finished_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'score' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
