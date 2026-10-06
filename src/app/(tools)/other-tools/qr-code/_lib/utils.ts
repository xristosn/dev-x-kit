import VCard from 'vcf';

export const DataSchemaTypes = {
  Text: 'Text',
  URL: 'URL',
  Wifi: 'Wi-fi',
  Geo: 'Geolocation',
  Sms: 'SMS',
  Email: 'Email',
  vCard: 'vCard',
} as const;

export type DataSchemaTypes = (typeof DataSchemaTypes)[keyof typeof DataSchemaTypes];

export type TextData = {
  text: string;
};

export type WifiData = {
  ssid: string;
  encryption: 'WPA';
  password: string;
  hidden: boolean;
};

export type GeoData = {
  lat: number;
  lng: number;
};

export type SmsData = {
  phone: string;
  message: string;
};

export type EmailData = {
  to: string;
  subject: string;
  body: string;
};

export type VCardData = {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  telWork?: string;
  telCell?: string;
  email?: string;
  url?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  note?: string;
};

export type DataSchemaValueMap = {
  [DataSchemaTypes.Text]: TextData;
  [DataSchemaTypes.URL]: TextData;
  [DataSchemaTypes.Wifi]: WifiData;
  [DataSchemaTypes.Geo]: GeoData;
  [DataSchemaTypes.Sms]: SmsData;
  [DataSchemaTypes.Email]: EmailData;
  [DataSchemaTypes.vCard]: VCardData;
};

type SchemaConfig = {
  [K in DataSchemaTypes]: {
    initial: DataSchemaValueMap[K];
    stringify: (data: DataSchemaValueMap[K]) => string;
    parse: (raw: string) => DataSchemaValueMap[K] | null;
  };
};

function addVCardName(card: VCard, data: VCardData) {
  card.set('n', `${data.lastName || ''};${data.firstName || ''};;;`);
}

function addVCardOrganizationAndTitle(card: VCard, data: VCardData) {
  if (data.organization) card.set('org', data.organization);
  if (data.title) card.set('title', data.title);
}

function addVCardPhones(card: VCard, data: VCardData) {
  if (data.telWork) card.add('tel', data.telWork, { type: 'WORK,VOICE' });
  if (data.telCell) card.add('tel', data.telCell, { type: 'CELL,VOICE' });
}

function addVCardEmailAndUrl(card: VCard, data: VCardData) {
  if (data.email) card.add('email', data.email, { type: 'INTERNET,PREF' });
  if (data.url) card.set('url', data.url);
}

function addVCardAddress(card: VCard, data: VCardData) {
  const addressParts = [data.street, data.city, data.state, data.postalCode, data.country];

  if (addressParts.some(Boolean)) {
    card.set('adr', `;;${addressParts.join(';')}`, { type: 'work' });
  }
}

function stringifyVCard(data: VCardData): string {
  const card = new VCard();
  card.set('version', '3.0');

  addVCardName(card, data);
  addVCardOrganizationAndTitle(card, data);
  addVCardPhones(card, data);
  addVCardEmailAndUrl(card, data);
  addVCardAddress(card, data);
  if (data.note) card.set('note', data.note);

  return card.toString();
}

function parseVCardName(card: VCard) {
  const name = card.get('n')?.valueOf()?.toString().split(';') || [];

  return {
    lastName: name[0] || '',
    firstName: name[1] || '',
  };
}

function parseVCardAddress(card: VCard) {
  const address = card.get('adr')?.valueOf()?.toString().split(';') || [];

  return {
    street: address[2] || '',
    city: address[3] || '',
    state: address[4] || '',
    postalCode: address[5] || '',
    country: address[6] || '',
  };
}

function parseVCardPhones(card: VCard) {
  const tel = card.get('tel');
  const phones = Array.isArray(tel) ? tel : [tel];

  return {
    telWork: phones.find((phone) => phone.is('work'))?.valueOf() || '',
    telCell: phones.find((phone) => phone.is('cell'))?.valueOf() || '',
  };
}

function getVCardPropertyValue(card: VCard, property: string): string {
  return (card.get(property)?.valueOf() as string) || '';
}

