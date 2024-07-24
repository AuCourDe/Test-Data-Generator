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

PRE-response:
// Sprawdź, czy zmienna "fileCounter" istnieje, jeśli nie - zainicjalizuj ją na 0
if (!pm.environment.has('fileCounter')) {
    pm.environment.set('fileCounter', 0);
}

// Pobierz aktualny licznik
var fileCounter = parseInt(pm.environment.get('fileCounter'));

// Utwórz nazwę pliku na podstawie licznika
var fileName = 'plik_' + fileCounter + '.txt';

// Zapisz nazwę pliku w zmiennej środowiskowej
pm.environment.set('fileName', fileName);

// Opcjonalnie - wyświetl informację o nazwie pliku w konsoli
console.log('Aktualna nazwa pliku:', fileName);



POST-response:
// Pobierz aktualny licznik
var fileCounter = parseInt(pm.environment.get('fileCounter'));

// Zwiększ licznik o 1
fileCounter++;

// Zapisz zaktualizowany licznik
pm.environment.set('fileCounter', fileCounter);

// Opcjonalnie - wyświetl informację o zaktualizowanym liczniku w konsoli
console.log('Zaktualizowany licznik pliku:', fileCounter);

STARMAN
W BODY -> data-form:
1 file | file | wskaż plik z dysku 
2 fileName | text | {{fileName}}
