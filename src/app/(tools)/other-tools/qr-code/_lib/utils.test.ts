import { describe, expect, test } from 'vitest';
import {
  DataSchemaTypes,
  getDefaultStringifiedValue,
  getParsedValue,
  getStringifiedValue,
} from './utils';

describe('qr-code utils', () => {
  describe('getStringifiedValue', () => {
    test('returns text unchanged', () => {
      expect(getStringifiedValue(DataSchemaTypes.Text, { text: 'Hello QR' })).toBe('Hello QR');
    });

    test('adds https to URLs without an http scheme', () => {
      expect(getStringifiedValue(DataSchemaTypes.URL, { text: 'example.com/path' })).toBe(
        'https://example.com/path'
      );
    });

    test('preserves URLs with an http scheme', () => {
      expect(getStringifiedValue(DataSchemaTypes.URL, { text: 'http://example.com' })).toBe(
        'http://example.com'
      );
      expect(getStringifiedValue(DataSchemaTypes.URL, { text: 'https://example.com' })).toBe(
        'https://example.com'
      );
    });

    test('encodes Wi-Fi credentials and hidden status', () => {
      expect(
        getStringifiedValue(DataSchemaTypes.Wifi, {
          ssid: 'Guest Network',
          encryption: 'WPA',
          password: 'welcome123',
          hidden: true,
        })
      ).toBe('WIFI:S:Guest Network;T:WPA;P:welcome123;H:true;;');
    });

    test('encodes geolocation coordinates', () => {
      expect(getStringifiedValue(DataSchemaTypes.Geo, { lat: 37.7749, lng: -122.4194 })).toBe(
        'geo:37.7749,-122.4194'
      );
    });

    test('encodes SMS phone number and message', () => {
      expect(
        getStringifiedValue(DataSchemaTypes.Sms, { phone: '+15551234567', message: 'Hello there' })
      ).toBe('smsto:+15551234567:Hello there');
    });

    test('encodes email fields', () => {
      expect(
        getStringifiedValue(DataSchemaTypes.Email, {
          to: 'hello@example.com',
          subject: 'Hi',
          body: 'See you soon',
        })
      ).toBe('MATMSG:TO:hello@example.com;SUB:Hi;BODY:See you soon;;');
    });

    test('encodes vCard contact details', () => {
      const contact = {
        firstName: 'Alicia',
        lastName: 'Keys',
        organization: 'Studio',
        telWork: '+15551234567',
        telCell: '+15557654321',
        email: 'alicia@example.com',
        url: 'https://example.com',
        street: '1 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        note: 'Call before visiting',
      };
      const encoded = getStringifiedValue(DataSchemaTypes.vCard, contact);

      expect(encoded).toBe(
        [
          'BEGIN:VCARD',
          'VERSION:4.0',
          'N:Keys;Alicia;;;',
          'ORG:Studio',
          'TEL;TYPE=WORK,VOICE:+15551234567',
          'TEL;TYPE=CELL,VOICE:+15557654321',
          'EMAIL;TYPE=INTERNET,PREF:alicia@example.com',
          'URL:https://example.com',
          'ADR;TYPE=work:;;1 Main St;New York;NY;10001;US',
          'NOTE:Call before visiting',
          'END:VCARD',
        ].join('\r\n')
      );
      expect(getParsedValue(DataSchemaTypes.vCard, encoded)).toMatchObject(contact);
    });

    test('omits empty vCard fields and preserves partial addresses', () => {
      const encoded = getStringifiedValue(DataSchemaTypes.vCard, {
        firstName: 'Riley',
        lastName: 'Doe',
        telCell: '+15550001111',
        country: 'CA',
      });

      expect(encoded).toBe(
        [
          'BEGIN:VCARD',
          'VERSION:4.0',
          'N:Doe;Riley;;;',
          'TEL;TYPE=CELL,VOICE:+15550001111',
          'ADR;TYPE=work:;;;;;;CA',
          'END:VCARD',
        ].join('\r\n')
      );
    });
  });

  describe('getDefaultStringifiedValue', () => {
    test('returns the default payload for each non-vCard schema', () => {
      expect(getDefaultStringifiedValue(DataSchemaTypes.Text)).toBe('Hello World');
      expect(getDefaultStringifiedValue(DataSchemaTypes.URL)).toBe('https://');
      expect(getDefaultStringifiedValue(DataSchemaTypes.Wifi)).toBe('WIFI:S:;T:WPA;P:;H:false;;');
      expect(getDefaultStringifiedValue(DataSchemaTypes.Geo)).toBe('geo:0,0');
      expect(getDefaultStringifiedValue(DataSchemaTypes.Sms)).toBe('smsto::');
      expect(getDefaultStringifiedValue(DataSchemaTypes.Email)).toBe('MATMSG:TO:;SUB:;BODY:;;');
    });
  });

  describe('getParsedValue', () => {
    test('parses text and URL payloads without changing their contents', () => {
      expect(getParsedValue(DataSchemaTypes.Text, 'hello')).toEqual({ text: 'hello' });
      expect(getParsedValue(DataSchemaTypes.URL, 'https://example.com')).toEqual({
        text: 'https://example.com',
      });
    });

    test('parses Wi-Fi credentials and hidden status', () => {
      expect(getParsedValue(DataSchemaTypes.Wifi, 'WIFI:S:Office;T:WPA;P:secret;H:true;;')).toEqual(
        {
          ssid: 'Office',
          encryption: 'WPA',
          password: 'secret',
          hidden: true,
        }
      );
    });

    test('returns null for malformed Wi-Fi payloads', () => {
      expect(getParsedValue(DataSchemaTypes.Wifi, 'not a Wi-Fi payload')).toBeNull();
    });

    test('parses geolocation coordinates', () => {
      expect(getParsedValue(DataSchemaTypes.Geo, 'geo:37.7749,-122.4194')).toEqual({
        lat: 37.7749,
        lng: -122.4194,
      });
    });

    test('parses SMS phone number and message', () => {
      expect(getParsedValue(DataSchemaTypes.Sms, 'smsto:+15551234567:Hello there')).toEqual({
        phone: '+15551234567',
        message: 'Hello there',
      });
    });

    test('parses vCard contact details', () => {
      const vCard = [
        'BEGIN:VCARD',
        'VERSION:4.0',
        'N:Keys;Alicia;;;',
        'ORG:Studio',
        'TITLE:Designer',
        'TEL;TYPE=WORK,VOICE:+15551234567',
        'TEL;TYPE=CELL,VOICE:+15557654321',
        'EMAIL;TYPE=INTERNET,PREF:alicia@example.com',
        'URL:https://example.com',
        'ADR;TYPE=work:;;1 Main St;New York;NY;10001;US',
        'NOTE:Call before visiting',
        'END:VCARD',
      ].join('\r\n');

      expect(getParsedValue(DataSchemaTypes.vCard, vCard)).toEqual({
        firstName: 'Alicia',
        lastName: 'Keys',
        organization: 'Studio',
        title: 'Designer',
        telWork: '+15551234567',
        telCell: '+15557654321',
        email: 'alicia@example.com',
        url: 'https://example.com',
        street: '1 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        note: 'Call before visiting',
      });
    });

    test('selects phone numbers by type regardless of their order', () => {
      const vCard = [
        'BEGIN:VCARD',
        'VERSION:4.0',
        'TEL;TYPE=CELL,VOICE:+15557654321',
        'TEL;TYPE=WORK,VOICE:+15551234567',
        'END:VCARD',
      ].join('\r\n');

      expect(getParsedValue(DataSchemaTypes.vCard, vCard)).toMatchObject({
        telWork: '+15551234567',
        telCell: '+15557654321',
      });
    });

    test('parses a single telephone property', () => {
      const vCard = [
        'BEGIN:VCARD',
        'VERSION:4.0',
        'TEL;TYPE=CELL,VOICE:+15557654321',
        'END:VCARD',
      ].join('\r\n');

      expect(getParsedValue(DataSchemaTypes.vCard, vCard)).toMatchObject({
        telWork: '',
        telCell: '+15557654321',
      });
    });

    test('returns the initial vCard value when parsing fails', () => {
      expect(getParsedValue(DataSchemaTypes.vCard, 'not a vCard')).toEqual({
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
      });
    });

    test('parses email fields', () => {
      expect(
        getParsedValue(
          DataSchemaTypes.Email,
          'MATMSG:TO:hello@example.com;SUB:Hi;BODY:See you soon;;'
        )
      ).toEqual({ to: 'hello@example.com', subject: 'Hi', body: 'See you soon' });
    });
  });
});
