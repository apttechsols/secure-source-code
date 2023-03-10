const { sprintf } = require('sprintf-js');

interface StringToStringMap {
	[key: string]: string;
}

interface CodeToCountryMap {
	[key: string]: string[];
}

const codeToLanguageE_: StringToStringMap = {};
codeToLanguageE_['aa'] = 'Afar';
codeToLanguageE_['ab'] = 'Abkhazian';
codeToLanguageE_['af'] = 'Afrikaans';
codeToLanguageE_['am'] = 'Amharic';
codeToLanguageE_['an'] = 'Aragonese';
codeToLanguageE_['ar'] = 'Arabic';
codeToLanguageE_['as'] = 'Assamese';
codeToLanguageE_['ay'] = 'Aymara';
codeToLanguageE_['az'] = 'Azerbaijani';
codeToLanguageE_['ba'] = 'Bashkir';
codeToLanguageE_['be'] = 'Byelorussian';
codeToLanguageE_['bg'] = 'Bulgarian';
codeToLanguageE_['bh'] = 'Bihari';
codeToLanguageE_['bi'] = 'Bislama';
codeToLanguageE_['bn'] = 'Bangla';
codeToLanguageE_['bo'] = 'Tibetan';
codeToLanguageE_['br'] = 'Breton';
codeToLanguageE_['bs'] = 'Bosnian';
codeToLanguageE_['ca'] = 'Catalan';
codeToLanguageE_['co'] = 'Corsican';
codeToLanguageE_['cs'] = 'Czech';
codeToLanguageE_['cy'] = 'Welsh';
codeToLanguageE_['da'] = 'Danish';
codeToLanguageE_['de'] = 'German';
codeToLanguageE_['dz'] = 'Bhutani';
codeToLanguageE_['el'] = 'Greek';
codeToLanguageE_['en'] = 'English';
codeToLanguageE_['eo'] = 'Esperanto';
codeToLanguageE_['es'] = 'Spanish';
codeToLanguageE_['et'] = 'Estonian';
codeToLanguageE_['eu'] = 'Basque';
codeToLanguageE_['fa'] = 'Persian';
codeToLanguageE_['fi'] = 'Finnish';
codeToLanguageE_['fj'] = 'Fiji';
codeToLanguageE_['fo'] = 'Faroese';
codeToLanguageE_['fr'] = 'French';
codeToLanguageE_['fy'] = 'Frisian';
codeToLanguageE_['ga'] = 'Irish';
codeToLanguageE_['gd'] = 'Gaelic';
codeToLanguageE_['gl'] = 'Galician';
codeToLanguageE_['gn'] = 'Guarani';
codeToLanguageE_['gu'] = 'Gujarati';
codeToLanguageE_['ha'] = 'Hausa';
codeToLanguageE_['he'] = 'Hebrew';
codeToLanguageE_['hi'] = 'Hindi';
codeToLanguageE_['hr'] = 'Croatian';
codeToLanguageE_['hu'] = 'Hungarian';
codeToLanguageE_['hy'] = 'Armenian';
codeToLanguageE_['ia'] = 'Interlingua';
codeToLanguageE_['id'] = 'Indonesian';
codeToLanguageE_['ie'] = 'Interlingue';
codeToLanguageE_['ik'] = 'Inupiak';
codeToLanguageE_['is'] = 'Icelandic';
codeToLanguageE_['it'] = 'Italian';
codeToLanguageE_['iu'] = 'Inuktitut';
codeToLanguageE_['ja'] = 'Japanese';
codeToLanguageE_['jw'] = 'Javanese';
codeToLanguageE_['ka'] = 'Georgian';
codeToLanguageE_['kk'] = 'Kazakh';
codeToLanguageE_['kl'] = 'Greenlandic';
codeToLanguageE_['km'] = 'Cambodian';
codeToLanguageE_['kn'] = 'Kannada';
codeToLanguageE_['ko'] = 'Korean';
codeToLanguageE_['ks'] = 'Kashmiri';
codeToLanguageE_['ku'] = 'Kurdish';
codeToLanguageE_['ky'] = 'Kirghiz';
codeToLanguageE_['la'] = 'Latin';
codeToLanguageE_['ln'] = 'Lingala';
codeToLanguageE_['lo'] = 'Laothian';
codeToLanguageE_['lt'] = 'Lithuanian';
codeToLanguageE_['lv'] = 'Latvian';
codeToLanguageE_['mg'] = 'Malagasy';
codeToLanguageE_['mi'] = 'Maori';
codeToLanguageE_['mk'] = 'Macedonian';
codeToLanguageE_['ml'] = 'Malayalam';
codeToLanguageE_['mn'] = 'Mongolian';
codeToLanguageE_['mo'] = 'Moldavian';
codeToLanguageE_['mr'] = 'Marathi';
codeToLanguageE_['ms'] = 'Malay';
codeToLanguageE_['mt'] = 'Maltese';
codeToLanguageE_['my'] = 'Burmese';
codeToLanguageE_['na'] = 'Nauru';
codeToLanguageE_['nb'] = 'Norwegian';
codeToLanguageE_['ne'] = 'Nepali';
codeToLanguageE_['nl'] = 'Dutch';
codeToLanguageE_['no'] = 'Norwegian';
codeToLanguageE_['oc'] = 'Occitan';
codeToLanguageE_['om'] = 'Oromo';
codeToLanguageE_['or'] = 'Oriya';
codeToLanguageE_['pa'] = 'Punjabi';
codeToLanguageE_['pl'] = 'Polish';
codeToLanguageE_['ps'] = 'Pushto';
codeToLanguageE_['pt'] = 'Portuguese';
codeToLanguageE_['qu'] = 'Quechua';
codeToLanguageE_['rm'] = 'Rhaeto-Romance';
codeToLanguageE_['rn'] = 'Kirundi';
codeToLanguageE_['ro'] = 'Romanian';
codeToLanguageE_['ru'] = 'Russian';
codeToLanguageE_['rw'] = 'Kinyarwanda';
codeToLanguageE_['sa'] = 'Sanskrit';
codeToLanguageE_['sd'] = 'Sindhi';
codeToLanguageE_['sg'] = 'Sangho';
codeToLanguageE_['sh'] = 'Serbo-Croatian';
codeToLanguageE_['si'] = 'Sinhalese';
codeToLanguageE_['sk'] = 'Slovak';
codeToLanguageE_['sl'] = 'Slovenian';
codeToLanguageE_['sm'] = 'Samoan';
codeToLanguageE_['sn'] = 'Shona';
codeToLanguageE_['so'] = 'Somali';
codeToLanguageE_['sq'] = 'Albanian';
codeToLanguageE_['sr'] = 'Serbian';
codeToLanguageE_['ss'] = 'Siswati';
codeToLanguageE_['st'] = 'Sesotho';
codeToLanguageE_['su'] = 'Sundanese';
codeToLanguageE_['sv'] = 'Swedish';
codeToLanguageE_['sw'] = 'Swahili';
codeToLanguageE_['ta'] = 'Tamil';
codeToLanguageE_['te'] = 'Telugu';
codeToLanguageE_['tg'] = 'Tajik';
codeToLanguageE_['th'] = 'Thai';
codeToLanguageE_['ti'] = 'Tigrinya';
codeToLanguageE_['tk'] = 'Turkmen';
codeToLanguageE_['tl'] = 'Tagalog';
codeToLanguageE_['tn'] = 'Setswana';
codeToLanguageE_['to'] = 'Tonga';
codeToLanguageE_['tr'] = 'Turkish';
codeToLanguageE_['ts'] = 'Tsonga';
codeToLanguageE_['tt'] = 'Tatar';
codeToLanguageE_['tw'] = 'Twi';
codeToLanguageE_['ug'] = 'Uighur';
codeToLanguageE_['uk'] = 'Ukrainian';
codeToLanguageE_['ur'] = 'Urdu';
codeToLanguageE_['uz'] = 'Uzbek';
codeToLanguageE_['vi'] = 'Vietnamese';
codeToLanguageE_['vo'] = 'Volapuk';
codeToLanguageE_['wo'] = 'Wolof';
codeToLanguageE_['xh'] = 'Xhosa';
codeToLanguageE_['yi'] = 'Yiddish';
codeToLanguageE_['yo'] = 'Yoruba';
codeToLanguageE_['za'] = 'Zhuang';
codeToLanguageE_['zh'] = 'Chinese';
codeToLanguageE_['zu'] = 'Zulu';

