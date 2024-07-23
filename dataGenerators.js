// dataGenerators.js
const random = require('random');
const bigInt = require("big-integer");

const names = {
    male: ['Jan', 'Piotr', 'Paweł', 'Adam', 'Michał', 'Krzysztof'],
    female: ['Anna', 'Maria', 'Katarzyna', 'Agnieszka', 'Barbara'],
    all: ['Anna', 'Maria', 'Katarzyna', 'Agnieszka', 'Barbara', 'Magdalena', 'Ewa', 'Krystyna', 'Elżbieta', 'Marta', 'Joanna', 'Aleksandra', 'Teresa', 'Danuta']
};

const surnames = {
    male: ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski'],
    female: ['Nowak', 'Kowalska', 'Wiśniewska', 'Wójcik', 'Kowalczyk', 'Kamińska', 'Lewandowska'],
    all: ['Nowak', 'Kowalska', 'Wiśniewska', 'Wójcik', 'Kowalczyk', 'Kamińska', 'Lewandowska', 'Zielińska', 'Szymańska', 'Woźniak', 'Dąbrowska', 'Kozłowska']
};


const cities = ["Warszawa", "Kraków", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Bydgoszcz", "Lublin", "Katowice"];

const streets = ["Kościuszki", "Mickiewicza", "Słowackiego", "Sienkiewicza"];

const companyNames = ["Brygadex", "Świeżex", "Słoneczex", "Spółdzielex", "Konsulex"];

const companyTypes = ["Spółka z o.o", "Spółka jawna", "Spółka cywilna", "Korporacja", "Konsorcjum"];

const funnyCompanyNames = ["Gorący trójkąt", "Lodziarnia Zimny Drań", "Ministerstwo Wakacji"];

const funnyStreetNames = ["10 Zakładników", "Alibaby", "Amora", "Beznazwy"];

const sqlInjectionExamples = ["' OR '1'='1", "admin'--", "admin' #"];

const specialCharacters = 'ąćęłńóśźżÄäÖöÜüßàâæçéèêëîïôœùûüÿÇÉÀÈÙÂÊÎÔÛŒaeiouyãẽĩõũâêîôûŕãẽĩõũ' + '❤️✈️⬛️⚪️';

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGender() {
    return Math.random() < 0.5 ? 'male' : 'female';
}

function randomName(gender) {
    const selectedNames = names[gender] || names.all;
    return selectedNames[Math.floor(Math.random() * selectedNames.length)];
}

function randomSurname(gender) {
    const selectedSurnames = surnames[gender] || surnames.all;
    return selectedSurnames[Math.floor(Math.random() * selectedSurnames.length)];
}

function generateName(gender = 'all', quantity = 1) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        result.push(randomName(gender));
    }
    return result.join(', ');
}

function generateSurname(gender = 'all', quantity = 1) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        result.push(randomSurname(gender));
    }
    return result.join(', ');
}


function generateDate(quantity = 1, format = 'DD-MM-YYYY', separator = '-') {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        const year = generateRandomNumber(1900, 2023);
        const month = String(generateRandomNumber(1, 12)).padStart(2, '0');
        const day = String(generateRandomNumber(1, 28)).padStart(2, '0');
        let date;
        switch (format) {
            case 'YYYY-MM-DD':
                date = `${year}${separator}${month}${separator}${day}`;
                break;
            case 'YYYY-DD-MM':
                date = `${year}${separator}${day}${separator}${month}`;
                break;
            case 'MM-DD-YYYY':
                date = `${month}${separator}${day}${separator}${year}`;
                break;
            default:
                date = `${day}${separator}${month}${separator}${year}`;
        }
        result.push(date);
    }
    return result.join(', ');
}

