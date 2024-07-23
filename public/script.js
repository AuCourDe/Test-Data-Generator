document.addEventListener('DOMContentLoaded', function () {
    // Dodaj obsługę przełącznika tematu
    const themeSwitch = document.getElementById('theme-switch');
    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', themeSwitch.checked);
    });

    const modules = [
        { id: 'name', title: 'Imię', settings: [{ type: 'radio', name: 'gender', options: { all: 'Losowe', male: 'Męskie', female: 'Damskie' } }], generateUrl: '/generate/name' },
        { id: 'surname', title: 'Nazwisko', settings: [{ type: 'radio', name: 'gender', options: { all: 'Losowe', male: 'Męskie', female: 'Damskie' } }], generateUrl: '/generate/surname' },
        { id: 'date', title: 'Data', settings: [{ type: 'select', name: 'format', options: { 'DD-MM-YYYY': 'DD-MM-RRRR', 'YYYY-MM-DD': 'RRRR-MM-DD', 'YYYY-DD-MM': 'RRRR-DD-MM', 'MM-DD-YYYY': 'MM-DD-RRRR' } }, { type: 'select', name: 'separator', options: { '-': '-', '/': '/', '.': '.', ' ' : ' ' } }], generateUrl: '/generate/date' },
        { id: 'pesel', title: 'PESEL', settings: [{ type: 'radio', name: 'gender', options: { male: 'Męskie', female: 'Damskie' } }, { type: 'number', name: 'year', placeholder: 'Rok (RRRR)' }], generateUrl: '/generate/pesel' },
        { id: 'id', title: 'Numer Dowodu', settings: [], generateUrl: '/generate/id' },
        { id: 'swift', title: 'SWIFT', settings: [], generateUrl: '/generate/swift' },
        { id: 'nip', title: 'NIP', settings: [], generateUrl: '/generate/nip' },
        { id: 'regon', title: 'REGON', settings: [{ type: 'radio', name: 'type', options: { 9: '9-znakowy', 14: '14-znakowy' } }], generateUrl: '/generate/regon' },
        { id: 'landRegistry', title: 'Księga Wieczysta', settings: [], generateUrl: '/generate/landRegistry' },
        { id: 'bankAccount', title: 'Numer Rachunku Bankowego', settings: [], generateUrl: '/generate/bankAccount' },
        { id: 'iban', title: 'IBAN', settings: [], generateUrl: '/generate/iban' },
        { id: 'companyName', title: 'Nazwa Firmy', settings: [{ type: 'number', name: 'wordCount', placeholder: 'Liczba słów (1-7)' }, { type: 'checkbox', name: 'funny', label: 'Zabawne nazwy' }], generateUrl: '/generate/companyName' },
        { id: 'street', title: 'Ulica', settings: [{ type: 'number', name: 'wordCount', placeholder: 'Liczba słów (1-7)' }, { type: 'checkbox', name: 'funny', label: 'Zabawne nazwy' }], generateUrl: '/generate/street' },
        { id: 'city', title: 'Miasto', settings: [], generateUrl: '/generate/city' },
        { id: 'postalCode', title: 'Kod Pocztowy', settings: [], generateUrl: '/generate/postalCode' },
        { id: 'comment', title: 'Komentarz', settings: [{ type: 'number', name: 'words', placeholder: 'Liczba słów', value: 10 }, { type: 'number', name: 'characters', placeholder: 'Liczba znaków' }], generateUrl: '/generate/comment' },
        { id: 'specialComment', title: 'Komentarz Specjalny', settings: [{ type: 'radio', name: 'type', options: { sqlInjection: 'SQL Injection', specialCharacters: 'Znaki specjalne' } }], generateUrl: '/generate/specialComment' }
    ];

    const modulesContainer = document.getElementById('modules');

    modules.forEach(module => {
        const moduleElement = document.createElement('div');
        moduleElement.classList.add('module');
        moduleElement.id = module.id;

        const header = document.createElement('div');
        header.classList.add('module-header');
        header.innerHTML = `<span>${module.title}</span><span class="copy-message" style="display: none;">Skopiowano do schowka</span>`;

        const content = document.createElement('div');
        content.classList.add('module-content');

        const data = document.createElement('div');
        data.classList.add('module-data');
        data.id = `${module.id}-data`;
        data.onclick = () => copyToClipboard(module.id);

        const buttons = document.createElement('div');
        buttons.classList.add('module-buttons');

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Odśwież';
        refreshButton.onclick = () => fetchData(module.id, module.generateUrl);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Kopiuj';
        copyButton.onclick = () => copyToClipboard(module.id);

        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'Ustawienia';
        settingsButton.onclick = () => toggleSettings(module.id);

        buttons.appendChild(refreshButton);
        buttons.appendChild(copyButton);
        buttons.appendChild(settingsButton);

        content.appendChild(data);
        content.appendChild(buttons);

        moduleElement.appendChild(header);
        moduleElement.appendChild(content);

        if (module.settings.length) {
            const settingsContainer = document.createElement('div');
            settingsContainer.id = `${module.id}-settings`;
            settingsContainer.style.display = 'none';
            settingsContainer.classList.add('settings-container');

            module.settings.forEach(setting => {
                const settingElement = document.createElement('div');
                settingElement.classList.add('setting');

                if (setting.type === 'number') {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.name = setting.name;
                    input.placeholder = setting.placeholder;
                    if (setting.value) {
                        input.value = setting.value;
                    }
                    input.oninput = validateAndToggleInput;
                    settingElement.appendChild(input);
                } else if (setting.type === 'radio') {
                    for (const [value, label] of Object.entries(setting.options)) {
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = setting.name;
                        input.value = value;

                        const inputLabel = document.createElement('label');
                        inputLabel.textContent = label;
                        inputLabel.prepend(input);

                        settingElement.appendChild(inputLabel);
                    }
                } else if (setting.type === 'checkbox') {
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.name = setting.name;

                    const inputLabel = document.createElement('label');
                    inputLabel.textContent = setting.label;
                    inputLabel.prepend(input);

                    input.onchange = () => fetchData(module.id, module.generateUrl);

                    settingElement.appendChild(inputLabel);
                    settingElement.appendChild(input);
                } else if (setting.type === 'select') {
                    const select = document.createElement('select');
                    select.name = setting.name;
                    for (const [value, label] of Object.entries(setting.options)) {
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = label;
                        select.appendChild(option);
                    }
                    settingElement.appendChild(select);
                }
                settingsContainer.appendChild(settingElement);
            });

            const quantitySelect = document.createElement('select');
            quantitySelect.name = 'quantity';
            [1, 10, 50].forEach(qty => {
                const option = document.createElement('option');
                option.value = qty;
                option.textContent = qty;
                quantitySelect.appendChild(option);
            });
            settingsContainer.appendChild(quantitySelect);

            const clearButton = document.createElement('button');
            clearButton.textContent = 'Wyczyść filtr ustawień';
            clearButton.onclick = () => clearSettings(module.id);
            settingsContainer.appendChild(clearButton);

            moduleElement.appendChild(settingsContainer);
        } else {
            const settingsContainer = document.createElement('div');
            settingsContainer.id = `${module.id}-settings`;
            settingsContainer.style.display = 'none';
            settingsContainer.classList.add('settings-container');

            const quantitySelect = document.createElement('select');
            quantitySelect.name = 'quantity';
            [1, 10, 50].forEach(qty => {
                const option = document.createElement('option');
                option.value = qty;
                option.textContent = qty;
                quantitySelect.appendChild(option);
            });
            settingsContainer.appendChild(quantitySelect);

            const clearButton = document.createElement('button');
            clearButton.textContent = 'Wyczyść filtr ustawień';
            clearButton.onclick = () => clearSettings(module.id);
            settingsContainer.appendChild(clearButton);

            moduleElement.appendChild(settingsContainer);
        }

        modulesContainer.appendChild(moduleElement);
        fetchData(module.id, module.generateUrl);
    });

    function fetchData(moduleId, url) {
        const moduleElement = document.getElementById(moduleId);
        const settings = moduleElement.querySelectorAll('.settings-container input, .settings-container select');
        const params = new URLSearchParams();
        settings.forEach(setting => {
            if (setting.type === 'radio' && !setting.checked) return;
            if (setting.type === 'checkbox' && !setting.checked) return;
            if (setting.name === 'characters' && setting.value) clearWordCountField(moduleId);
            if (setting.name === 'words' && setting.value) clearCharacterCountField(moduleId);
            if (setting.type === 'checkbox' && setting.checked && setting.name === 'funny') {
                params.append(setting.name, 'true');
            } else if (setting.name === 'year') {
                if (setting.value.length === 4 && !isNaN(setting.value) && parseInt(setting.value, 10) >= 1800 && parseInt(setting.value, 10) <= 2299) {
                    params.append(setting.name, setting.value);
                }
            } else if (setting.value) {
                params.append(setting.name, setting.value);
            }
        });

        fetch(`${url}?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById(`${moduleId}-data`).textContent = data;
            });
    }

    function copyToClipboard(moduleId) {
        const data = document.getElementById(`${moduleId}-data`).textContent;
        navigator.clipboard.writeText(data).then(() => {
            showCopyMessage(moduleId);
        });
    }

    function showCopyMessage(moduleId) {
        const moduleElement = document.getElementById(moduleId);
        const messageElement = moduleElement.querySelector('.copy-message');
        messageElement.style.display = 'inline-block';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 1000);
    }

    function toggleSettings(moduleId) {
        const settings = document.getElementById(`${moduleId}-settings`);
        settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
    }

    function clearSettings(moduleId) {
        const settings = document.getElementById(`${moduleId}-settings`);
        const inputs = settings.getElementsByTagName('input');
        for (const input of inputs) {
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        }
        const selects = settings.getElementsByTagName('select');
        for (const select of selects) {
            select.value = select.options[0].value;
        }
    }

    function clearWordCountField(moduleId) {
        const settings = document.getElementById(`${moduleId}-settings`);
        const wordCountInput = settings.querySelector('input[name="words"]');
        if (wordCountInput) wordCountInput.value = '';
    }

    function clearCharacterCountField(moduleId) {
        const settings = document.getElementById(`${moduleId}-settings`);
        const charCountInput = settings.querySelector('input[name="characters"]');
        if (charCountInput) charCountInput.value = '';
    }

    function validateAndToggleInput(event) {
        const input = event.target;
        const value = input.value;
        const moduleId = input.closest('.module').id;

        if (input.name === 'year') {
            if (value.length === 4) {
                const yearValue = parseInt(value, 10);
                if (isNaN(yearValue) || yearValue < 1800 || yearValue > 2299) {
                    showError(input, 'Dozwolony zakres 1800-2299');
                    input.value = '';
                }
            } else if (value.length > 4) {
                showError(input, 'Rok musi mieć dokładnie 4 cyfry');
                input.value = '';
            }
        } else if (isNaN(value) || value < 1 || value > 1000) {
            showError(input, 'Akceptowane wartości liczbowe z zakresu 1-1000');
            input.value = '';
        } else {
            if (input.name === 'words') {
                clearCharacterCountField(moduleId);
            } else if (input.name === 'characters') {
                clearWordCountField(moduleId);
            }
        }
    }

    function showError(input, message) {
        const error = document.createElement('div');
        error.classList.add('error-message');
        error.style.color = 'red';
        error.textContent = message;
        input.parentNode.appendChild(error);
        setTimeout(() => {
            error.remove();
        }, 3000);
    }
});