const codeToLanguage_: StringToStringMap = {};
codeToLanguage_['an'] = 'Aragon??s';
codeToLanguage_['da'] = 'Dansk';
codeToLanguage_['de'] = 'Deutsch';
codeToLanguage_['en'] = 'English';
codeToLanguage_['es'] = 'Espa??ol';
codeToLanguage_['fr'] = 'Fran??ais';
codeToLanguage_['he'] = '????????????';
codeToLanguage_['it'] = 'Italiano';
codeToLanguage_['lt'] = 'Lietuvi?? kalba';
codeToLanguage_['lv'] = 'Latvie??u';
codeToLanguage_['nl'] = 'Nederlands';
codeToLanguage_['pl'] = 'Polski';
codeToLanguage_['pt'] = 'Portugu??s';
codeToLanguage_['ru'] = '??????????????';
codeToLanguage_['sk'] = 'Sloven??ina';
codeToLanguage_['sq'] = 'Shqip';
codeToLanguage_['sr'] = '???????????? ??????????';
codeToLanguage_['tr'] = 'T??rk??e';
codeToLanguage_['ja'] = '?????????';
codeToLanguage_['ko'] = '?????????';
codeToLanguage_['sv'] = 'Svenska';
codeToLanguage_['el'] = '????????????????';
codeToLanguage_['zh'] = '??????';
codeToLanguage_['ro'] = 'Rom??n??';
codeToLanguage_['et'] = 'Eesti Keel';
codeToLanguage_['vi'] = 'Ti???ng Vi???t';
codeToLanguage_['hu'] = 'Magyar';

