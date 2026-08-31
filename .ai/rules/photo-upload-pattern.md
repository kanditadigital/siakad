# Photo Upload Pattern

## Rule
When adding photo upload to a model with user relationship, both controller methods (`show`, `edit`) MUST load the `user` relationship.

## Problem
If `edit()` doesn't load `user`, the form cannot display the existing photo preview.

## Solution

### Controller
```php
public function show(Model $model): Response
{
    $model->load('relationship', 'user'); // MUST include 'user'
    return Inertia::render('page', ['model' => $model]);
}

public function edit(Model $model): Response
{
    $model->load('relationship', 'user'); // MUST include 'user'
    return Inertia::render('page', ['model' => $model]);
}
```

### Store/Update
```php
$validated = $request->validate([
    'photo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:2048'],
]);

$photoPath = null;
if ($request->hasFile('photo')) {
    // Delete old photo if exists
    if ($model->user?->photo) {
        Storage::disk('public')->delete($model->user->photo);
    }
    $photoPath = $request->file('photo')->store('photos', 'public');
}
```

### React Form
```tsx
const [photoPreview, setPhotoPreview] = useState<string | null>(
    existingPhoto ? `/storage/${existingPhoto}` : null
);
const fileInputRef = useRef<HTMLInputElement>(null);

// Display photo or initials
{photoPreview ? (
    <img src={photoPreview} alt="Preview" className="h-32 w-32 rounded-full object-cover" />
) : (
    <div className="h-32 w-32 rounded-full bg-green-100 flex items-center justify-center">
        <span className="text-4xl font-bold text-green-700">{getInitials(name)}</span>
    </div>
)}
```

## Files
- `app/Http/Controllers/Admin/DosenController.php`
- `app/Http/Controllers/Admin/MahasiswaController.php`
- `app/Http/Controllers/Admin/TendikController.php`
- `app/Http/Controllers/Admin/UserController.php`