function generatePESEL(gender = randomGender(), quantity = 1, year) {
    const result = [];
    const genderDigit = gender === 'male' ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
    for (let i = 0; i < quantity; i++) {
        const birthYear = (year && year.toString().length === 4 && year >= 1800 && year <= 2299) ? year : generateRandomNumber(1924, 2024);
        const birthMonth = generateRandomNumber(1, 12);
        const birthDay = String(generateRandomNumber(1, 28)).padStart(2, '0');

        let month;
        if (birthYear >= 1800 && birthYear <= 1899) {
            month = birthMonth + 80;
        } else if (birthYear >= 2000 && birthYear <= 2099) {
            month = birthMonth + 20;
        } else if (birthYear >= 2100 && birthYear <= 2199) {
            month = birthMonth + 40;
        } else if (birthYear >= 2200 && birthYear <= 2299) {
            month = birthMonth + 60;
        } else {
            month = birthMonth;
        }
        month = String(month).padStart(2, '0');
        
        const serial = String(generateRandomNumber(0, 999)).padStart(3, '0');
        const genderSpecificDigit = genderDigit[generateRandomNumber(0, genderDigit.length - 1)];
        const peselWithoutChecksum = `${String(birthYear).slice(-2)}${month}${birthDay}${serial}${genderSpecificDigit}`;
        const checksum = calculatePESELChecksum(peselWithoutChecksum);
        result.push(`${peselWithoutChecksum}${checksum}`);
    }
    return result.join(', ');
}


function calculatePESELChecksum(peselWithoutChecksum) {
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = peselWithoutChecksum
        .split('')
        .reduce((acc, digit, index) => acc + parseInt(digit, 10) * weights[index], 0);
    const modulo = sum % 10;
    return modulo === 0 ? 0 : 10 - modulo;
}

function generateID(quantity = 1) {
    const result = [];
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < quantity; i++) {
        const series = `${letters.charAt(generateRandomNumber(0, 25))}${letters.charAt(generateRandomNumber(0, 25))}${letters.charAt(generateRandomNumber(0, 25))}`;
        const number = String(generateRandomNumber(100000, 999999));
        result.push(`${series}${number}`);
    }
    return result.join(', ');
}

function generateSwift(quantity = 1) {
    const result = [];
    const swifts = [
"ALBPPLPW", "ALBPPLPW", "ABNAPLPW", "PPABPLPK", "BPHKPLPK", "GOSKPLPW", "CITIPLPX", "BIGBPLPW", "EBOSPLPW", "BKCHPLPX", "PKOPPLPW", "POLUPLPR", "CAIXPLPW", "PCBCPLPW", "AGRIPLPR", "DABAPLPW", "DEUTPLPX", "MHBFPLPW", "FBPLPLPW", "GBGCPLPK", "ESSIPLPX", "HSBCPLPW", "ICBKPLPW", "IEEAPLPA", "INGBPLPW", "BCITPLPW", "SKOKPLPW", "BREXPLPW", "MBBPPLPW", "BOTKPLPW", "NBPLPLPW", "NESBPLPW", "BPKOPLPW", "IVSEPLPP", "POCZPLP4", "RCBWPLPW", "ABNAPLPW", "WBKPPLPP", "SCFBPLPW", "GBWCPLPP", "ESSEPLPW", "SOGEPLPW", "HANDPLPW", "TOBAPLPW", "WARTPLPW", "VOWAPLP9"
];
    for (let i = 0; i < quantity; i++) {
        result.push(swifts[generateRandomNumber(0, swifts.length - 1)]);
    }
    return result.join(', ');
}

function generateNIP(quantity = 1) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        const nipWithoutChecksum = `${generateRandomNumber(100000000, 999999999)}`;
        const checksum = calculateNIPChecksum(nipWithoutChecksum);
        result.push(`${nipWithoutChecksum}${checksum}`);
    }
    return result.join(', ');
}