const codeToCountry_: CodeToCountryMap = {
	AD: ['Andorra', 'Andorra'],
	AE: ['United Arab Emirates', '???????? ???????????????? ???????????????? ????????????????'],
	AF: ['Afghanistan', '?? ?????????????????? ???????????? ???????????????? ???????????? ??????????????????,?????????????? ???????????? ??????????????????'],
	AG: ['Antigua and Barbuda', 'Antigua and Barbuda'],
	AI: ['Anguilla', 'Anguilla'],
	AL: ['Albania', 'Shqip??ria'],
	AM: ['Armenia', '????????????????'],
	AO: ['Angola', 'Angola'],
	AQ: ['Antarctica', 'Antarctica,??Ant??rtico,??Antarctique,??????????????????????'],
	AR: ['Argentina', 'Argentina'],
	AS: ['American Samoa', 'American Samoa'],
	AT: ['Austria', '??sterreich'],
	AU: ['Australia', 'Australia'],
	AW: ['Aruba', 'Aruba'],
	AX: ['Aland Islands', '??land'],
	AZ: ['Azerbaijan', 'Az??rbaycan'],
	BA: ['Bosnia and Herzegovina', 'Bosna i Hercegovina'],
	BB: ['Barbados', 'Barbados'],
	BD: ['Bangladesh', '?????????????????????????????????????????? ????????????????????????'],
	BE: ['Belgium', 'Belgi??,??Belgique,??Belgien'],
	BF: ['Burkina Faso', 'Burkina Faso'],
	BG: ['Bulgaria', '????????????????'],
	BH: ['Bahrain', '??????????????'],
	BI: ['Burundi', 'Burundi'],
	BJ: ['Benin', 'B??nin'],
	BL: ['Saint-Barth??lemy', 'Saint-Barth??lemy'],
	BM: ['Bermuda', 'Bermuda'],
	BN: ['Brunei Darussalam', 'Brunei Darussalam'],
	BO: ['Bolivia', 'Bolivia,??Bulibiya,??Vol??via,??Wuliwya'],
	BQ: ['Caribbean Netherlands', 'Caribisch Nederland'],
	BR: ['Brazil', 'Brasil'],
	BS: ['Bahamas', 'Bahamas'],
	BT: ['Bhutan', '???????????????????????????'],
	BV: ['Bouvet Island', 'Bouvet??ya'],
	BW: ['Botswana', 'Botswana'],
	BY: ['Belarus', '????????????????'],
	BZ: ['Belize', 'Belize'],
	CA: ['Canada', 'Canada'],
	CC: ['Cocos (Keeling) Islands', 'Cocos (Keeling) Islands'],
	CD: ['Democratic Republic of the Congo??(Congo-Kinshasa, former Zaire)', 'R??publique D??mocratique du Congo'],
	CF: ['Centrafrican Republic', 'R??publique centrafricaine,??K??d??r??s??se t?? B??afr??ka'],
	CG: ['Republic of the Congo??(Congo-Brazzaville)', 'R??publique du Congo'],
	CH: ['Switzerland', 'Schweiz,??Suisse,??Svizzera,??Svizra'],
	CI: ['C??te d\'Ivoire', 'C??te d\'Ivoire'],
	CK: ['Cook Islands', 'Cook Islands,??K??ki ????irani'],
	CL: ['Chile', 'Chile'],
	CM: ['Cameroon', 'Cameroun,??Cameroon'],
	CN: ['China', '??????'],
	CO: ['Colombia', 'Colombia'],
	CR: ['Costa Rica', 'Costa Rica'],
	CU: ['Cuba', 'Cuba'],
	CV: ['Cabo Verde', 'Cabo Verde'],
	CW: ['Cura??ao', 'Cura??ao'],
	CX: ['Christmas Island', 'Christmas Island'],
	CY: ['Cyprus', '????????????,??Kibris'],
	CZ: ['Czech Republic', '??esk?? republika'],
	DE: ['Germany', 'Deutschland'],
	DJ: ['Djibouti', 'Djibouti,??????????????,??Jabuuti,??Gabuutih'],
	DK: ['Denmark', 'Danmark'],
	DM: ['Dominica', 'Dominica'],
	DO: ['Dominican Republic', 'Rep??blica Dominicana'],
	DZ: ['Algeria', '??????????????'],
	EC: ['Ecuador', 'Ecuador'],
	EE: ['Estonia', 'Eesti'],
	EG: ['Egypt', '??????'],
	EH: ['Western Sahara', 'Sahara Occidental'],
	ER: ['Eritrea', '????????????,??????????????,??Eritrea'],
	ES: ['Spain', 'Espa??a'],
	ET: ['Ethiopia', '???????????????,??Itoophiyaa'],
	FI: ['Finland', 'Suomi'],
	FJ: ['Fiji', 'Fiji'],
	FK: ['Falkland Islands', 'Falkland Islands'],
	FM: ['Micronesia (Federated States of)', 'Micronesia'],
	FO: ['Faroe Islands', 'F??royar,??F??r??erne'],
	FR: ['France', 'France'],
	GA: ['Gabon', 'Gabon'],
	GB: ['United Kingdom', 'United Kingdom'],
	GD: ['Grenada', 'Grenada'],
	GE: ['Georgia', '??????????????????????????????'],
	GF: ['French Guiana', 'Guyane fran??aise'],
	GG: ['Guernsey', 'Guernsey'],
	GH: ['Ghana', 'Ghana'],
	GI: ['Gibraltar', 'Gibraltar'],
	GL: ['Greenland', 'Kalaallit Nunaat,??Gr??nland'],
	GM: ['The Gambia', 'The Gambia'],
	GN: ['Guinea', 'Guin??e'],
	GP: ['Guadeloupe', 'Guadeloupe'],
	GQ: ['Equatorial Guinea', 'Guiena ecuatorial,??Guin??e ??quatoriale,??Guin?? Equatorial'],
	GR: ['Greece', '????????????'],
	GS: ['South Georgia and the South Sandwich Islands', 'South Georgia and the South Sandwich Islands'],
	GT: ['Guatemala', 'Guatemala'],
	GU: ['Guam', 'Guam,??Gu??h??n'],
	GW: ['Guinea Bissau', 'Guin??-Bissau'],
	GY: ['Guyana', 'Guyana'],
	HK: ['Hong Kong (SAR of China)', '??????,??Hong Kong'],
	HM: ['Heard Island and McDonald Islands', 'Heard Island and McDonald Islands'],
	HN: ['Honduras', 'Honduras'],
	HR: ['Croatia', 'Hrvatska'],
	HT: ['Haiti', 'Ha??ti,??Ayiti'],
	HU: ['Hungary', 'Magyarorsz??g'],
	ID: ['Indonesia', 'Indonesia'],
	IE: ['Ireland', 'Ireland,????ire'],
	IL: ['Israel', '??????????'],
	IM: ['Isle of Man', 'Isle of Man'],
	IN: ['India', '????????????,??India'],
	IO: ['British Indian Ocean Territory', 'British Indian Ocean Territory'],
	IQ: ['Iraq', '????????????,??Iraq'],
	IR: ['Iran', '??????????'],
	IS: ['Iceland', '??sland'],
	IT: ['Italy', 'Italia'],
	JE: ['Jersey', 'Jersey'],
	JM: ['Jamaica', 'Jamaica'],
	JO: ['Jordan', '??????????????????'],
	JP: ['Japan', '??????'],
	KE: ['Kenya', 'Kenya'],
	KG: ['Kyrgyzstan', '????????????????????,??????????????????'],
	KH: ['Cambodia', '?????????????????????'],
	KI: ['Kiribati', 'Kiribati'],
	KM: ['Comores', '?????????????????,??Comores,??Komori'],
	KN: ['Saint Kitts and Nevis', 'Saint Kitts and Nevis'],
	KP: ['North Korea', '?????????'],
	KR: ['South Korea', '????????????'],
	KW: ['Kuwait', '????????????'],
	KY: ['Cayman Islands', 'Cayman Islands'],
	KZ: ['Kazakhstan', '??????????????????,????????????????????'],
	LA: ['Laos', '??????????????????????????????'],
	LB: ['Lebanon', '??????????,??Liban'],
	LC: ['Saint Lucia', 'Saint Lucia'],
	LI: ['Liechtenstein', 'Liechtenstein'],
	LK: ['Sri Lanka', '??????????????? ????????????,????????????????????'],
	LR: ['Liberia', 'Liberia'],
	LS: ['Lesotho', 'Lesotho'],
	LT: ['Lithuania', 'Lietuva'],
	LU: ['Luxembourg', 'L??tzebuerg,??Luxembourg,??Luxemburg'],
	LV: ['Latvia', 'Latvija'],
	LY: ['Libya', '??????????'],
	MA: ['Morocco', 'Maroc,????????????????????,??????????????'],
	MC: ['Monaco', 'Monaco'],
	MD: ['Moldova', 'Moldova,??????????????????'],
	ME: ['Montenegro', 'Crna Gora,?????????? ????????'],
	MF: ['Saint Martin (French part)', 'Saint-Martin'],
	MG: ['Madagascar', 'Madagasikara,??Madagascar'],
	MH: ['Marshall Islands', 'Marshall Islands'],
	MK: ['North Macedonia', '?????????????? ????????????????????'],
	ML: ['Mali', 'Mali'],
	MM: ['Myanmar', '??????????????????'],
	MN: ['Mongolia', '???????????? ??????'],
	MO: ['Macao (SAR of China)', '??????,??Macau'],
	MP: ['Northern Mariana Islands', 'Northern Mariana Islands'],
	MQ: ['Martinique', 'Martinique'],
	MR: ['Mauritania', '??????????????????,??Mauritanie'],
	MS: ['Montserrat', 'Montserrat'],
	MT: ['Malta', 'Malta'],
	MU: ['Mauritius', 'Maurice,??Mauritius'],
	MV: ['Maldives', ''],
	MW: ['Malawi', 'Malawi'],
	MX: ['Mexico', 'M??xico'],
	MY: ['Malaysia', ''],
	MZ: ['Mozambique', 'Mozambique'],
	NA: ['Namibia', 'Namibia'],
	NC: ['New Caledonia', 'Nouvelle-Cal??donie'],
	NE: ['Niger', 'Niger'],
	NF: ['Norfolk Island', 'Norfolk Island'],
	NG: ['Nigeria', 'Nigeria'],
	NI: ['Nicaragua', 'Nicaragua'],
	NL: ['The Netherlands', 'Nederland'],
	NO: ['Norway', 'Norge,??Noreg'],
	NP: ['Nepal', ''],
	NR: ['Nauru', 'Nauru'],
	NU: ['Niue', 'Niue'],
	NZ: ['New Zealand', 'New Zealand'],
	OM: ['Oman', '?????????? ??????????'],
	PA: ['Panama', 'Panama'],
	PE: ['Peru', 'Per??'],
	PF: ['French Polynesia', 'Polyn??sie fran??aise'],
	PG: ['Papua New Guinea', 'Papua New Guinea'],
	PH: ['Philippines', 'Philippines'],
	PK: ['Pakistan', '??????????????'],
	PL: ['Poland', 'Polska'],
	PM: ['Saint Pierre and Miquelon', 'Saint-Pierre-et-Miquelon'],
	PN: ['Pitcairn', 'Pitcairn'],
	PR: ['Puerto Rico', 'Puerto Rico'],
	PS: ['Palestinian Territory', 'Palestinian Territory'],
	PT: ['Portugal', 'Portugal'],
	PW: ['Palau', 'Palau'],
	PY: ['Paraguay', 'Paraguay'],
	QA: ['Qatar', '??????'],
	RE: ['Reunion', 'La R??union'],
	RO: ['Romania', 'Rom??nia'],
	RS: ['Serbia', '????????????'],
	RU: ['Russia', '????????????'],
	RW: ['Rwanda', 'Rwanda'],
	SA: ['Saudi Arabia', '????????????????'],
	SB: ['Solomon Islands', 'Solomon Islands'],
	SC: ['Seychelles', 'Seychelles'],
	SD: ['Sudan', '??????????????'],
	SE: ['Sweden', 'Sverige'],
	SG: ['Singapore', 'Singapore'],
	SH: ['Saint Helena', 'Saint Helena'],
	SI: ['Slovenia', 'Slovenija'],
	SJ: ['Svalbard and Jan Mayen', 'Svalbard and Jan Mayen'],
	SK: ['Slovakia', 'Slovensko'],
	SL: ['Sierra Leone', 'Sierra Leone'],
	SM: ['San Marino', 'San Marino'],
	SN: ['S??n??gal', 'S??n??gal'],
	SO: ['Somalia', 'Somalia,????????????????'],
	SR: ['Suriname', 'Suriname'],
	ST: ['S??o Tom?? and Pr??ncipe', 'S??o Tom?? e Pr??ncipe'],
	SS: ['South Sudan', 'South Sudan'],
	SV: ['El Salvador', 'El Salvador'],
	SX: ['Saint Martin (Dutch part)', 'Sint Maarten'],
	SY: ['Syria', '??????????,??S??riyya'],
	SZ: ['eSwatini', 'eSwatini'],
	TC: ['Turks and Caicos Islands', 'Turks and Caicos Islands'],
	TD: ['Chad', 'Tchad,??????????'],
	TF: ['French Southern and Antarctic Lands', 'Terres australes et antarctiques fran??aises'],
	TG: ['Togo', 'Togo'],
	TH: ['Thailand', '???????????????????????????'],
	TJ: ['Tajikistan', ','],
	TK: ['Tokelau', 'Tokelau'],
	TL: ['Timor-Leste', 'Timor-Leste'],
	TM: ['Turkmenistan', 'T??rkmenistan'],
	TN: ['Tunisia', '????????,??Tunisie'],
	TO: ['Tonga', 'Tonga'],
	TR: ['Turkey', 'T??rkiye'],
	TT: ['Trinidad and Tobago', 'Trinidad and Tobago'],
	TV: ['Tuvalu', 'Tuvalu'],
	TW: ['Taiwan', 'Taiwan'],
	TZ: ['Tanzania', 'Tanzania'],
	UA: ['Ukraine', '??????????????'],
	UG: ['Uganda', 'Uganda'],
	UM: ['United States Minor Outlying Islands', 'United States Minor Outlying Islands'],
	US: ['United States of America', 'United States of America'],
	UY: ['Uruguay', 'Uruguay'],
	UZ: ['Uzbekistan', ''],
	VA: ['City of the Vatican', 'Citt?? del Vaticano'],
	VC: ['Saint Vincent and the Grenadines', 'Saint Vincent and the Grenadines'],
	VE: ['Venezuela', 'Venezuela'],
	VG: ['British Virgin Islands', 'British Virgin Islands'],
	VI: ['United States Virgin Islands', 'United States Virgin Islands'],
	VN: ['Vietnam', 'Vi???t Nam'],
	VU: ['Vanuatu', 'Vanuatu'],
	WF: ['Wallis and Futuna', 'Wallis-et-Futuna'],
	WS: ['Samoa', 'Samoa'],
	YE: ['Yemen', '??????????????'],
	YT: ['Mayotte', 'Mayotte'],
	ZA: ['South Africa', 'South Africa'],
	ZM: ['Zambia', 'Zambia'],
	ZW: ['Zimbabwe', 'Zimbabwe'],
};

