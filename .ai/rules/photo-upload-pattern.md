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

Uploads go to the private uploads disk through `App\Concerns\InteractsWithUploads` —
never `disk('public')`. See `.ai/rules/controllers.md`.

```php
use App\Concerns\InteractsWithUploads;

class DosenController extends Controller
{
    use InteractsWithUploads;
    // ...
}

$validated = $request->validate([
    'photo' => ['nullable', 'file', 'image:jpeg,jpg,png', 'max:2048'],
]);

$photoPath = null;
if ($request->hasFile('photo')) {
    // Delete old photo if exists
    static::deleteUpload($model->user?->photo);
    $photoPath = static::storeUpload($request->file('photo'), 'photos');
}
```

### React Form

The bucket is private, so the page receives `photo_url` (an expiring pre-signed
URL appended by the `User` model), never the raw `photo` path. Do not build
`/storage/${path}`.

```tsx
// type User = { photo: string | null; photo_url: string | null };
const existingPhoto = model.user?.photo_url;
const [photoPreview, setPhotoPreview] = useState<string | null>(
    existingPhoto ?? null
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