function calculateNIPChecksum(nipWithoutChecksum) {
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const sum = nipWithoutChecksum
        .split('')
        .reduce((acc, digit, index) => acc + parseInt(digit, 10) * weights[index], 0);
    const modulo = sum % 11;
    return modulo === 10 ? 0 : modulo;
}


function generateREGON(quantity = 1, type = 9) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        result.push(type === 9 ? generateRegon9() : generateRegon14());
    }
    return result.join(', ');
}

function generateRegon9() {
    var provinceCode = getRandomProvinceCode();
    var randomPart = getRegonRandomPart();
    var base = "" + provinceCode + randomPart;
    var controlSum = getRegonControlSumField(base);
    return base + controlSum;
}

function getRandomProvinceCode() {
    var random = getRandomInt(0, 48);
    var provinceCode = 2 * random + 1;
    return addLeadingZeros(provinceCode, 2);
}

function getRegonRandomPart() {
    var randomInt = getRandomInt(0, 999999);
    return addLeadingZeros(randomInt, 6);
}

function getRegonControlSumField(base) {
    var controlSum = 8 * base[0] + 9 * base[1] + 2 * base[2] + 3 * base[3] + 4 * base[4]
        + 5 * base[5] + 6 * base[6] + 7 * base[7];
    var controlSumRest = controlSum % 11;
    if (controlSumRest == 10) {
        return 0;
    }
    return controlSumRest;
}

function generateRegon14() {
    var regon9 = generateRegon9();
    var randomPart = getRegon14RandomPart();
    var base = "" + regon9 + randomPart;
    var controlSum = getRegon14ControlSumField(base);
    return base + controlSum;
}

function getRegon14RandomPart() {
    var randomInt = getRandomInt(0, 9994);
    return addLeadingZeros(randomInt, 4);
}

function getRegon14ControlSumField(base) {
    var controlSum = 2 * base[0] + 4 * base[1] + 8 * base[2] + 5 * base[3] + 0 * base[4]
        + 9 * base[5] + 7 * base[6] + 3 * base[7] + 6 * base[8] + 1 * base[9]
        + 3 * base[10] + 7 * base[11] + 9 * base[12];
    var controlSumRest = controlSum % 11;
    if (controlSumRest == 10) {
        return 0;
    }
    return controlSumRest;
}