let supportedLocales_: any = null;
let localeStats_: any = null;

const loadedLocales_: any = {};

const defaultLocale_ = 'en_GB';

let currentLocale_ = defaultLocale_;

function defaultLocale() {
	return defaultLocale_;
}

function localeStats() {
	if (!localeStats_) localeStats_ = require('./locales/index.js').stats;
	return localeStats_;
}

function supportedLocales(): string[] {
	if (!supportedLocales_) supportedLocales_ = require('./locales/index.js').locales;

	const output = [];
	for (const n in supportedLocales_) {
		if (!supportedLocales_.hasOwnProperty(n)) continue;
		output.push(n);
	}
	return output;
}

interface SupportedLocalesToLanguagesOptions {
	includeStats?: boolean;
}

function supportedLocalesToLanguages(options: SupportedLocalesToLanguagesOptions = null) {
	if (!options) options = {};
	const stats = localeStats();
	const locales = supportedLocales();
	const output: StringToStringMap = {};
	for (let i = 0; i < locales.length; i++) {
		const locale = locales[i];
		output[locale] = countryDisplayName(locale);

		const stat = stats[locale];
		if (options.includeStats && stat) {
			output[locale] += ` (${stat.percentDone}%)`;
		}
	}
	return output;
}

function closestSupportedLocale(canonicalName: string, defaultToEnglish: boolean = true, locales: string[] = null) {
	locales = locales === null ? supportedLocales() : locales;
	if (locales.indexOf(canonicalName) >= 0) return canonicalName;

	const requiredLanguage = languageCodeOnly(canonicalName).toLowerCase();

	for (let i = 0; i < locales.length; i++) {
		const locale = locales[i];
		const language = locale.split('_')[0];
		if (requiredLanguage === language) return locale;
	}

	return defaultToEnglish ? 'en_GB' : null;
}

