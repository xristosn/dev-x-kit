import VCard from 'vcf';

export enum DataSchemaTypes {
  Text = 'Text',
  URL = 'URL',
  Wifi = 'Wi-fi',
  Geo = 'Geolocation',
  Sms = 'SMS',
  Email = 'Email',
  vCard = 'vCard',
}

export interface TextData {
  text: string;
}

export interface WifiData {
  ssid: string;
  encryption: 'WPA';
  password: string;
  hidden: boolean;
}

export interface GeoData {
  lat: number;
  lng: number;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface VCardData {
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
}

export interface DataSchemaValueMap {
  [DataSchemaTypes.Text]: TextData;
  [DataSchemaTypes.URL]: TextData;
  [DataSchemaTypes.Wifi]: WifiData;
  [DataSchemaTypes.Geo]: GeoData;
  [DataSchemaTypes.Sms]: SmsData;
  [DataSchemaTypes.Email]: EmailData;
  [DataSchemaTypes.vCard]: VCardData;
}

type SchemaConfig = {
  [K in DataSchemaTypes]: {
    initial: DataSchemaValueMap[K];
    stringify: (data: DataSchemaValueMap[K]) => string;
    parse: (raw: string) => DataSchemaValueMap[K] | null;
  };
};

export const DATA_SCHEMAS_CONFIG: SchemaConfig = {
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
    stringify: (data: VCardData) => {
      const card = new VCard();
      card.set('version', '3.0');

      const lastName = data.lastName || '';
      const firstName = data.firstName || '';
      card.set('n', `${lastName};${firstName};;;`);

      if (data.organization) card.set('org', data.organization);
      if (data.title) card.set('title', data.title);

      if (data.telWork) {
        card.add('tel', data.telWork, { type: 'WORK,VOICE' });
      }

      if (data.telCell) {
        card.add('tel', data.telCell, { type: 'CELL,VOICE' });
      }

      if (data.email) {
        card.add('email', data.email, { type: 'INTERNET,PREF' });
      }

      if (data.url) card.set('url', data.url);

      if (data.street || data.city || data.state || data.postalCode || data.country) {
        const adr = `;;${data.street || ''};${data.city || ''};${data.state || ''};${data.postalCode || ''};${data.country || ''}`;
        card.set('adr', adr, { type: 'work' });
      }

      if (data.note) card.set('note', data.note);

      return card.toString();
    },

    parse: (raw: string): VCardData => {
      try {
        const card = new VCard().parse(raw);
        const n = card.get('n')?.valueOf()?.toString().split(';') || [];
        const adr = card.get('adr')?.valueOf()?.toString().split(';') || [];

        const tel = card.get('tel');
        const telArr = Array.isArray(tel) ? tel : [tel];
        const telWork = telArr.find((t) => t.is('work'))?.valueOf();
        const telCell = telArr.find((t) => t.is('cell'))?.valueOf();

        return {
          lastName: n[0] || '',
          firstName: n[1] || '',
          organization: (card.get('org')?.valueOf() as string) || '',
          title: (card.get('title')?.valueOf() as string) || '',
          telWork: telWork || '',
          telCell: telCell || '',
          email: (card.get('email')?.valueOf() as string) || '',
          url: (card.get('url')?.valueOf() as string) || '',
          street: adr[2] || '',
          city: adr[3] || '',
          state: adr[4] || '',
          postalCode: adr[5] || '',
          country: adr[6] || '',
          note: (card.get('note')?.valueOf() as string) || '',
        };
      } catch {
        return DATA_SCHEMAS_CONFIG[DataSchemaTypes.vCard].initial;
      }
    },
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