function addLeadingZeros(number, length) {
    return number.toString().padStart(length, '0');
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function generateLandRegistryNumber(quantity = 1) {
    const result = [];
    const codes = [ 'BB1B', 'BB1C', 'BB1Z', 'BI1B', 'BI1P', 'BI1S', 'BI2P', 'BI3P', 'BY1B', 'BY1I', 'BY1M', 'BY1N', 'BY1S', 'BY1T', 'BY1U', 'BY1Z', 'BY2T', 'CIKW', 'CZ1C', 'CZ1L', 'CZ1M', 'CZ1Z', 'CZ2C', 'DIRS', 'EL1B', 'EL1D', 'EL1E', 'EL1I', 'EL1N'];

    for (let i = 0; i < quantity; i++) {
        const code = codes[generateRandomNumber(0, codes.length - 1)];
        const number = String(generateRandomNumber(1, 99999999)).padStart(8, '0');
        const landRegistryNumberWithoutChecksum = `${code}${number}`;
        const checksum = calculateLandRegistryNumberChecksum(landRegistryNumberWithoutChecksum);
        result.push(`${code}/${number}/${checksum}`);
    }
    return result.join(', ');
}

function calculateLandRegistryNumberChecksum(numberWithoutChecksum) {
    const weights = [1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    const values = {
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'X': 10, 'A': 11, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16,
        'G': 17, 'H': 18, 'I': 19, 'J': 20, 'K': 21, 'L': 22, 'M': 23, 'N': 24, 'O': 25, 'P': 26,
        'R': 27, 'S': 28, 'T': 29, 'U': 30, 'W': 31, 'Y': 32, 'Z': 33
    };
    const sum = numberWithoutChecksum
        .split('')
        .reduce((acc, char, index) => acc + (values[char] || 0) * weights[index], 0);
    return sum % 10;
}


const unitCodes = [
    "10100000", "10100039", "10100055", "10100068", "10101010", "10101023", "10101049", "10101078", "10101140", "10101212", "10101238", "10101270", "10101339", "10101371", "10101397", "10101401", "10101469", "10101528", "10101599", "10101674", "10101704", "10200003", "10200016", "10200029", "10200032", "10200045", "10200058", "10200061", "10200074", "10201013", "10201026", "10201042", "10201055", "10201068", "10201097", "10201127", "10201156", "10201169", "10201185", "10201260", "10201332", "10201390", "10201433", "10201462", "10201475", "10201491", "10201505", "10201563", "10201592", "10201664", "10201752", "10201778", "10201811", "10201853", "10201866", "10201879", "10201909", "10201912", "10201954", "10201967", "10202036", "10202124", "10202137", "10202212", "10202241", "10202267", "10202313", "10202368", "10202384", "10202401", "10202430", "10202472", "10202498", "10202528", "10202629", "10202645", "10202674", "10202733", "10202746", "10202762", "10202791", "10202821", "10202847", "10202892", "10202906", "10202964", "10202980", "10203017", "10203088", "10203121", "10203147", "10203150", "10203176", "10203206", "10203219", "10203235", "10203352", "10203378", "10203408", "10203437", "10203440", "10203453", "10203466", "10203541", "10203570", "10203583", "10203613", "10203639", "10203668", "10203714", "10203802", "10203844", "10203903", "10203916", "10203958", "10203974", "10204027", "10204115", "10204128", "10204144", "10204160", "10204274", "10204287", "10204317", "10204391", "10204405", "10204476", "10204564", "10204580", "10204649", "10204665", "10204681", "10204708", "10204724", "10204753", "10204795", "10204812", "10204867", "10204870", "10204900", "10204913", "10204926", "10204939", "10204955", "10204984", "10205011", "10205024", "10205040", "10205095", "10205112", "10205138", "10205170", "10205200", "10205226", "10205242", "10205297", "10205356", "10205385", "10205402"
];


function generateIBAN(quantity = 1) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        result.push(generateIbanWithPrefix(true, false)); // generujemy IBAN z prefiksem PL
    }
    return result.join(', ');
}

function generateBankAccountNumber(quantity = 1) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        result.push(generateIbanWithPrefix(false, false)); // generujemy numer rachunku bez prefiksu PL
    }
    return result.join(', ');
}

function generateIbanWithPrefix(prefix, spaces) {
    var unitCode = getRandomUnitCode();
    var randomPart = getIbanRandomPart();
    var base = "" + unitCode + randomPart;
    var controlSum = getIbanControlSumField(base);
    var iban = controlSum + base;
    if (spaces) {
        iban = prettyFormated(iban);
    }
    if (prefix) {
        iban = 'PL' + iban;
    }
    return iban;
}

function getRandomUnitCode() {
    var index = getRandomInt(0, unitCodes.length - 1);
    return unitCodes[index];
}

function getIbanRandomPart() {
    var randomInt = getRandomInt(0, 9999999999999999);
    return addLeadingZeros(randomInt, 16);
}

function getIbanControlSumField(base) {
    var baseNumber = bigInt(base + "252100");
    var remainder = baseNumber.mod(97);
    var controlNumber = bigInt(98).minus(remainder).toString();
    return addLeadingZeros(controlNumber, 2);
}