function countryName(countryCode: string) {
	const r = codeToCountry_[countryCode] ? codeToCountry_[countryCode] : null;
	if (!r) return '';
	return r.length > 1 && !!r[1] ? r[1] : r[0];
}

function languageNameInEnglish(languageCode: string) {
	return codeToLanguageE_[languageCode] ? codeToLanguageE_[languageCode] : '';
}

function languageName(languageCode: string, defaultToEnglish: boolean = true) {
	if (codeToLanguage_[languageCode]) return codeToLanguage_[languageCode];
	if (defaultToEnglish) return languageNameInEnglish(languageCode);
	return '';
}

function languageCodeOnly(canonicalName: string) {
	if (canonicalName.length < 2) return canonicalName;
	return canonicalName.substr(0, 2);
}

function countryCodeOnly(canonicalName: string) {
	if (canonicalName.length <= 2) return '';
	return canonicalName.substr(3);
}

function countryDisplayName(canonicalName: string) {
	const languageCode = languageCodeOnly(canonicalName);
	const countryCode = countryCodeOnly(canonicalName);

	let output = languageName(languageCode);

	let extraString;

	if (countryCode) {
		if (languageCode === 'zh' && countryCode === 'CN') {
			extraString = '??????'; // "Simplified" in "Simplified Chinese"
		} else {
			extraString = countryName(countryCode);
		}
	}

	if (languageCode === 'zh' && (countryCode === '' || countryCode === 'TW')) extraString = '??????'; // "Traditional" in "Traditional Chinese"

	if (extraString) {
		output += ` (${extraString})`;
	} else if (countryCode) {
		// If we have a country code but couldn't match it to a country name,
		// just display the full canonical name (applies for example to es-419
		// for Latin American Spanish).
		output += ` (${canonicalName})`;
	}

	return output;
}