function parseVCard(raw: string): VCardData {
  try {
    const card = new VCard().parse(raw);

    return {
      ...parseVCardName(card),
      ...parseVCardAddress(card),
      ...parseVCardPhones(card),
      organization: getVCardPropertyValue(card, 'org'),
      title: getVCardPropertyValue(card, 'title'),
      email: getVCardPropertyValue(card, 'email'),
      url: getVCardPropertyValue(card, 'url'),
      note: getVCardPropertyValue(card, 'note'),
    };
  } catch {
    return DATA_SCHEMAS_CONFIG[DataSchemaTypes.vCard].initial;
  }
}

const DATA_SCHEMAS_CONFIG: SchemaConfig = {
  [DataSchemaTypes.Text]: {
    initial: { text: 'Hello World' } as TextData,
    stringify: (data: TextData) => data.text,
    parse: (raw: string) => ({ text: raw }),
  },

  [DataSchemaTypes.URL]: {
    initial: { text: 'https://' } as TextData,
    stringify: (data: TextData) =>
      data.text.startsWith('http') ? data.text : `https://${data.text}`,
    parse: (raw: string) => ({ text: raw }),
  },

  [DataSchemaTypes.Wifi]: {
    initial: {
      ssid: '',
      password: '',
      encryption: 'WPA',
      hidden: false,
    } as WifiData,
    stringify: (data: WifiData) =>
      `WIFI:S:${data.ssid};T:${data.encryption || 'WPA'};P:${data.password || ''};H:${data.hidden || false};;`,
    parse: (raw: string) => {
      const match = raw.match(/WIFI:S:(.*?);T:(.*?);P:(.*?);H:(.*?);;/i);
      if (!match) return null;
      return {
        ssid: match[1],
        encryption: match[2],
        password: match[3],
        hidden: match[4] === 'true',
      } as WifiData;
    },
  },

  [DataSchemaTypes.Geo]: {
    initial: { lat: 0, lng: 0 } as GeoData,
    stringify: (data: GeoData) => `geo:${data.lat},${data.lng}`,
    parse: (raw: string) => {
      const [lat, lng] = raw.replace('geo:', '').split(',');
      return { lat: parseFloat(lat || '0'), lng: parseFloat(lng || '0') };
    },
  },

  [DataSchemaTypes.Sms]: {
    initial: { phone: '', message: '' } as SmsData,
    stringify: (data: SmsData) => `smsto:${data.phone}:${data.message || ''}`,
    parse: (raw: string) => {
      const parts = raw.replace(/smsto:/i, '').split(':');
      return { phone: parts[0], message: parts[1] || '' };
    },
  },

  [DataSchemaTypes.Email]: {
    initial: { to: '', subject: '', body: '' } as EmailData,
    stringify: (data: EmailData) =>
      `MATMSG:TO:${data.to};SUB:${data.subject || ''};BODY:${data.body || ''};;`,
    parse: (raw: string) => {
      const to = raw.match(/TO:(.*?);/i)?.[1] || '';
      const sub = raw.match(/SUB:(.*?);/i)?.[1] || '';
      const body = raw.match(/BODY:(.*?);/i)?.[1] || '';
      return { to, subject: sub, body };
    },
  },

  [DataSchemaTypes.vCard]: {
    initial: {
      firstName: '',
      lastName: '',
      organization: '',
      title: '',
      telWork: '',
      telCell: '',
      email: '',
      url: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      note: '',
    } as VCardData,
    stringify: stringifyVCard,

    parse: parseVCard,
  },
};

export function getStringifiedValue<K extends DataSchemaTypes>(
  dataType: K,
  value: DataSchemaValueMap[K]
): string {
  const schema = DATA_SCHEMAS_CONFIG[dataType];
  return (schema.stringify as (data: DataSchemaValueMap[K]) => string)(value);
}

export function getDefaultStringifiedValue<K extends DataSchemaTypes>(dataType: K): string {
  const schema = DATA_SCHEMAS_CONFIG[dataType];
  return getStringifiedValue(dataType, schema.initial);
}

export function getParsedValue(dataType: DataSchemaTypes, value: string) {
  return DATA_SCHEMAS_CONFIG[dataType].parse(value);
}