function prettyFormated(iban) {
    var formated = iban.substring(0, 2);
    for (var i = 2; i < 26; i += 4) {
        formated = formated + ' ' + iban.substring(i, i + 4);
    }
    return formated;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addLeadingZeros(number, length) {
    return number.toString().padStart(length, '0');
}





function generateCompanyName(quantity = 1, wordCount = 1, funny = false) {
    const namesArray = funny ? funnyCompanyNames : companyNames;
    if (!namesArray.length) return '';
    const result = [];
    for (let i = 0; i < quantity; i++) {
        const words = [];
        for (let j = 0; j < wordCount; j++) {
            words.push(namesArray[generateRandomNumber(0, namesArray.length - 1)]);
        }
        const companyType = companyTypes[generateRandomNumber(0, companyTypes.length - 1)];
        result.push(words.join(' ') + ' ' + companyType);
    }
    return result.join(', ');
}

function generateStreet(quantity = 1, wordCount = 1, funny = false) {
    const namesArray = funny ? funnyStreetNames : streets;
    if (!namesArray.length) return '';
    const result = [];
    for (let i = 0; i < quantity; i++) {
        const words = [];
        for (let j = 0; j < wordCount; j++) {
            words.push(namesArray[generateRandomNumber(0, namesArray.length - 1)]);
        }
        result.push(words.join(' '));
    }
    return result.join(', ');
}

function generateCity(quantity = 1) {
    if (!cities.length) return '';
    const result = [];
    for (let i = 0; i < quantity; i++) {
        result.push(cities[generateRandomNumber(0, cities.length - 1)]);
    }
    return result.join(', ');
}

function generatePostalCode(quantity = 1) {
    const result = [];
    for (let i = 0; i < quantity; i++) {
        result.push(generateSinglePostalCode());
    }
    return result.join(', ');
}

function generateSinglePostalCode() {
    const part1 = getRandomInt(0, 99);
    const part2 = getRandomInt(0, 999);
    return `${addLeadingZeros(part1, 2)}-${addLeadingZeros(part2, 3)}`;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addLeadingZeros(number, length) {
    return number.toString().padStart(length, '0');
}

function generateComment(quantity = 1, wordCount = 10, characterCount) {
    const words = [
"poprawić", "szybko", "potrzeba", "pilnie", "albo", "zwrócić", "przygotować", "napisać", "zadzwonić", "wysłać", "ponieważ", "dlatego", "bardzo", "nalegać"
]; // Przykładowe słowa do generowania komentarza
    const result = [];
    for (let i = 0; i < quantity; i++) {
        let comment = '';
        if (characterCount) {
            while (comment.length < characterCount) {
                comment += words[generateRandomNumber(0, words.length - 1)] + ' ';
            }
            comment = comment.substring(0, characterCount);
        } else {
            for (let j = 0; j < wordCount; j++) {
                comment += words[generateRandomNumber(0, words.length - 1)] + ' ';
            }
        }
        result.push(comment.trim());
    }
    return result.join(', ');
}


function generateSpecialComment(quantity = 1, type, characterCount = 25) {
    if (!sqlInjectionExamples.length) return '';
    const result = [];
    for (let i = 0; i < quantity; i++) {
        if (type === 'sqlInjection') {
            result.push(sqlInjectionExamples[generateRandomNumber(0, sqlInjectionExamples.length - 1)]);
        } else if (type === 'specialCharacters') {
            let specialCharactersString = '';
            for (let j = 0; j < characterCount; j++) {
                specialCharactersString += specialCharacters.charAt(generateRandomNumber(0, specialCharacters.length - 1));
            }
            result.push(specialCharactersString);
        } else {
            let chars = 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ';
            let shuffled = chars.split('').sort(() => 0.5 - Math.random()).join('').slice(0, characterCount);
            result.push(shuffled);
        }
    }
    return result.join(', ');
}


module.exports = {
    generateName,
    generateSurname,
    generateDate,
    generatePESEL,
    generateID,
    generateSwift,
    generateNIP,
    generateREGON,
    generateLandRegistryNumber,
    generateBankAccountNumber,
    generateIBAN,
    generateCompanyName,
    generateStreet,
    generateCity,
    generatePostalCode,
    generateComment,
    generateSpecialComment
};