function localeStrings(canonicalName: string) {
	const locale = closestSupportedLocale(canonicalName);

	if (loadedLocales_[locale]) return loadedLocales_[locale];

	loadedLocales_[locale] = Object.assign({}, supportedLocales_[locale]);

	return loadedLocales_[locale];
}

const currentLocale = () => {
	return currentLocale_;
};

function setLocale(canonicalName: string) {
	if (currentLocale_ === canonicalName) return;
	currentLocale_ = closestSupportedLocale(canonicalName);
}

function languageCode() {
	return languageCodeOnly(currentLocale_);
}

function localesFromLanguageCode(languageCode: string, locales: string[]): string[] {
	return locales.filter((l: string) => {
		return languageCodeOnly(l) === languageCode;
	});
}

function _(s: string, ...args: any[]): string {
	const strings = localeStrings(currentLocale_);
	let result = strings[s];
	if (result === '' || result === undefined) result = s;
	try {
		return sprintf(result, ...args);
	} catch (error) {
		return `${result} ${args.join(', ')} (Translation error: ${error.message})`;
	}
}

function _n(singular: string, plural: string, n: number, ...args: any[]) {
	if (n > 1) return _(plural, ...args);
	return _(singular, ...args);
}

export { _, _n, supportedLocales, currentLocale, localesFromLanguageCode, languageCodeOnly, countryDisplayName, localeStrings, setLocale, supportedLocalesToLanguages, defaultLocale, closestSupportedLocale, languageCode, countryCodeOnly };
