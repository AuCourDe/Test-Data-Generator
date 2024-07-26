# Test-Data-Generator
Test data generator for testing Polish applications

![image](https://github.com/user-attachments/assets/d99632fe-e7e9-44a9-bfac-a3631ed50b26)

Server side scripts based on Node.js. 

Random test data for:
    - Name,
    - Surname,
    - Date,
    - PESEL,
    - ID,
    - Swift,
    - NIP,
    - REGON,
    - Land Registry Number,
    - Bank Account Number,
    - IBAN,
    - Company Name,
    - Street,
    - City,
    - Postal Code,
    - Comment,
    - Special Comment (special signs)
    
Each module can generate many data at time, some module have extra esttings. 

![image](https://github.com/user-attachments/assets/4bc0c9b6-e2f3-4636-ac93-83765ed2fdc2)

TODO:

- requirements.
- user side scripts instead of server-side.




Postman 28:

Postman, chciałbym zrobić listę 10 plików z ich ścieżkami do konkretnego pliku na dysku lokalnym. Przed pierwszym testem skrypt powinien wybrać pierwszy plik z listy. Po teście powinien dodać informacje do zmiennej który plik został wykorzystany po to aby w trakcie kolejnego testu wziąć następny plik z listy. Test nie może wziąć nigdy dwa razy tego samego pliku dlatego po wykorzystaniu wszystkich plików skrypt powinien napisać w konsoli, że wymagany jest updated listy plików. Napisz taki skrypt na potrzeby postman


Aby stworzyć taki skrypt w Postmanie, możemy skorzystać z mechanizmu pre-request script oraz test script. Skrypt będzie używał zmiennych środowiskowych (environment variables) do przechowywania listy plików oraz informacji o aktualnie używanym pliku.

### Krok 1: Przygotowanie listy plików

Najpierw, utwórz zmienną środowiskową `fileList` i ustaw jej wartość jako JSON-ową tablicę ze ścieżkami do plików, np.:

```json
[
    "/path/to/file1.txt",
    "/path/to/file2.txt",
    "/path/to/file3.txt",
    "/path/to/file4.txt",
    "/path/to/file5.txt",
    "/path/to/file6.txt",
    "/path/to/file7.txt",
    "/path/to/file8.txt",
    "/path/to/file9.txt",
    "/path/to/file10.txt"
]
```

### Krok 2: Pre-request Script

W pre-request script dodajemy kod, który wybiera pierwszy nieużywany plik z listy i ustawia go jako aktualnie używany plik:

```javascript
// Pobierz listę plików i aktualny indeks z zmiennych środowiskowych
let fileList = pm.environment.get('fileList');
let currentIndex = pm.environment.get('currentIndex') || 0;

fileList = JSON.parse(fileList);

// Sprawdź, czy indeks nie przekracza długości listy
if (currentIndex >= fileList.length) {
    console.log('Wymagana jest aktualizacja listy plików.');
} else {
    // Wybierz plik na podstawie aktualnego indeksu
    let currentFile = fileList[currentIndex];
    
    // Ustaw aktualny plik w zmiennej środowiskowej
    pm.environment.set('currentFile', currentFile);
    
    // Zwiększ indeks na potrzeby następnego wywołania
    pm.environment.set('currentIndex', currentIndex + 1);
}
```

### Krok 3: Test Script

W teście po zakończeniu wywołania API, dodajemy kod, który sprawdza czy wszystkie pliki zostały wykorzystane:

```javascript
// Pobierz listę plików i aktualny indeks z zmiennych środowiskowych
let fileList = pm.environment.get('fileList');
let currentIndex = pm.environment.get('currentIndex');

fileList = JSON.parse(fileList);

// Sprawdź, czy wszystkie pliki zostały wykorzystane
if (currentIndex >= fileList.length) {
    console.log('Wszystkie pliki zostały wykorzystane. Wymagana jest aktualizacja listy plików.');
} else {
    let usedFile = pm.environment.get('currentFile');
    console.log('Używany plik:', usedFile);
}
```

### Krok 4: Ustawienia w Postmanie

1. Przejdź do ustawień środowiska (Environment) i utwórz nowe środowisko (lub edytuj istniejące).
2. Dodaj zmienną `fileList` z wartością JSON-owej tablicy plików.
3. Dodaj zmienną `currentIndex` z początkową wartością `0`.

### Użycie skryptu

- W pre-request script kod będzie wybierał kolejny plik do użycia przed każdym wywołaniem API.
- W test script kod będzie sprawdzał, czy wszystkie pliki zostały wykorzystane i informował w konsoli.

Jeśli wszystkie pliki zostaną wykorzystane, skrypt wypisze w konsoli, że lista plików wymaga aktualizacji. Wtedy należy zaktualizować zmienną `fileList` w ustawieniach środowiska, dodając nowe ścieżki do plików i zresetować `currentIndex` do `0`.



Napisz skrypt w PowerShell, który po wskazaniu ścieżki do pliku, tworzy w tym samym katalogu 1000 kopii tego samego pliku, ale że zmieniona nazwą. Nowe Nazway plików powinna się składać z: oryginalna nazwa pliku + aktualny "rok + aktualny miesiąc + aktualny dzień + czterocyfrowy licznik + .rozszerzenie pliku". Jeżeli nazwa pliku już istnieje to napisz ją. Przykład: oryginalna nazwa pliku to "test.pdf", pierwsza kopia pliku to "test202407260001.pdf" druga nazwa pliku to "test202407260002.pdf" i tak dalej + plik .json z nazwami wygenerowanych plików.

Oto zmodyfikowany skrypt PowerShell, który oprócz tworzenia kopii plików zapisuje również ich pełne ścieżki do pliku JSON.

```powershell
# Parametr: Ścieżka do oryginalnego pliku
param (
    [string]$filePath
)

# Sprawdź, czy plik istnieje
if (-Not (Test-Path -Path $filePath)) {
    Write-Host "Podany plik nie istnieje."
    exit
}

# Pobierz informacje o pliku
$file = Get-Item $filePath
$directory = $file.DirectoryName
$baseName = [System.IO.Path]::GetFileNameWithoutExtension($file)
$extension = $file.Extension

# Pobierz aktualną datę
$date = Get-Date
$dateString = $date.ToString("yyyyMMdd")

# Licznik plików
$counter = 1

# Lista ścieżek do wygenerowanych plików
$filePaths = @()

# Tworzenie kopii pliku
for ($i = 1; $i -le 1000; $i++) {
    $newFileName = "{0}{1}{2:0000}{3}" -f $baseName, $dateString, $counter, $extension
    $newFilePath = Join-Path $directory $newFileName

    if (Test-Path -Path $newFilePath) {
        Write-Host "Plik o nazwie $newFileName już istnieje."
    } else {
        Copy-Item -Path $filePath -Destination $newFilePath
        # Dodaj ścieżkę do listy
        $filePaths += $newFilePath
    }

    $counter++
}

# Ścieżka do pliku JSON
$jsonFilePath = Join-Path $directory "$baseName$($dateString)_generated_files.json"

# Zapisz listę ścieżek do pliku JSON
$jsonContent = $filePaths | ConvertTo-Json -Compress
Set-Content -Path $jsonFilePath -Value $jsonContent

Write-Host "Pliki zostały skopiowane i zapisane w $jsonFilePath"
```

### Jak używać skryptu

1. Skopiuj powyższy kod do pliku `.ps1`, na przykład `CopyFilesWithJson.ps1`.
2. Otwórz PowerShell jako administrator.
3. Przejdź do katalogu, w którym znajduje się skrypt.
4. Uruchom skrypt, przekazując ścieżkę do oryginalnego pliku jako parametr. Na przykład:

```powershell
.\CopyFilesWithJson.ps1 -filePath "C:\ścieżka\do\pliku\test.pdf"
```

Skrypt utworzy 1000 kopii pliku `test.pdf` w tym samym katalogu z odpowiednio zmienionymi nazwami, np. `test202407260001.pdf`, `test202407260002.pdf` itd. Ponadto zapisze pełne ścieżki do wygenerowanych plików w pliku JSON o nazwie `test20240726_generated_files.json` w tym samym katalogu.

